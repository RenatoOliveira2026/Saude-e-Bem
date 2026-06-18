import { LegalPageLayout, LegalSection } from "@/components/layout/LegalPageLayout";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = buildContentMetadata({
  title: "Política de Cookies",
  description:
    "Como o Saúde & Bem utiliza cookies e tecnologias similares na plataforma.",
  path: routes.cookies,
});

const UPDATED_AT = "1 de junho de 2026";
const CONTACT_EMAIL = "contato@saudeebem.com.br";

export default function CookiesPage() {
  return (
    <LegalPageLayout
      badge="Legal"
      title="Política de Cookies"
      description="Informações sobre cookies e tecnologias de rastreamento utilizadas no site Saúde & Bem."
      updatedAt={UPDATED_AT}
    >
      <LegalSection title="1. O que são cookies">
        <p>
          Cookies são pequenos arquivos de texto armazenados no seu navegador quando você
          visita um site. Eles permitem reconhecer seu dispositivo, manter sessões ativas e
          melhorar a experiência de navegação.
        </p>
      </LegalSection>

      <LegalSection title="2. Tipos de cookies que utilizamos">
        <ul>
          <li>
            <strong>Essenciais:</strong> necessários ao funcionamento do site, autenticação
            (Supabase Auth) e recursos PWA. Sem eles, login e áreas privadas podem não
            funcionar.
          </li>
          <li>
            <strong>Analíticos:</strong> medem tráfego e comportamento agregado via Google
            Analytics 4 (GA4), quando ativo. Ajudam a entender quais páginas são mais úteis.
          </li>
          <li>
            <strong>Funcionais:</strong> lembram preferências de interface e continuidade da
            jornada do usuário.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Como gerenciar cookies">
        <p>
          Você pode bloquear ou excluir cookies nas configurações do seu navegador. A
          desativação de cookies essenciais pode limitar funcionalidades como login, assinatura
          Premium e salvamento de preferências.
        </p>
        <p>
          Para opt-out do Google Analytics, utilize a{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            extensão de desativação do Google
          </a>{" "}
          ou ajuste as permissões do navegador.
        </p>
      </LegalSection>

      <LegalSection title="4. Mais informações">
        <p>
          Detalhes sobre coleta, bases legais e direitos do titular estão na{" "}
          <Link href={routes.privacidade}>Política de Privacidade</Link> e nos{" "}
          <Link href={routes.termos}>Termos de Uso</Link>.
        </p>
        <p>
          Dúvidas:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
