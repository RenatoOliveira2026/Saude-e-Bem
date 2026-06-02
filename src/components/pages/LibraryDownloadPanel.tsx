import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

interface LibraryDownloadPanelProps {
  pdfUrl?: string;
  title: string;
}

export function LibraryDownloadPanel({ pdfUrl, title }: LibraryDownloadPanelProps) {
  if (pdfUrl) {
    return (
      <div className="mt-8 rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted">
          Seu material está pronto. O download abre em uma nova aba.
        </p>
        <Button
          href={pdfUrl}
          variant="primary"
          size="md"
          className="mt-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Baixar {title}
        </Button>
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
