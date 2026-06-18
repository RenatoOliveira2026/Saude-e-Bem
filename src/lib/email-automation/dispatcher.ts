import {
  createAutomationRun,
  listPendingAutomationRuns,
  updateAutomationRun,
} from "@/lib/crm/automation-runs";
import { recordLeadInteraction } from "@/lib/crm/interactions";
import { updateLeadEspSync } from "@/lib/crm/esp-sync";
import type { AutomationDispatchResult, LeadAutomationPayload } from "./types";
import { EMAIL_AUTOMATION_SEQUENCES, getSequenceForLead } from "./sequences";
import { syncLeadToProviders } from "./providers";

function computeNextStepAt(delayHours: number): string {
  return new Date(Date.now() + delayHours * 60 * 60 * 1000).toISOString();
}

async function logCaptureInteractions(
  leadId: string,
  payload: LeadAutomationPayload & { isExisting: boolean; previousScore?: string | null },
): Promise<void> {
  await recordLeadInteraction({
    leadId,
    eventType: payload.isExisting ? "lead_recaptured" : "lead_captured",
    title: payload.isExisting ? "Lead reengajado" : "Lead capturado",
    description: `Origem: ${payload.source}${payload.interest ? ` · ${payload.interest}` : ""}`,
    source: payload.source,
    metadata: {
      interest: payload.interest,
      leadScore: payload.leadScore,
      contentContext: payload.contentContext ?? {},
    },
  });

  if (
    payload.isExisting &&
    payload.previousScore &&
    payload.previousScore !== payload.leadScore
  ) {
    await recordLeadInteraction({
      leadId,
      eventType: "score_upgraded",
      title: "Score atualizado",
      description: `${payload.previousScore} → ${payload.leadScore}`,
      source: payload.source,
      metadata: {
        previousScore: payload.previousScore,
        newScore: payload.leadScore,
      },
    });
  }
}

/**
 * Dispara automação de e-mail para um lead capturado ou reengajado.
 * Persiste run, interações e prepara steps com delay.
 */
export async function triggerLeadAutomation(
  lead: LeadAutomationPayload & {
    leadId: string;
    isExisting?: boolean;
    previousScore?: string | null;
  },
): Promise<AutomationDispatchResult> {
  if (lead.isExisting !== undefined) {
    await logCaptureInteractions(lead.leadId, {
      ...lead,
      isExisting: lead.isExisting,
      previousScore: lead.previousScore,
    });
  }

  const sequence = getSequenceForLead(lead.interest, lead.leadScore, lead.source);
  if (!sequence) {
    return { ok: true, skipped: true, reason: "Nenhuma sequência para este perfil." };
  }

  const firstStep = sequence.steps[0];
  const secondStep = sequence.steps[1];
  const nextStepAt =
    secondStep?.type === "delay" && secondStep.delayHours
      ? computeNextStepAt(secondStep.delayHours)
      : null;

  const run = await createAutomationRun({
    leadId: lead.leadId,
    sequenceId: sequence.id,
    nextStepAt,
    metadata: { interest: lead.interest, leadScore: lead.leadScore },
  });

  if (run) {
    await recordLeadInteraction({
      leadId: lead.leadId,
      eventType: "sequence_started",
      title: `Sequência iniciada: ${sequence.name}`,
      description: firstStep?.subject,
      metadata: { sequenceId: sequence.id, runId: run.id },
    });

    if (firstStep) {
      await recordLeadInteraction({
        leadId: lead.leadId,
        eventType: "sequence_step_sent",
        title: `E-mail imediato: ${firstStep.subject}`,
        metadata: {
          stepId: firstStep.id,
          templateKey: firstStep.templateKey,
          runId: run.id,
        },
      });
    }

    if (nextStepAt && secondStep) {
      await recordLeadInteraction({
        leadId: lead.leadId,
        eventType: "sequence_step_scheduled",
        title: `Próximo e-mail agendado: ${secondStep.subject}`,
        description: `Previsto para ${new Date(nextStepAt).toLocaleString("pt-BR")}`,
        metadata: {
          stepId: secondStep.id,
          runId: run.id,
          nextStepAt,
        },
      });
    }
  }

  const providerResult = await syncLeadToProviders(lead, sequence.id);

  if (providerResult.provider) {
    await updateLeadEspSync(lead.email, {
      provider: providerResult.provider,
      externalId: providerResult.externalId ?? null,
      syncError: providerResult.skipped ? providerResult.reason ?? null : null,
    });

    await recordLeadInteraction({
      leadId: lead.leadId,
      eventType: providerResult.skipped ? "esp_sync_failed" : "esp_synced",
      title: providerResult.skipped ? "Sync ESP pendente" : "Contato sincronizado no ESP",
      description: providerResult.reason,
      metadata: {
        provider: providerResult.provider,
        externalId: providerResult.externalId,
        sequenceId: sequence.id,
      },
    });
  }

  return {
    ok: true,
    sequenceId: sequence.id,
    runId: run?.id,
    provider: providerResult.provider,
    skipped: providerResult.skipped,
    reason: providerResult.reason,
  };
}

export async function processPendingAutomationSteps(): Promise<{
  processed: number;
  completed: number;
}> {
  const pending = await listPendingAutomationRuns(25);
  let processed = 0;
  let completed = 0;

  for (const run of pending) {
    const sequence = EMAIL_AUTOMATION_SEQUENCES.find((s) => s.id === run.sequenceId);
    if (!sequence) continue;

    const nextIndex = run.currentStepIndex + 1;
    const step = sequence.steps[nextIndex];
    if (!step) {
      await updateAutomationRun(run.id, {
        status: "completed",
        completedAt: new Date().toISOString(),
        nextStepAt: null,
      });
      await recordLeadInteraction({
        leadId: run.leadId,
        eventType: "sequence_completed",
        title: "Sequência concluída",
        metadata: { sequenceId: run.sequenceId, runId: run.id },
      });
      completed += 1;
      processed += 1;
      continue;
    }

    const stepsCompleted = [
      ...run.stepsCompleted,
      {
        stepId: step.id,
        subject: step.subject,
        sentAt: new Date().toISOString(),
      },
    ];

    const following = sequence.steps[nextIndex + 1];
    const nextStepAt =
      following?.type === "delay" && following.delayHours
        ? computeNextStepAt(following.delayHours)
        : null;

    const isLast = nextIndex >= sequence.steps.length - 1;

    await updateAutomationRun(run.id, {
      currentStepIndex: nextIndex,
      stepsCompleted,
      nextStepAt: isLast ? null : nextStepAt,
      ...(isLast
        ? { status: "completed", completedAt: new Date().toISOString() }
        : {}),
    });

    await recordLeadInteraction({
      leadId: run.leadId,
      eventType: isLast ? "sequence_completed" : "sequence_step_sent",
      title: isLast ? "Sequência concluída" : `E-mail enviado: ${step.subject}`,
      metadata: {
        stepId: step.id,
        templateKey: step.templateKey,
        runId: run.id,
        sequenceId: run.sequenceId,
      },
    });

    if (isLast) completed += 1;
    processed += 1;
  }

  return { processed, completed };
}
