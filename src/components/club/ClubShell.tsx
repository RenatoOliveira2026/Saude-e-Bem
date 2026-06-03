import { LogoMark } from "@/components/brand";
import { Icon, type IconName } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { routes } from "@/lib/routes";
import Link from "next/link";

const navItems: Array<{ label: string; href: string; icon: IconName }> = [
  { label: "Dashboard", href: routes.clubeDashboard, icon: "chart" },
  { label: "Favoritos", href: routes.clubeFavoritos, icon: "star" },
  { label: "Downloads", href: routes.clubeDownloads, icon: "download" },
  { label: "Protocolos salvos", href: routes.clubeProtocolosSalvos, icon: "plan" },
  { label: "Histórico", href: routes.clubeHistorico, icon: "activity" },
  { label: "Recomendações", href: routes.clubeRecomendacoes, icon: "sparkle" },
  { label: "Perfil", href: routes.clubePerfil, icon: "profile" },
];

interface ClubShellProps {
  children: React.ReactNode;
  activePath: string;
  isPremium: boolean;
}

export function ClubShell({ children, activePath, isPremium }: ClubShellProps) {
  return (
    <div className="border-b border-border bg-surface">
      <Container>
        <div className="flex flex-col gap-6 py-6 lg:flex-row lg:gap-10 lg:py-8">
          <aside className="lg:w-56 lg:shrink-0">
            <div className="flex items-center gap-3">
              <LogoMark size={36} />
              <div>
                <p className="font-heading text-sm font-semibold text-forest">
                  Clube Saúde &amp; Bem
                </p>
                <Badge variant={isPremium ? "gold" : "default"} className="mt-1">
                  {isPremium ? "Premium" : "Gratuito"}
                </Badge>
              </div>
            </div>
            <nav className="mt-6 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {navItems.map((item) => {
                const active = activePath === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-sage-muted font-medium text-forest"
                        : "text-muted hover:bg-surface-muted hover:text-forest"
                    }`}
                  >
                    <Icon name={item.icon} size={16} />
                    {item.label}
                  </Link>
                );
              })}
              {!isPremium && (
                <Link
                  href={routes.clubePremium}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gold hover:bg-gold-muted/40"
                >
                  <Icon name="sparkle" size={16} />
                  Assinar Premium
                </Link>
              )}
            </nav>
            <Link
              href={routes.clube}
              className="mt-4 inline-block text-xs text-muted hover:text-sage"
            >
              ← Sobre o clube
            </Link>
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </Container>
    </div>
  );
}
