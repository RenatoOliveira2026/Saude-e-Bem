import { LegalPageLayout, LegalSection } from "@/components/layout/LegalPageLayout";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = buildContentMetadata({
  title: "Anuncie no Saúde & Bem",
  description:
    "Formatos de publicidade para marcas de saúde, bem-estar e longevidade no portal Saúde & Bem, com regras claras de transparência.",
  path: routes.anuncie,
});

const UPDATED_AT = "25 de outubro de 2026";
const CONTACT_EMAIL = "contato@saudeebem.com.br";
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Anunciar no Saúde & Bem")}`;

export default function AnunciePage() {
  return (
    <LegalPageLayout
      badge="Para marcas"
      title="Anuncie no Saúde & Bem"
      description="Fale com um público adulto e maduro que busca informação confiável sobre saúde, bem-estar e longevidade."
      updatedAt={UPDATED_AT}
    >
      <LegalSection title="Para quem falamos">
        <p>
          O Saúde & Bem é um portal de conteúdo sobre sono, hidratação, alimentação, atividade
          física e envelhecimento saudável, pensado especialmente para adultos a partir dos 50
          anos e suas famílias, com leitura confortável e linguagem clara.
        </p>
      </LegalSection>

      <LegalSection title="Formatos disponíveis">
        <ul>
          <li>
            <strong>Banner nos artigos:</strong> espaço exibido ao fim dos conteúdos, sempre
            identificado como publicidade.
          </li>
          <li>
            <strong>Conteúdo patrocinado:</strong> artigo produzido em parceria com a marca,
            marcado como “Publicidade” no título e no topo da página.
          </li>
          <li>
            <strong>Destaque em Recomendados:</strong> posição de destaque para produtos na
            seção de recursos recomendados.
          </li>
          <li>
            <strong>Newsletter:</strong> menção identificada como patrocínio nos envios aos
            assinantes.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Nossas regras">
        <ul>
          <li>Toda publicidade é identificada de forma clara, conforme o CONAR e o CDC.</li>
          <li>
            Não aceitamos anúncios com promessa de cura, emagrecimento garantido ou resultados
            milagrosos.
          </li>
          <li>
            Produtos sujeitos à vigilância sanitária precisam estar regularizados na Anvisa.
          </li>
          <li>
            O patrocínio não interfere no conteúdo editorial. Veja nossa{" "}
            <Link href={routes.politicaEditorial}>Política Editorial</Link>.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Fale com a gente">
        <p>
          Envie um e-mail para <a href={MAILTO}>{CONTACT_EMAIL}</a> contando sobre a sua marca e
          o objetivo da campanha. Respondemos com os dados de audiência atualizados, formatos e
          valores.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
