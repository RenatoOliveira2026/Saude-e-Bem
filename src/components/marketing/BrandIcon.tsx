import type { SocialNetwork } from "@/lib/marketing/accounts";

type BrandId = SocialNetwork | "ga4" | "meta" | "search-console";

/** Ícones simples das redes (traço único, herdam a cor do texto). */
const PATHS: Record<BrandId, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5V17M7.5 7.2v.1M11 17v-6.5M11 13.5c0-2 1.2-3 2.8-3S16.5 11.5 16.5 13.5V17" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" />
    </>
  ),
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.6 2.4 4.4 5 4.6" />,
  ga4: (
    <>
      <path d="M6 20v-5M12 20V9M18 20V4" strokeWidth="3.2" />
    </>
  ),
  meta: (
    <path d="M3 15c0-4 2-8 4.5-8 3 0 6 10 9 10 2 0 4-2 4.5-5 .4-3-1-5-3-5-3 0-6 10-9 10C5 17 3 16.5 3 15z" />
  ),
  "search-console": (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5.5 5.5" />
    </>
  ),
};

const COLORS: Record<BrandId, string> = {
  instagram: "#C13584",
  facebook: "#1877F2",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  tiktok: "#111111",
  ga4: "#E37400",
  meta: "#0866FF",
  "search-console": "#4285F4",
};

export function BrandIcon({
  id,
  className = "h-5 w-5",
  colored = false,
}: {
  id: BrandId;
  className?: string;
  colored?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={colored ? { color: COLORS[id] } : undefined}
      aria-hidden
    >
      {PATHS[id]}
    </svg>
  );
}
