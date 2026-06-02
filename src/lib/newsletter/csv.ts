import type { NewsletterSubscriber } from "@/lib/newsletter/types";
import { NEWSLETTER_SOURCE_LABELS } from "@/lib/newsletter/sources";

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function subscribersToCsv(rows: NewsletterSubscriber[]): string {
  const header = [
    "id",
    "name",
    "email",
    "source",
    "status",
    "provider",
    "external_id",
    "synced_at",
    "created_at",
  ];

  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.id,
        row.name,
        row.email,
        NEWSLETTER_SOURCE_LABELS[row.source] ?? row.source,
        row.status,
        row.provider ?? "",
        row.external_id ?? "",
        row.synced_at ?? "",
        row.created_at,
      ]
        .map((v) => escapeCsvField(String(v)))
        .join(","),
    ),
  ];

  return `\uFEFF${lines.join("\r\n")}`;
}
