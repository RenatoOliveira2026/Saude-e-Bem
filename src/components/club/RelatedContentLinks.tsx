import { Card } from "@/components/ui/Card";
import Link from "next/link";

interface RelatedContentLinksProps {
  title: string;
  links: Array<{ label: string; href: string; description?: string }>;
}

export function RelatedContentLinks({ title, links }: RelatedContentLinksProps) {
  if (links.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="font-heading text-xl text-forest">{title}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <Card className="h-full p-4 transition-shadow hover:shadow-soft">
              <Link href={link.href}>
                <p className="font-medium text-forest">{link.label}</p>
                {link.description && (
                  <p className="mt-1 text-xs text-muted">{link.description}</p>
                )}
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
