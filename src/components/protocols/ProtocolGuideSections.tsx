import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { ProtocolGuide } from "@/lib/data/protocol-guides";
import Image from "next/image";

/** Foto de capa do protocolo, logo abaixo do título. */
export function ProtocolCover({ guide }: { guide: ProtocolGuide }) {
  return (
    <Section background="white" spacing="compact">
      <Container size="md">
        <figure className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-sage-muted">
          <Image
            src={guide.cover.url}
            alt={guide.cover.alt}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </figure>
      </Container>
    </Section>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-graphite">
          <Icon name="checklist" size={16} className="mt-0.5 shrink-0 text-sage" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** "Antes de começar": tempo, melhor dia, o que preparar, compras e cuidados. */
export function ProtocolPrepSection({ guide }: { guide: ProtocolGuide }) {
  return (
    <Section background="white" id="antes-de-comecar">
      <Container size="md">
        <h2 className="font-heading text-2xl text-forest">Antes de começar</h2>
        <p className="mt-2 text-muted">
          Programe-se com alguns dias de antecedência: quem se prepara chega até o fim com mais
          facilidade.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-sage-muted/50 p-5">
            <p className="flex items-center gap-2 font-heading text-sm font-semibold text-forest">
              <Icon name="clock" size={16} className="text-gold" />
              Tempo por dia
            </p>
            <p className="mt-2 text-sm leading-relaxed text-graphite">{guide.dailyTime}</p>
          </div>
          <div className="rounded-xl bg-sage-muted/50 p-5">
            <p className="flex items-center gap-2 font-heading text-sm font-semibold text-forest">
              <Icon name="plan" size={16} className="text-gold" />
              Melhor dia para começar
            </p>
            <p className="mt-2 text-sm leading-relaxed text-graphite">{guide.bestStart}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-heading text-base font-semibold text-forest">Deixe pronto antes do dia 1</h3>
            <Checklist items={guide.prepare} />
          </div>
          {guide.shopping && guide.shopping.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-heading text-base font-semibold text-forest">Lista de compras</h3>
              <Checklist items={guide.shopping} />
            </div>
          )}
        </div>

        <div
          role="note"
          className="mt-4 rounded-xl border border-gold/40 bg-gold-muted/20 p-5"
        >
          <p className="flex items-center gap-2 font-heading text-base font-semibold text-forest">
            <Icon name="shield" size={18} className="text-gold" />
            Atenção
          </p>
          <ul className="mt-3 space-y-2">
            {guide.alerts.map((alert) => (
              <li key={alert} className="text-sm leading-relaxed text-graphite">
                {alert}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

/** Plano detalhado por semana (substitui a lista curta de etapas). */
export function ProtocolWeeksSection({ guide }: { guide: ProtocolGuide }) {
  return (
    <Section background="default" id="etapas">
      <Container size="md">
        <h2 className="font-heading text-2xl text-forest">Plano semana a semana</h2>
        <div className="mt-8 space-y-4">
          {guide.weeks.map((week, index) => (
            <div key={week.title} className="flex gap-5 rounded-xl border border-border bg-surface p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest font-heading text-sm font-bold text-off-white">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-sage">{week.title}</p>
                <h3 className="mt-1 font-heading font-semibold text-forest">{week.focus}</h3>
                <Checklist items={week.tasks} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
