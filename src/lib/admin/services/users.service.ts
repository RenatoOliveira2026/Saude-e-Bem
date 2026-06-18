import { createClient } from "@/lib/supabase/server";
import { isBillingProfileComplete } from "@/lib/billing/profile";
import type { AdminUserRow } from "../types";

export async function adminListUsers(): Promise<AdminUserRow[]> {
  const supabase = await createClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select(
      "id, email, name, full_name, cpf, celular, cep, cidade, estado, endereco, numero, bairro, complemento, billing_completed_at, created_at",
    )
    .order("created_at", { ascending: false });

  if (profilesError) throw profilesError;

  const { data: preferences, error: prefsError } = await supabase
    .from("user_preferences")
    .select("user_id, goal");

  if (prefsError) throw prefsError;

  const goalByUser = new Map(
    (preferences ?? []).map((p) => [p.user_id, p.goal]),
  );

  return (profiles ?? []).map((profile) => ({
    id: profile.id,
    email: profile.email,
    name: profile.name,
    full_name: profile.full_name,
    cpf: profile.cpf,
    celular: profile.celular,
    cep: profile.cep,
    cidade: profile.cidade,
    estado: profile.estado,
    billing_complete: isBillingProfileComplete(profile),
    goal: goalByUser.get(profile.id) ?? null,
    created_at: profile.created_at,
  }));
}
