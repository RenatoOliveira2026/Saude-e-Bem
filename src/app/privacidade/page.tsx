import { LegalPageLayout, LegalSection } from "@/components/layout/LegalPageLayout";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = buildContentMetadata({
  title: "Política de Privacidade",
  description:
    "Como o Saúde & Bem coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
  path: routes.privacidade,
});

const UPDATED_AT = "1 de junho de 2026";
const CONTACT_EMAIL = "contato@saudeebem.com.br";

export default function PrivacidadePage() {
  return (
    <LegalPageLayout
      badge="Legal"
      title="Política de Privacidade"
      description="Transparência sobre o tratamento dos seus dados pessoais na plataforma Saúde & Bem, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)."
      updatedAt={UPDATED_AT}
    >
      <LegalSection title="1. Quem somos">
        <p>
          O <strong>Saúde & Bem</strong> é uma plataforma digital de saúde, bem-estar e
          longevidade. Esta política descreve como tratamos dados pessoais de visitantes,
          usuários cadastrados, assinantes Premium e leads captados em nossos canais.
        </p>
      </LegalSection>

      <LegalSection id="coleta" title="2. Coleta de dados pessoais">
        <p>Podemos coletar as seguintes categorias de dados, conforme sua interação conosco:</p>
        <ul>
          <li>
            <strong>Identificação e contato:</strong> nome, e-mail, telefone (inclusive para
            WhatsApp, quando você autorizar).
          </li>
          <li>
            <strong>Conta e autenticação:</strong> credenciais de acesso, preferências de perfil
            e dados de saúde informados voluntariamente em ferramentas da plataforma.
          </li>
          <li>
            <strong>Assinatura e pagamento:</strong> plano contratado, status da assinatura e
            identificadores de transação — os dados completos de cartão ou PIX são processados
            pelo Mercado Pago, não armazenados por nós.
          </li>
          <li>
            <strong>Navegação e uso:</strong> páginas visitadas, eventos de interesse, downloads
            e cliques, por meio de cookies e tecnologias similares.
          </li>
          <li>
            <strong>Comunicações:</strong> mensagens enviadas ou recebidas via WhatsApp Business,
            quando houver opt-in, e histórico de interações com nossos formulários.
          </li>
        </ul>
        <p>
          A coleta ocorre quando você se cadastra, assina um plano, preenche formulários,
          utiliza ferramentas, interage conosco ou navega no site.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="3. Uso de cookies">
        <p>
          Utilizamos cookies e tecnologias semelhantes para manter sua sessão autenticada,
          lembrar preferências, medir audiência e melhorar a experiência na plataforma.
        </p>
        <ul>
          <li>
            <strong>Essenciais:</strong> necessários ao funcionamento do site e login (Supabase
            Auth, PWA).
          </li>
          <li>
            <strong>Analíticos:</strong> medem tráfego e comportamento agregado (Google
            Analytics 4), quando ativo.
          </li>
          <li>
            <strong>Funcionais:</strong> preferências de interface e continuidade de jornada.
          </li>
        </ul>
        <p>
          Você pode gerenciar cookies nas configurações do seu navegador. A desativação de
          cookies essenciais pode limitar funcionalidades da plataforma.
        </p>
      </LegalSection>

      <LegalSection id="analytics" title="4. Google Analytics (GA4)">
        <p>
          Utilizamos o <strong>Google Analytics 4</strong> para entender como visitantes usam o
          site (páginas vistas, origem de tráfego e eventos agregados). O Google pode processar
          dados em servidores fora do Brasil, conforme suas próprias políticas.
        </p>
        <p>
          Os dados enviados ao GA4 são, em regra, pseudonimizados e utilizados para estatísticas
          e melhoria do produto — não para decisões automatizadas que afetem seus direitos. Você
          pode instalar extensões de opt-out do Google ou ajustar cookies no navegador.
        </p>
      </LegalSection>

      <LegalSection id="whatsapp" title="5. Integração com WhatsApp">
        <p>
          Quando você marca opt-in e informa telefone, podemos enviar mensagens via{" "}
          <strong>WhatsApp Business (Meta)</strong>: boas-vindas, nutrição de conteúdo,
          confirmação de assinatura e lembretes relacionados ao serviço.
        </p>
        <ul>
          <li>O envio depende do seu consentimento explícito no formulário de captura.</li>
          <li>
            Você pode cancelar comunicações respondendo <strong>SAIR</strong>,{" "}
            <strong>CANCELAR</strong> ou <strong>STOP</strong> a qualquer momento.
          </li>
          <li>
            A Meta processa mensagens conforme seus termos; compartilhamos apenas o necessário
            para entrega (telefone e conteúdo da mensagem).
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="mercadopago" title="6. Integração com Mercado Pago">
        <p>
          Pagamentos de assinaturas Premium são processados pelo{" "}
          <strong>Mercado Pago</strong>. Ao concluir o checkout, você é direcionado ao ambiente
          seguro do Mercado Pago, que coleta e trata dados financeiros conforme sua política
          própria.
        </p>
        <p>
          Recebemos do Mercado Pago apenas informações necessárias para ativar sua assinatura
          (status do pagamento, valor, identificadores de referência e plano). Consulte a
          política de privacidade do Mercado Pago em{" "}
          <a
            href="https://www.mercadopago.com.br/privacidade"
            target="_blank"
            rel="noopener noreferrer"
          >
            mercadopago.com.br/privacidade
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="7. Finalidades e bases legais">
        <p>Tratamos dados para:</p>
        <ul>
          <li>Prestar e melhorar os serviços da plataforma (execução de contrato).</li>
          <li>Processar assinaturas e suporte ao cliente (execução de contrato e legítimo interesse).</li>
          <li>Enviar comunicações autorizadas por e-mail ou WhatsApp (consentimento).</li>
          <li>Cumprir obrigações legais e regulatórias (obrigação legal).</li>
          <li>Analisar uso agregado do site (legítimo interesse, com opt-out quando aplicável).</li>
        </ul>
      </LegalSection>

      <LegalSection id="lgpd" title="8. Direitos do usuário (LGPD)">
        <p>
          Nos termos da LGPD, você pode solicitar, a qualquer momento:
        </p>
        <ul>
          <li>Confirmação da existência de tratamento e acesso aos dados.</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade.</li>
          <li>Portabilidade, quando aplicável.</li>
          <li>Revogação do consentimento e informação sobre compartilhamentos.</li>
          <li>Oposição a tratamentos baseados em legítimo interesse, quando cabível.</li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato pelo e-mail{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Responderemos em prazo
          razoável, conforme a legislação vigente.
        </p>
      </LegalSection>

      <LegalSection title="9. Retenção e segurança">
        <p>
          Mantemos dados pelo tempo necessário às finalidades descritas ou exigido por lei.
          Adotamos medidas técnicas e organizacionais adequadas (criptografia em trânsito,
          controle de acesso, Supabase com RLS) para proteger suas informações.
        </p>
      </LegalSection>

      <LegalSection title="10. Contato">
        <p>
          Dúvidas sobre privacidade ou tratamento de dados:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p>
          Consulte também nossos{" "}
          <Link href={routes.termos}>Termos de Uso</Link>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
