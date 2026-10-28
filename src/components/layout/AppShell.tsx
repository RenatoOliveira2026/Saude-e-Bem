import { FounderBanner } from "@/components/campaign/FounderCampaign";
import { Footer } from "@/components/layout/Footer";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { NewsletterSmartPopup } from "@/components/newsletter/NewsletterSmartPopup";
import { WhatsAppFloatingButton } from "@/components/whatsapp";
import { headers } from "next/headers";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <FounderBanner />
      <HeaderWrapper />
      <main className="flex-1">{children}</main>
      {/* A home já tem a seção de newsletter logo acima do rodapé. */}
      <Footer showNewsletter={pathname !== "/"} />
      <WhatsAppFloatingButton />
      <NewsletterSmartPopup />
    </>
  );
}
