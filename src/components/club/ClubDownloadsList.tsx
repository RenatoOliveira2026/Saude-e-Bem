import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatSubscriptionDate } from "@/lib/club/constants";
import type { UserDownload } from "@/lib/club/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

const typeLabels: Record<UserDownload["contentType"], string> = {
  article: "Artigo",
  protocol: "Protocolo",
  ebook: "Biblioteca",
};

interface ClubDownloadsListProps {
  downloads: UserDownload[];
}

export function ClubDownloadsList({ downloads }: ClubDownloadsListProps) {
  if (downloads.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="font-heading text-xl text-forest">Nenhum download registrado</h2>
        <p className="mt-3 text-muted">
          Quando você baixar materiais da biblioteca, eles aparecerão aqui.
        </p>
        <Button href={routes.biblioteca} variant="primary" size="sm" className="mt-6">
          Explorar biblioteca
        </Button>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {downloads.map((item) => {
        const href =
          item.contentSlug && item.contentType === "ebook"
            ? routes.bibliotecaItem(item.contentSlug)
            : item.contentSlug && item.contentType === "protocol"
              ? routes.protocolo(item.contentSlug)
              : item.contentSlug && item.contentType === "article"
                ? routes.artigo(item.contentSlug)
                : null;

        return (
          <li key={item.id}>
            <Card className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  {href ? (
                    <Link href={href} className="font-heading font-semibold text-forest hover:text-sage">
                      {item.contentTitle}
                    </Link>
                  ) : (
                    <p className="font-heading font-semibold text-forest">
                      {item.contentTitle}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-muted">
                    {typeLabels[item.contentType]} ·{" "}
                    {formatSubscriptionDate(item.createdAt)}
                  </p>
                </div>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
