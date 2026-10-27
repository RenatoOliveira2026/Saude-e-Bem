import { LegalPageLayout, LegalSection } from "@/components/layout/LegalPageLayout";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = buildContentMetadata({
  title: "Termos de Uso",
  description:
    "Termos de uso da plataforma Saúde & Bem, assinatura Premium, cancelamento e responsabilidades.",
  path: routes.termos,
});

const UPDATED_AT = "27 de outubro de 2026";
const CONTACT_EMAIL = "contato@saudeebem.com.br";

export default function TermosPage() {
  return (
    <LegalPageLayout
      badge="Legal"
      title="Termos de Uso"
      description="Ao acessar ou utilizar o Saúde & Bem, você concorda com estes termos. Leia com atenção antes de criar conta ou assinar um plano Premium."
      updatedAt={UPDATED_AT}
    >
      <LegalSection title="1. Aceitação dos termos">
        <p>
          Estes Termos de Uso regulam o acesso à plataforma <strong>Saúde & Bem</strong>{" "}
          (site, ferramentas, conteúdos, área de membros e serviços relacionados). O uso
          continuado implica aceitação das condições aqui descritas e de nossa{" "}
          <Link href={routes.privacidade}>Política de Privacidade</Link>.
        </p>
      </LegalSection>

      <LegalSection title="2. Termos de uso da plataforma">
        <p>
          O Saúde & Bem oferece conteúdo educacional e ferramentas de apoio a hábitos saudáveis.
          Para utilizar recursos que exigem conta, você deve fornecer informações verdadeiras e
          manter a confidencialidade da sua senha.
        </p>
        <ul>
          <li>É permitido uso pessoal e não comercial, salvo autorização expressa.</li>
          <li>É proibido compartilhar credenciais, revender conteúdo ou contornar paywalls.</li>
          <li>
            Reservamo-nos o direito de suspender contas que violem estes termos ou a legislação
            aplicável.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Assinatura Premium">
        <p>
          Planos pagos (mensal ou anual) concedem acesso a conteúdos e funcionalidades marcados
          como Premium, conforme descrito na{" "}
          <Link href={routes.assinar}>página de assinatura</Link>.
        </p>
        <ul>
          <li>
            O pagamento é processado pelo <strong>Mercado Pago</strong>; a cobrança recorrente
            aplica-se aos planos com renovação automática (ex.: mensal com cartão).
          </li>
          <li>
            Planos pagos via PIX ou boleto não têm cobrança automática: valem pelo período pago
            (30 dias no mensal, 365 dias no anual) e podem ser renovados em Minha assinatura.
          </li>
          <li>
            O acesso Premium é liberado após confirmação do pagamento pelo provedor; eventuais
            atrasos de processamento não geram direito a período adicional gratuito.
          </li>
          <li>
            Preços e benefícios podem ser atualizados; alterações materiais serão comunicadas com
            antecedência razoável quando aplicável.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Direito de arrependimento (7 dias)">
        <p>
          Conforme o artigo 49 do Código de Defesa do Consumidor, você pode desistir da
          assinatura em até <strong>7 (sete) dias</strong> contados da contratação, ou seja, da
          confirmação do pagamento, sem precisar justificar o motivo.
        </p>
        <ul>
          <li>
            Para desistir, envie um e-mail para{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> com o e-mail da sua conta, ou
            fale com a gente pelo WhatsApp do site.
          </li>
          <li>
            Devolvemos <strong>integralmente</strong> o valor pago, pelo mesmo meio de pagamento,
            por meio do Mercado Pago. No cartão de crédito, o estorno pode aparecer na fatura
            atual ou na seguinte, conforme o banco emissor.
          </li>
          <li>O acesso Premium é encerrado quando o reembolso é feito.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Política de cancelamento">
        <p>
          Você pode cancelar a assinatura a qualquer momento em{" "}
          <Link href={routes.minhaAssinatura}>Minha assinatura</Link> (botão “Cancelar
          assinatura”) ou entrando em contato conosco.
        </p>
        <ul>
          <li>
            O cancelamento impede novas cobranças futuras; o acesso Premium permanece ativo até o
            fim do período já pago.
          </li>
          <li>
            Após o prazo de 7 dias do direito de arrependimento, não há reembolso proporcional de
            períodos já pagos, salvo disposição legal em contrário.
          </li>
          <li>
            Disputas de pagamento devem ser tratadas também junto ao Mercado Pago, quando
            aplicável.
          </li>
        </ul>
        <p>
          Dúvidas sobre cancelamento:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="6. Isenção de responsabilidade médica">
        <p>
          O Saúde & Bem <strong>não substitui</strong> consulta, diagnóstico ou tratamento
          médico, nutricional ou psicológico profissional. Todo conteúdo tem caráter
          informativo e educacional.
        </p>
        <ul>
          <li>
            Não estabelecemos relação médico-paciente com usuários da plataforma.
          </li>
          <li>
            Decisões sobre saúde devem ser tomadas com profissionais habilitados, considerando
            seu histórico individual.
          </li>
          <li>
            Em emergência, procure serviços de urgência ou ligue para os números oficiais de
            emergência (ex.: SAMU 192).
          </li>
        </ul>
        <p>
          A plataforma é disponibilizada &quot;como está&quot;, sem garantias de resultados
          específicos de saúde ou bem-estar.
        </p>
      </LegalSection>

      <LegalSection title="7. Uso adequado da plataforma">
        <p>Você concorda em não:</p>
        <ul>
          <li>Publicar ou transmitir conteúdo ilegal, ofensivo ou que viole direitos de terceiros.</li>
          <li>Tentar acessar áreas restritas, sistemas ou dados de outros usuários.</li>
          <li>Utilizar bots, scraping ou automação não autorizada.</li>
          <li>Explorar vulnerabilidades ou sobrecarregar a infraestrutura do serviço.</li>
        </ul>
        <p>
          O descumprimento pode resultar em suspensão ou encerramento da conta, sem prejuízo de
          medidas legais.
        </p>
      </LegalSection>

      <LegalSection title="8. Direitos autorais do conteúdo">
        <p>
          Textos, protocolos, artigos, materiais da biblioteca, identidade visual, marcas e
          demais conteúdos do Saúde & Bem são protegidos por direitos autorais e propriedade
          intelectual.
        </p>
        <ul>
          <li>
            É proibida reprodução, distribuição ou modificação sem autorização prévia por escrito.
          </li>
          <li>
            Assinantes Premium recebem licença pessoal, limitada e não transferível de acesso ao
            conteúdo durante a vigência da assinatura.
          </li>
          <li>
            Citações breves com atribuição podem ser permitidas nos limites da lei, sem
            interpretação como cessão de direitos.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Alterações e legislação aplicável">
        <p>
          Podemos atualizar estes Termos periodicamente. A data da última revisão consta no topo
          desta página. O uso continuado após alterações constitui aceitação das novas condições.
        </p>
        <p>
          Estes termos são regidos pelas leis da República Federativa do Brasil. Foro competente:
          comarca do domicílio do consumidor, quando aplicável o Código de Defesa do Consumidor.
        </p>
      </LegalSection>

      <LegalSection title="10. Contato">
        <p>
          Para questões sobre estes Termos:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
