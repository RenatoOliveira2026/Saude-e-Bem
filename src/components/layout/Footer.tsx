import { LogoFooter } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { footerNav, routes } from "@/lib/routes";
import Link from "next/link";

const footerSections = {
  recursos: [
    { label: "Perfil de Saúde", href: routes.ferramentas },
    { label: "Protocolos", href: routes.protocolos },
    { label: "Ferramentas", href: routes.ferramentas },
    { label: "Biblioteca", href: routes.biblioteca },
  ],
  conteudo: [
    { label: "Blog", href: routes.blog },
    { label: "Artigos", href: routes.blog },
    { label: "Clube Saúde & Bem", href: routes.clube },
  ],
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest text-off-white">
      <div className="border-b border-off-white/10">
        <Container className="py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <LogoFooter />
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-off-white/70">
                Plataforma premium de saúde, bem-estar e longevidade. Ciência
                aplicada, protocolos práticos e uma comunidade dedicada à sua
                vitalidade consciente.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-12 bg-gold" aria-hidden="true" />
                <span className="font-heading text-xs uppercase tracking-[0.2em] text-gold">
                  Vitalidade consciente
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
              <FooterColumn title="Plataforma" links={footerNav.plataforma} />
              <FooterColumn title="Conta" links={footerNav.conta} />
              <FooterColumn title="Recursos" links={footerSections.recursos} />
              <FooterColumn title="Comunidade" links={footerNav.comunidade} />
            </div>
          </div>

          <div className="mt-16 grid gap-6 rounded-2xl border border-off-white/10 bg-off-white/5 p-6 md:grid-cols-3 md:p-8">
            {[
              {
                title: "Base científica",
                text: "Conteúdo fundamentado em evidências e revisado por especialistas.",
              },
              {
                title: "Abordagem integrada",
                text: "Nutrição, sono, movimento e mente — tudo conectado.",
              },
              {
                title: "Sem promessas vazias",
                text: "Transparência e honestidade em cada recomendação.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h4 className="font-heading text-sm font-semibold text-gold">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-off-white/60">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container className="flex flex-col items-center justify-between gap-6 py-8 md:flex-row">
        <p className="text-xs text-off-white/50">
          © {year} Saúde & Bem. Todos os direitos reservados.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <FooterLink href="#">Privacidade</FooterLink>
          <FooterLink href="#">Termos de uso</FooterLink>
          <FooterLink href="#">Cookies</FooterLink>
          <FooterLink href="#">Contato</FooterLink>
        </div>
        <p className="text-xs text-off-white/40">
          Feito com cuidado para quem prioriza longevidade.
        </p>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-gold">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="text-sm text-off-white/65 transition-colors hover:text-off-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-xs text-off-white/50 transition-colors hover:text-off-white/80"
    >
      {children}
    </Link>
  );
}
