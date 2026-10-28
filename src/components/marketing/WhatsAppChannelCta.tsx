import { BrandIcon } from "@/components/marketing/BrandIcon";
import { getMarketingSettings } from "@/lib/marketing/settings";

/**
 * Convite para seguir o Canal do WhatsApp. Só aparece quando o endereço do
 * canal está salvo em Admin → Marketing → Contas.
 */
export async function WhatsAppChannelCta({ className = "" }: { className?: string }) {
  const settings = await getMarketingSettings();
  const url = settings.social_whatsapp;
  if (!url) return null;

  return (
    <aside
      className={`flex flex-col gap-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/5 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6 ${className}`}
      aria-label="Canal do WhatsApp"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
        <BrandIcon id="whatsapp" className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-lg font-semibold text-forest">
          Receba dicas como esta no seu WhatsApp
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          2 a 3 dicas por semana, de graça. Ninguém vê o seu número.
        </p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#1DA851] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#178a43] focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 focus:ring-offset-2"
      >
        Seguir o canal
      </a>
    </aside>
  );
}
