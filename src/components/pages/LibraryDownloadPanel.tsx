"use client";

import { TrackedDownloadLink } from "@/components/analytics";
import { trackDownloadAction } from "@/lib/club/actions/download.actions";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

interface LibraryDownloadPanelProps {
  pdfUrl?: string;
  title: string;
  slug: string;
  contentId: string;
}

export function LibraryDownloadPanel({
  pdfUrl,
  title,
  slug,
  contentId,
}: LibraryDownloadPanelProps) {
  async function handleDownloadTrack() {
    void trackDownloadAction({
      contentType: "ebook",
      contentId,
      contentTitle: title,
      contentSlug: slug,
    });
  }

  if (pdfUrl) {
    return (
      <div className="mt-8 rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted">
          Seu material está pronto. O download abre em uma nova aba.
        </p>
        <TrackedDownloadLink
          href={pdfUrl}
          contentId={slug}
          contentTitle={title}
          sourcePage={routes.bibliotecaItem(slug)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            void handleDownloadTrack();
          }}
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-medium text-off-white shadow-soft transition hover:bg-forest-light"
        >
          Baixar {title}
        </TrackedDownloadLink>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-surface p-6 text-center">
      <p className="text-sm text-muted">
        Em breve você poderá baixar este material aqui. Cadastre-se na newsletter
        na home para ser avisado — ou volte em alguns dias.
      </p>
      <Button href={routes.home} variant="outline" size="md" className="mt-4">
        Voltar à Home
      </Button>
    </div>
  );
}
