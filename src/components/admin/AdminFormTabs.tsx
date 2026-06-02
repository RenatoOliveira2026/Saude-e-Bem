"use client";

import { cn } from "@/lib/cn";
import { useState, type ReactNode } from "react";

export interface AdminFormTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface AdminFormTabsProps {
  tabs: AdminFormTab[];
  defaultTab?: string;
}

/**
 * Mantém todas as abas no DOM (ocultas) para que inputs em <form> sejam enviados no submit.
 */
export function AdminFormTabs({ tabs, defaultTab }: AdminFormTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");

  return (
    <div className="space-y-6">
      <div
        className="flex gap-2 overflow-x-auto border-b border-border pb-1"
        role="tablist"
        aria-label="Seções do formulário"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={cn(
              "shrink-0 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
              active === tab.id
                ? "bg-sage-muted/60 text-forest"
                : "text-muted hover:bg-off-white hover:text-forest",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`tabpanel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={tab.id}
          hidden={active !== tab.id}
          className={cn(active !== tab.id && "hidden")}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
