import type { NewsletterSource, NewsletterSubscriber } from "@/lib/newsletter/types";
import { createClient } from "@/lib/supabase/server";

export interface NewsletterLeadStats {
  total: number;
  active: number;
  last7Days: number;
  last30Days: number;
  bySource: Record<NewsletterSource, number>;
  pendingSync: number;
}

function mapRow(row: Record<string, unknown>): NewsletterSubscriber {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    source: row.source as NewsletterSubscriber["source"],
    status: row.status as NewsletterSubscriber["status"],
    provider: (row.provider as NewsletterSubscriber["provider"]) ?? null,
    external_id: row.external_id ? String(row.external_id) : null,
    synced_at: row.synced_at ? String(row.synced_at) : null,
    sync_error: row.sync_error ? String(row.sync_error) : null,
    metadata:
      typeof row.metadata === "object" && row.metadata !== null
        ? (row.metadata as Record<string, unknown>)
        : {},
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function adminListNewsletterSubscribers(options?: {
  source?: NewsletterSource;
  limit?: number;
}): Promise<NewsletterSubscriber[]> {
  const supabase = await createClient();
  let query = supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.source) {
    query = query.eq("source", options.source);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
}

export async function getNewsletterLeadStats(): Promise<NewsletterLeadStats> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("source, status, synced_at, created_at");

  if (error) throw error;

  const rows = data ?? [];
  const now = Date.now();
  const day7 = now - 7 * 24 * 60 * 60 * 1000;
  const day30 = now - 30 * 24 * 60 * 60 * 1000;

  const bySource: NewsletterLeadStats["bySource"] = {
    home: 0,
    blog: 0,
    biblioteca: 0,
    clube: 0,
    other: 0,
  };

  let active = 0;
  let last7Days = 0;
  let last30Days = 0;
  let pendingSync = 0;

  for (const row of rows) {
    const source = row.source as NewsletterSource;
    if (source in bySource) bySource[source] += 1;

    if (row.status === "active") active += 1;
    if (row.status === "active" && !row.synced_at) pendingSync += 1;

    const created = new Date(row.created_at).getTime();
    if (created >= day7) last7Days += 1;
    if (created >= day30) last30Days += 1;
  }

  return {
    total: rows.length,
    active,
    last7Days,
    last30Days,
    bySource,
    pendingSync,
  };
}
