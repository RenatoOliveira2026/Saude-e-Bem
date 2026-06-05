import type { ReactNode } from "react";
import type { BlogCategory, ContentCategory } from "@/lib/data/types";

export type IconName =
  | "heart-leaf"
  | "moon"
  | "leaf"
  | "sparkle"
  | "bolt"
  | "shield"
  | "brain"
  | "activity"
  | "scale"
  | "profile"
  | "chart"
  | "sleep"
  | "vitality"
  | "water"
  | "dna"
  | "tracker"
  | "nutrition"
  | "book"
  | "checklist"
  | "study"
  | "plan"
  | "download"
  | "clock"
  | "users"
  | "star"
  | "arrow-right"
  | "chevron-right"
  | "community"
  | "live"
  | "support"
  | "library"
  | "lock";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

export const categoryIcons: Record<ContentCategory, IconName> = {
  sono: "moon",
  energia: "bolt",
  intestinal: "vitality",
  detox: "leaf",
  longevidade: "sparkle",
  menopausa: "heart-leaf",
  nutricao: "leaf",
  mente: "brain",
  "saude-mental": "brain",
  ansiedade: "heart-leaf",
  "alimentacao-saudavel": "leaf",
  exercicios: "activity",
  "controle-estresse": "vitality",
  "saude-feminina": "heart-leaf",
  "saude-masculina": "bolt",
  "saude-idoso": "sparkle",
  "bem-estar-geral": "star",
};

export const blogCategoryIcons: Record<BlogCategory, IconName> = {
  hidratacao: "leaf",
  sono: "moon",
  emagrecimento: "chart",
  "saude-cardiovascular": "heart-leaf",
  longevidade: "sparkle",
};

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons: Record<IconName, ReactNode> = {
  "heart-leaf": (
    <>
      <path
        {...stroke}
        d="M12 20.5s-6.5-5-6.5-9.5a4 4 0 0 1 7-2.5 4 4 0 0 1 7 2.5c0 4.5-6.5 9.5-6.5 9.5z"
      />
      <path {...stroke} d="M12 8v4M12 8l-2-2M12 8l2-2" />
    </>
  ),
  moon: (
    <path
      {...stroke}
      d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z"
    />
  ),
  leaf: (
    <path
      {...stroke}
      d="M11 20C6 16 4 10 6 4c6 2 10 6 12 12-4 2-7 2.5-7 4zM6 4c2 4 4 7 7 9"
    />
  ),
  sparkle: (
    <>
      <path {...stroke} d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <path {...stroke} d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" {...stroke} />
    </>
  ),
  bolt: <path {...stroke} d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  shield: (
    <path
      {...stroke}
      d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z"
    />
  ),
  brain: (
    <>
      <path
        {...stroke}
        d="M8 8.5C5.5 9 4 11 4 13c0 2 1.5 3.5 3.5 4M16 8.5c2.5.5 4 2.5 4 4.5 0 2-1.5 3.5-3.5 4"
      />
      <path {...stroke} d="M9 5.5a3 3 0 0 1 6 0M12 5.5v13" />
    </>
  ),
  activity: (
    <path {...stroke} d="M22 12h-4l-3 9-4-18-3 9H2" />
  ),
  scale: (
    <>
      <path {...stroke} d="M12 3v18M5 7h14" />
      <path {...stroke} d="M5 7 3 12h4L5 7zM19 7l-2 5h4l-2-5z" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="3.5" {...stroke} />
      <path {...stroke} d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </>
  ),
  chart: (
    <>
      <path {...stroke} d="M4 20V4M4 20h16" />
      <path {...stroke} d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  sleep: (
    <>
      <path {...stroke} d="M2 12h2M20 12h2M12 2v2M12 20v2" />
      <circle cx="12" cy="12" r="4" {...stroke} />
    </>
  ),
  vitality: (
    <path
      {...stroke}
      d="M12 21c-2-3-6-6-6-10a6 6 0 1 1 12 0c0 4-4 7-6 10z"
    />
  ),
  water: (
    <path
      {...stroke}
      d="M12 3c-4 6-6 9-6 12a6 6 0 0 0 12 0c0-3-2-6-6-12z"
    />
  ),
  dna: (
    <>
      <path {...stroke} d="M8 4c3 4 5 8 5 12M16 20c-3-4-5-8-5-12" />
      <path {...stroke} d="M8 8h8M8 16h8" />
    </>
  ),
  tracker: (
    <>
      <path {...stroke} d="M3 3v18h18" />
      <path {...stroke} d="M7 14l3-3 3 2 5-6" />
    </>
  ),
  nutrition: (
    <>
      <path {...stroke} d="M12 3v18M8 7h8M8 12h6M8 17h4" />
    </>
  ),
  book: (
    <>
      <path {...stroke} d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" />
      <path {...stroke} d="M8 4v13" />
    </>
  ),
  checklist: (
    <>
      <path {...stroke} d="M9 11l2 2 4-4M7 3h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2z" />
    </>
  ),
  study: (
    <>
      <circle cx="11" cy="11" r="7" {...stroke} />
      <path {...stroke} d="M20 20l-3-3" />
    </>
  ),
  plan: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" {...stroke} />
      <path {...stroke} d="M8 7h8M8 11h8M8 15h5" />
    </>
  ),
  download: (
    <>
      <path {...stroke} d="M12 3v10M8 9l4 4 4-4" />
      <path {...stroke} d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path {...stroke} d="M12 7v5l3 2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" {...stroke} />
      <path {...stroke} d="M3 20c0-3 2.5-5 6-5M16 8a3 3 0 1 1 0 6M21 20c0-2.5-2-4.5-5-4.5" />
    </>
  ),
  star: (
    <path
      {...stroke}
      d="M12 3l2.4 4.8 5.4.8-3.9 3.8.9 5.3L12 15.8 7.2 17.7l.9-5.3L4.2 8.6l5.4-.8L12 3z"
    />
  ),
  "arrow-right": (
    <>
      <path {...stroke} d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  "chevron-right": <path {...stroke} d="M9 6l6 6-6 6" />,
  community: (
    <>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path {...stroke} d="M8 12h8M12 8v8" />
    </>
  ),
  live: (
    <>
      <circle cx="12" cy="12" r="3" {...stroke} />
      <path {...stroke} d="M7 7a7 7 0 0 0 0 10M17 7a7 7 0 0 1 0 10" />
    </>
  ),
  support: (
    <>
      <path {...stroke} d="M12 3 4 6v5c0 4.5 3 7.5 8 8 5-.5 8-3.5 8-8V6l-8-3z" />
      <path {...stroke} d="M12 11v3" />
    </>
  ),
  library: (
    <>
      <path {...stroke} d="M4 19V5a1 1 0 0 1 1-1h5v16H5a1 1 0 0 1-1-1z" />
      <path {...stroke} d="M10 4h9a1 1 0 0 1 1 1v14" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" {...stroke} />
      <path {...stroke} d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
};

export function IconBox({
  name,
  size = 24,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl bg-sage-muted text-sage ${className ?? ""}`}
      style={{ width: size * 2, height: size * 2 }}
    >
      <Icon name={name} size={size} />
    </span>
  );
}
