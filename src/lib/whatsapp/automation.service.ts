import { getLeadInterestLabel } from "@/lib/leads/lead.constants";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { sendWhatsAppTemplateToLead } from "./outbound.service";
import {
  getStepDelayMs,
  getWhatsAppSequenceForLead,
  WHATSAPP_NURTURE_SEQUENCES,
} from "./sequences";
import type { WhatsAppSequenceContext } from "./sequences.types";

export async function startWhatsAppAutomation(input: {
  leadId: string;
  phone: string;
  name: string | null;
  interest: string | null;
  leadScore: string;
}): Promise<void> {
  const sequence = getWhatsAppSequenceForLead({
    leadScore: input.leadScore,
    hasOptIn: true,
  });
  if (!sequence) return;

  const admin = getServiceRoleClient();
  if (!admin) return;

  const { data: existing } = await admin
    .from("whatsapp_automation_runs")
    .select("id")
    .eq("lead_id", input.leadId)
    .eq("sequence_id", sequence.id)
    .in("status", ["active", "completed"])
    .limit(1)
    .maybeSingle();

  if (existing) return;

  const firstStep = sequence.steps[0];
  const ctx: WhatsAppSequenceContext = {
    name: input.name,
    interestLabel: input.interest ? getLeadInterestLabel(input.interest) : null,
  };

  if (firstStep.type === "immediate") {
    await sendWhatsAppTemplateToLead({
      phone: input.phone,
      templateKey: firstStep.templateKey,
      bodyParameters: firstStep.buildParameters(ctx),
      leadId: input.leadId,
      metadata: { sequence_id: sequence.id, step_id: firstStep.id },
    });
  }

  const nextStep = sequence.steps[1];
  if (!nextStep) {
    await admin.from("whatsapp_automation_runs").insert({
      lead_id: input.leadId,
      sequence_id: sequence.id,
      status: "completed",
      current_step_index: 1,
      next_step_at: null,
      completed_at: new Date().toISOString(),
      steps_completed: firstStep.type === "immediate" ? [firstStep.id] : [],
      metadata: { phone: input.phone },
    });
    return;
  }

  const nextAt = new Date(Date.now() + getStepDelayMs(nextStep)).toISOString();

  await admin.from("whatsapp_automation_runs").insert({
    lead_id: input.leadId,
    sequence_id: sequence.id,
    status: "active",
    current_step_index: 1,
    next_step_at: nextAt,
    steps_completed: firstStep.type === "immediate" ? [firstStep.id] : [],
    metadata: { phone: input.phone },
  });
}

export async function processDueWhatsAppAutomations(): Promise<number> {
  const admin = getServiceRoleClient();
  if (!admin) return 0;

  const now = new Date().toISOString();
  const { data: runs } = await admin
    .from("whatsapp_automation_runs")
    .select("*")
    .eq("status", "active")
    .not("next_step_at", "is", null)
    .lte("next_step_at", now)
    .limit(25);

  let processed = 0;

  for (const run of runs ?? []) {
    const sequence = WHATSAPP_NURTURE_SEQUENCES.find((s) => s.id === run.sequence_id);
    if (!sequence) continue;

    const { data: leadRow } = await admin
      .from("newsletter_leads")
      .select("name, interest, lead_score, phone, whatsapp_opt_in, whatsapp_opt_out_at")
      .eq("id", run.lead_id)
      .maybeSingle();

    const lead = leadRow;

    if (!lead?.phone || !lead.whatsapp_opt_in || lead.whatsapp_opt_out_at) {
      await admin
        .from("whatsapp_automation_runs")
        .update({ status: "paused", updated_at: now })
        .eq("id", run.id);
      continue;
    }

    const step = sequence.steps[run.current_step_index];
    if (!step) {
      await admin
        .from("whatsapp_automation_runs")
        .update({
          status: "completed",
          completed_at: now,
          next_step_at: null,
          updated_at: now,
        })
        .eq("id", run.id);
      continue;
    }

    const ctx: WhatsAppSequenceContext = {
      name: lead.name,
      interestLabel: lead.interest ? getLeadInterestLabel(lead.interest) : null,
    };

    await sendWhatsAppTemplateToLead({
      phone: lead.phone,
      templateKey: step.templateKey,
      bodyParameters: step.buildParameters(ctx),
      leadId: run.lead_id,
      metadata: { sequence_id: sequence.id, step_id: step.id },
    });

    const nextIndex = run.current_step_index + 1;
    const nextStep = sequence.steps[nextIndex];

    if (!nextStep) {
      await admin
        .from("whatsapp_automation_runs")
        .update({
          status: "completed",
          completed_at: now,
          current_step_index: nextIndex,
          next_step_at: null,
          steps_completed: [...(run.steps_completed as unknown[]), step.id],
          updated_at: now,
        })
        .eq("id", run.id);
    } else {
      const nextAt = new Date(Date.now() + getStepDelayMs(nextStep)).toISOString();
      await admin
        .from("whatsapp_automation_runs")
        .update({
          current_step_index: nextIndex,
          next_step_at: nextAt,
          steps_completed: [...(run.steps_completed as unknown[]), step.id],
          updated_at: now,
        })
        .eq("id", run.id);
    }

    processed += 1;
  }

  return processed;
}

export async function processRenewalReminders(): Promise<number> {
  const admin = getServiceRoleClient();
  if (!admin) return 0;

  const in7Days = new Date();
  in7Days.setDate(in7Days.getDate() + 7);

  const { data: subs } = await admin
    .from("subscriptions")
    .select("user_id, current_period_end, billing_plan_id")
    .in("status", ["active", "trialing"])
    .eq("auto_renew", false)
    .gte("current_period_end", new Date().toISOString())
    .lte("current_period_end", in7Days.toISOString())
    .limit(20);

  let sent = 0;

  for (const sub of subs ?? []) {
    const { data: user } = await admin.auth.admin.getUserById(sub.user_id);
    const email = user.user?.email;
    if (!email) continue;

    const { data: lead } = await admin
      .from("newsletter_leads")
      .select("id, phone, whatsapp_opt_in, whatsapp_opt_out_at")
      .eq("email", email.toLowerCase())
      .not("phone", "is", null)
      .eq("whatsapp_opt_in", true)
      .is("whatsapp_opt_out_at", null)
      .limit(1)
      .maybeSingle();

    if (!lead?.phone) continue;

    const renewalDate = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(sub.current_period_end!));

    await sendWhatsAppTemplateToLead({
      phone: lead.phone,
      templateKey: "sb_renovacao_lembrete",
      bodyParameters: [renewalDate],
      leadId: lead.id,
      userId: sub.user_id,
      metadata: { trigger: "renewal_reminder_cron" },
    });
    sent += 1;
  }

  return sent;
}
