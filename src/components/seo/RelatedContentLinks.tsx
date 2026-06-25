import { Icon } from "@/components/icons";
import type { InternalLinkItem } from "@/lib/seo/internal-links";
import Link from "next/link";

interface RelatedContentLinksProps {
  title?: string;
  links: InternalLinkItem[];
}

const TYPE_LABELS: Record<InternalLinkItem["type"], string> = {
  article: "Artigo",
  protocol: "Protocolo",
  library: "Biblioteca",
  tool: "Ferramenta",
  checklist: "Checklist",
};

export function RelatedContentLinks({
  title = "Conteúdos relacionados",
  links,
}: RelatedContentLinksProps) {
  if (links.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="font-heading text-lg text-forest">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={`${link.type}-${link.slug}`}>
            <Link
              href={link.href}
              className="group flex items-start gap-3 rounded-lg p-2 transition hover:bg-sage-muted/40"
            >
              <Icon name="arrow-right" size={14} className="mt-1 text-gold" />
              <div>
                <p className="text-sm font-medium text-forest group-hover:underline">
                  {link.title}
                </p>
                <p className="text-xs text-muted-light">{TYPE_LABELS[link.type]}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
