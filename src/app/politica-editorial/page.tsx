import { LegalPageLayout, LegalSection } from "@/components/layout/LegalPageLayout";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = buildContentMetadata({
  title: "Política Editorial",
  description:
    "Como a equipe Saúde & Bem produz, revisa e atualiza seus conteúdos sobre saúde, bem-estar e longevidade.",
  path: routes.politicaEditorial,
});

const UPDATED_AT = "25 de outubro de 2026";
const CONTACT_EMAIL = "contato@saudeebem.com.br";

export default function PoliticaEditorialPage() {
  return (
    <LegalPageLayout
      badge="Transparência"
      title="Política Editorial"
      description="Quem escreve, como pesquisamos e quais são os limites do conteúdo publicado no Saúde & Bem."
      updatedAt={UPDATED_AT}
    >
      <LegalSection title="Quem produz o conteúdo">
        <p>
          Os artigos, guias e protocolos do Saúde & Bem são produzidos pela{" "}
          <strong>Equipe Saúde & Bem</strong>, a equipe editorial do portal. Quando um conteúdo
          for escrito ou revisado por um profissional de saúde, o nome e o registro profissional
          (CRM, CRN ou equivalente) aparecerão de forma explícita no próprio artigo.
        </p>
      </LegalSection>

      <LegalSection title="Como pesquisamos">
        <ul>
          <li>
            Priorizamos diretrizes de órgãos oficiais e sociedades médicas, revisões sistemáticas
            e estudos publicados em periódicos revisados por pares.
          </li>
          <li>
            Evitamos promessas de resultado, curas milagrosas e recomendações que dependam de
            avaliação individual.
          </li>
          <li>
            Revisamos os conteúdos periodicamente e atualizamos a data quando há mudança relevante.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Limites do conteúdo">
        <p>
          Todo o conteúdo tem caráter educacional e informativo. Ele{" "}
          <strong>não substitui consulta, diagnóstico ou tratamento</strong> com médico,
          nutricionista ou outro profissional de saúde. Ferramentas e calculadoras oferecem
          estimativas gerais, não orientações individualizadas.
        </p>
      </LegalSection>

      <LegalSection title="Links de parceiros e publicidade">
        <p>
          Algumas páginas trazem recomendações de produtos com links de afiliados, pelos quais
          podemos receber comissão quando você realiza uma compra. As comissões não influenciam o
          conteúdo informativo dos artigos. Veja também os{" "}
          <Link href={routes.termos}>Termos de Uso</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Correções e contato">
        <p>
          Encontrou um erro ou informação desatualizada? Escreva para{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Analisamos todas as mensagens
          e corrigimos o conteúdo quando necessário.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
