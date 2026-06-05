import type { LeadAutomationRunRecord, LeadAutomationRunStatus } from "@/lib/crm/types";
import type { EmailAutomationProviderId } from "@/lib/email-automation/types";
import { getCrmDbClient } from "@/lib/crm/db";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

function mapRow(row: {
  id: string;
  lead_id: string;
  sequence_id: string;
  status: string;
  current_step_index: number;
  steps_completed: unknown[] | null;
  next_step_at: string | null;
  esp_provider: string | null;
  started_at: string;
  completed_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}): LeadAutomationRunRecord {
  return {
    id: row.id,
    leadId: row.lead_id,
    sequenceId: row.sequence_id,
    status: row.status as LeadAutomationRunStatus,
    currentStepIndex: row.current_step_index,
    stepsCompleted: row.steps_completed ?? [],
    nextStepAt: row.next_step_at,
    espProvider: (row.esp_provider as EmailAutomationProviderId | null) ?? null,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createAutomationRun(input: {
  leadId: string;
  sequenceId: string;
  espProvider?: EmailAutomationProviderId | null;
  nextStepAt?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<LeadAutomationRunRecord | null> {
  const admin = getServiceRoleClient();
  if (!admin) return null;

  const { data, error } = await admin
    .from("lead_automation_runs")
    .insert({
      lead_id: input.leadId,
      sequence_id: input.sequenceId,
      status: "active",
      current_step_index: 0,
      esp_provider: input.espProvider ?? null,
      next_step_at: input.nextStepAt ?? null,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[crm:automation-run:create]", error);
    }
    return null;
  }

  return mapRow(data);
}

export async function updateAutomationRun(
  runId: string,
  patch: {
    status?: LeadAutomationRunStatus;
    currentStepIndex?: number;
    stepsCompleted?: unknown[];
    nextStepAt?: string | null;
    completedAt?: string | null;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  const admin = getServiceRoleClient();
  if (!admin) return;

  await admin
    .from("lead_automation_runs")
    .update({
      ...(patch.status ? { status: patch.status } : {}),
      ...(patch.currentStepIndex !== undefined
        ? { current_step_index: patch.currentStepIndex }
        : {}),
      ...(patch.stepsCompleted ? { steps_completed: patch.stepsCompleted } : {}),
      ...(patch.nextStepAt !== undefined ? { next_step_at: patch.nextStepAt } : {}),
      ...(patch.completedAt !== undefined ? { completed_at: patch.completedAt } : {}),
      ...(patch.metadata ? { metadata: patch.metadata } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", runId);
}

export async function listLeadAutomationRuns(
  leadId: string,
): Promise<LeadAutomationRunRecord[]> {
  const client = await getCrmDbClient();

  const { data, error } = await client
    .from("lead_automation_runs")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function listPendingAutomationRuns(limit = 50): Promise<LeadAutomationRunRecord[]> {
  const admin = getServiceRoleClient();
  if (!admin) return [];

  const now = new Date().toISOString();
  const { data, error } = await admin
    .from("lead_automation_runs")
    .select("*")
    .eq("status", "active")
    .not("next_step_at", "is", null)
    .lte("next_step_at", now)
    .order("next_step_at", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function countActiveAutomations(): Promise<number> {
  const admin = getServiceRoleClient();
  if (!admin) return 0;

  const { count, error } = await admin
    .from("lead_automation_runs")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  if (error) return 0;
  return count ?? 0;
}

export async function countPendingSteps(): Promise<number> {
  const admin = getServiceRoleClient();
  if (!admin) return 0;

  const now = new Date().toISOString();
  const { count, error } = await admin
    .from("lead_automation_runs")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .not("next_step_at", "is", null)
    .lte("next_step_at", now);

  if (error) return 0;
  return count ?? 0;
}
