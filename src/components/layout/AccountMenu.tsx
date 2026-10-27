"use client";

import { cn } from "@/lib/cn";
import { authNavLoggedIn } from "@/lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** "Minha área" no computador: abre a lista das páginas da conta. */
export function AccountMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao trocar de página (ajuste durante a renderização, sem efeito).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = authNavLoggedIn.some((item) => pathname.startsWith(item.href));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 font-heading text-sm font-medium transition-colors",
          active || open
            ? "bg-sage-muted text-forest"
            : "text-graphite hover:bg-sage-muted/60 hover:text-forest",
        )}
      >
        Minha área
        <svg
          viewBox="0 0 20 20"
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          fill="currentColor"
          aria-hidden
        >
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-border bg-surface p-2 shadow-elevated"
        >
          {authNavLoggedIn.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className={cn(
                "flex min-h-11 items-center rounded-xl px-3 font-heading text-sm font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-sage-muted text-forest"
                  : "text-graphite hover:bg-sage-muted/60 hover:text-forest",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
