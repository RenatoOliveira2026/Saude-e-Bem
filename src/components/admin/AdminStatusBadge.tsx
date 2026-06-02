import { cn } from "@/lib/cn";
import type { ContentPublishStatus } from "@/lib/admin/cms/form-utils";

const styles: Record<ContentPublishStatus, string> = {
  published: "bg-sage/15 text-forest",
  draft: "bg-gold/20 text-forest",
  archived: "bg-muted/20 text-muted",
};

const labels: Record<ContentPublishStatus, string> = {
  published: "Publicado",
  draft: "Rascunho",
  archived: "Arquivado",
};

export function AdminStatusBadge({ status }: { status: string }) {
  const key =
    status === "published" || status === "draft" || status === "archived"
      ? status
      : "draft";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[key],
      )}
    >
      {labels[key]}
    </span>
  );
}
