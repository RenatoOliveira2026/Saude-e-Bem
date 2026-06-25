import { PremiumBenefitsHub } from "@/components/premium/PremiumBenefitsHub";
import { getPremiumBenefitsHubData } from "@/lib/premium/benefits-hub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Benefícios Premium — Clube Saúde & Bem",
  description:
    "Novidades, destaques, conteúdos mais acessados e recomendações da semana para membros Premium.",
};

export default async function ClubeBeneficiosPage() {
  const data = await getPremiumBenefitsHubData();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-gold">Exclusivo</p>
        <h1 className="mt-2 font-heading text-3xl text-forest">Benefícios Premium</h1>
        <p className="mt-3 max-w-2xl text-muted leading-relaxed">
          Curadoria semanal de conteúdos premium — novidades, destaques editoriais e o que
          a comunidade mais acessa.
        </p>
      </header>
      <PremiumBenefitsHub data={data} />
    </div>
  );
}
