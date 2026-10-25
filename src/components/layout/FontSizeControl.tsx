"use client";

import { cn } from "@/lib/cn";
import { useSyncExternalStore } from "react";

export const FONT_SCALE_STORAGE_KEY = "sb-font-scale";

const SCALES = ["normal", "large", "xlarge"] as const;
type FontScale = (typeof SCALES)[number];

/** Script executado antes da pintura para aplicar o tamanho salvo (evita "piscar"). */
export const FONT_SCALE_INIT_SCRIPT = `try{var s=localStorage.getItem("${FONT_SCALE_STORAGE_KEY}");if(s==="large"||s==="xlarge"){document.documentElement.setAttribute("data-font-scale",s)}}catch(e){}`;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-font-scale"],
  });
  return () => observer.disconnect();
}

function readScale(): FontScale {
  const value = document.documentElement.getAttribute("data-font-scale");
  return value === "large" || value === "xlarge" ? value : "normal";
}

function applyScale(scale: FontScale) {
  const root = document.documentElement;
  if (scale === "normal") root.removeAttribute("data-font-scale");
  else root.setAttribute("data-font-scale", scale);
  try {
    localStorage.setItem(FONT_SCALE_STORAGE_KEY, scale);
  } catch {
    // Armazenamento indisponível (modo privado etc.): vale só para esta visita.
  }
}

interface FontSizeControlProps {
  className?: string;
  inverted?: boolean;
}

export function FontSizeControl({ className, inverted = false }: FontSizeControlProps) {
  const scale = useSyncExternalStore(subscribe, readScale, () => "normal" as FontScale);

  const index = SCALES.indexOf(scale);

  function change(step: 1 | -1) {
    const next = SCALES[Math.min(SCALES.length - 1, Math.max(0, index + step))];
    applyScale(next);
  }

  const buttonClass = cn(
    "flex h-10 min-w-10 items-center justify-center rounded-full border px-2 font-heading font-semibold transition-colors disabled:opacity-40",
    inverted
      ? "border-off-white/30 text-off-white hover:bg-off-white/10"
      : "border-border-strong bg-surface text-forest hover:bg-sage-muted",
  );

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="group"
      aria-label="Tamanho da letra"
    >
      <button
        type="button"
        className={cn(buttonClass, "text-sm")}
        onClick={() => change(-1)}
        disabled={index === 0}
        aria-label="Diminuir o tamanho da letra"
        title="Diminuir letra"
      >
        A−
      </button>
      <button
        type="button"
        className={cn(buttonClass, "text-lg")}
        onClick={() => change(1)}
        disabled={index === SCALES.length - 1}
        aria-label="Aumentar o tamanho da letra"
        title="Aumentar letra"
      >
        A+
      </button>
    </div>
  );
}
