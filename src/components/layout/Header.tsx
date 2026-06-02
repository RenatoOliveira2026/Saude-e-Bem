"use client";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { LogoHeader } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  authNavLoggedIn,
  mainNav,
  routes,
} from "@/lib/routes";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function isActive(href: string) {
    return href === routes.home
      ? pathname === routes.home
      : pathname.startsWith(href);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-surface/95 shadow-soft backdrop-blur-md"
          : "bg-off-white/80 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between gap-4 px-[var(--container-px)] lg:h-20">
        <LogoHeader />

        <nav
          className="hidden items-center gap-1 xl:flex"
          aria-label="Navegação principal"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 font-heading text-sm font-medium transition-colors duration-200",
                isActive(item.href)
                  ? "bg-sage-muted text-forest"
                  : "text-graphite hover:bg-sage-muted/60 hover:text-forest",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isLoggedIn ? (
            <>
              {authNavLoggedIn.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-2 font-heading text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-sage-muted text-forest"
                      : "text-graphite hover:bg-sage-muted/60 hover:text-forest",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <LogoutButton variant="outline" size="sm" />
            </>
          ) : (
            <>
              <Button href={routes.entrar} variant="ghost" size="sm">
                Entrar
              </Button>
              <Button href={routes.cadastro} variant="gold" size="sm">
                Cadastrar
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-surface lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <span className="sr-only">{menuOpen ? "Fechar" : "Menu"}</span>
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={cn(
                "block h-0.5 w-full bg-forest transition-all duration-300",
                menuOpen && "translate-y-2 rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-full bg-forest transition-all duration-300",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-full bg-forest transition-all duration-300",
                menuOpen && "-translate-y-2 -rotate-45",
              )}
            />
          </div>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 top-0 z-40 bg-forest transition-all duration-300 lg:hidden",
          menuOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-full flex-col overflow-y-auto px-[var(--container-px)] pt-24 pb-10">
          <LogoHeader inverted className="mb-8" />

          <nav className="flex flex-col gap-1" aria-label="Menu mobile">
            <p className="mb-2 px-4 font-heading text-xs font-semibold uppercase tracking-widest text-off-white/50">
              Plataforma
            </p>
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-4 py-3.5 font-heading text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-off-white/10 text-gold"
                    : "text-off-white/90 hover:bg-off-white/5",
                )}
              >
                {item.label}
              </Link>
            ))}

            <p className="mb-2 mt-6 px-4 font-heading text-xs font-semibold uppercase tracking-widest text-off-white/50">
              Conta
            </p>
            {isLoggedIn ? (
              <>
                {authNavLoggedIn.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-4 py-3.5 font-heading text-base font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-off-white/10 text-gold"
                        : "text-off-white/90 hover:bg-off-white/5",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-2 px-4">
                  <LogoutButton
                    variant="outline"
                    size="md"
                    className="w-full justify-center border-off-white/30 text-off-white hover:bg-off-white/10"
                  />
                </div>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-3 px-4">
                <Button
                  href={routes.entrar}
                  variant="outline"
                  size="lg"
                  className="w-full justify-center border-off-white/30 text-off-white hover:bg-off-white/10"
                >
                  Entrar
                </Button>
                <Button
                  href={routes.cadastro}
                  variant="gold"
                  size="lg"
                  className="w-full justify-center"
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
