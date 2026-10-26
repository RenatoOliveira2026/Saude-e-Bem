"use client";

import { LogoHeader } from "@/components/brand/Logo";
import { Icon } from "@/components/icons";
import { getAdminNavGroupsForRole, isAdminNavItemActive } from "@/lib/admin/nav";
import { ADMIN_ROLE_LABELS, type AdminRole } from "@/lib/admin/roles";
import { adminFutureIntegrations } from "@/lib/admin/types";
import { routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminSidebarProps {
  role: AdminRole;
}

function SidebarContent({
  role,
  pathname,
  onNavigate,
  inDrawer = false,
}: {
  role: AdminRole;
  pathname: string;
  onNavigate?: () => void;
  /** No menu do celular a gaveta inteira rola; a lista não tem rolagem própria. */
  inDrawer?: boolean;
}) {
  const navGroups = getAdminNavGroupsForRole(role);
  const firstHref = navGroups[0]?.items[0]?.href;

  return (
    <>
      <div className="border-b border-white/10 px-5 py-6">
        <LogoHeader
          inverted
          href={firstHref ?? routes.admin}
          className="[&_img]:brightness-110"
        />
        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gold">
          Painel Admin
        </p>
        <p className="mt-1 text-xs text-off-white/70">{ADMIN_ROLE_LABELS[role]}</p>
      </div>

      <nav
        className={`space-y-5 px-3 py-4 ${inDrawer ? "" : "flex-1 overflow-y-auto"}`}
        aria-label="Menu do painel"
      >
        {navGroups.map(({ group, items }) => (
          <div key={group}>
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-gold/90">
              {group}
            </p>
            <div className="space-y-0.5">
              {items.map((item) => {
                const active = isAdminNavItemActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-sage text-off-white"
                        : "text-off-white/80 hover:bg-white/10 hover:text-off-white"
                    }`}
                  >
                    <Icon name={item.icon} className="h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold/90">
          Em breve
        </p>
        <ul className="space-y-2">
          {adminFutureIntegrations.map((item) => (
            <li
              key={item.id}
              className="rounded-lg bg-white/5 px-3 py-2 text-xs text-off-white/60"
              title={item.description}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <Link
          href={routes.home}
          onClick={onNavigate}
          className="flex min-h-11 items-center gap-2 text-sm text-off-white/70 transition-colors hover:text-gold"
        >
          <Icon name="arrow-right" className="h-4 w-4 rotate-180" aria-hidden />
          Voltar ao site
        </Link>
      </div>
    </>
  );
}

/**
 * Menu do painel. No computador fica fixo à esquerda; no celular e tablet
 * vira uma barra no topo com botão "Menu" que abre a lista por cima da tela.
 */
export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Trava a rolagem da página enquanto o menu do celular está aberto.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* Computador */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-forest text-off-white lg:flex">
        <SidebarContent role={role} pathname={pathname} />
      </aside>

      {/* Celular e tablet */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-forest px-4 py-3 text-off-white lg:hidden">
        <Link href={routes.admin} className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo-saude-bem.png"
            alt="Saúde & Bem"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-xl bg-white object-contain p-0.5"
          />
          <span className="truncate font-heading text-sm font-semibold text-off-white">
            Painel
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="admin-mobile-menu"
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-white/25 px-4 text-sm font-semibold"
        >
          Menu
          <span className="flex w-5 flex-col gap-1" aria-hidden>
            <span className="h-0.5 w-full rounded bg-current" />
            <span className="h-0.5 w-full rounded bg-current" />
            <span className="h-0.5 w-full rounded bg-current" />
          </span>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu do painel">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          />
          <aside
            id="admin-mobile-menu"
            className="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col overflow-y-auto bg-forest text-off-white shadow-elevated"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-2xl leading-none text-off-white/80 hover:bg-white/10"
              aria-label="Fechar menu"
            >
              ×
            </button>
            <SidebarContent
              role={role}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
              inDrawer
            />
          </aside>
        </div>
      )}
    </>
  );
}
