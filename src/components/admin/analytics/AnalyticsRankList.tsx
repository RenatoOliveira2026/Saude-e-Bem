import type { RankedContentItem } from "@/lib/analytics/types";

interface AnalyticsRankListProps {
  title: string;
  items: RankedContentItem[];
  emptyMessage: string;
}

export function AnalyticsRankList({
  title,
  items,
  emptyMessage,
}: AnalyticsRankListProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="font-heading text-lg font-semibold text-forest">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{emptyMessage}</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item.contentId}-${index}`}
              className="flex items-center justify-between gap-4 rounded-xl bg-off-white px-4 py-3"
            >
              <span className="text-sm font-medium text-forest line-clamp-1">
                {index + 1}. {item.contentTitle}
              </span>
              <span className="shrink-0 rounded-full bg-sage-muted px-3 py-1 text-xs font-semibold text-forest">
                {item.count}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
