/**
 * Contas de marketing configuráveis pelo painel (Admin → Marketing).
 * Arquivo sem dependências de servidor: usado no painel e no site.
 */

export type SocialNetwork = "instagram" | "facebook" | "whatsapp" | "linkedin" | "pinterest" | "youtube" | "tiktok";

export type MarketingSettingKey = "meta_pixel_id" | `social_${SocialNetwork}`;

export type MarketingSettings = Partial<Record<MarketingSettingKey, string>>;

export interface SocialNetworkInfo {
  id: SocialNetwork;
  label: string;
  /** Domínios aceitos para o endereço do perfil. */
  hosts: readonly string[];
  example: string;
  description: string;
}

export const SOCIAL_NETWORKS: readonly SocialNetworkInfo[] = [
  {
    id: "instagram",
    label: "Instagram",
    hosts: ["instagram.com"],
    example: "https://www.instagram.com/saudeebem",
    description: "Perfil do Instagram exibido no rodapé do site.",
  },
  {
    id: "facebook",
    label: "Facebook",
    hosts: ["facebook.com", "fb.com"],
    example: "https://www.facebook.com/saudeebem",
    description: "Página do Facebook exibida no rodapé do site.",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    hosts: ["whatsapp.com"],
    example: "https://whatsapp.com/channel/0029Va...",
    description: "Canal do WhatsApp: aparece no rodapé e no convite ao fim dos artigos.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    hosts: ["linkedin.com"],
    example: "https://www.linkedin.com/company/saudeebem",
    description: "Página da empresa no LinkedIn exibida no rodapé do site.",
  },
  {
    id: "pinterest",
    label: "Pinterest",
    hosts: ["pinterest.com", "pinterest.com.br", "pin.it"],
    example: "https://br.pinterest.com/saudeebem",
    description: "Perfil do Pinterest exibido no rodapé do site.",
  },
  {
    id: "youtube",
    label: "YouTube",
    hosts: ["youtube.com", "youtu.be"],
    example: "https://www.youtube.com/@saudeebem",
    description: "Canal do YouTube exibido no rodapé do site.",
  },
  {
    id: "tiktok",
    label: "TikTok",
    hosts: ["tiktok.com"],
    example: "https://www.tiktok.com/@saudeebem",
    description: "Perfil do TikTok exibido no rodapé do site.",
  },
];

export const MARKETING_SETTING_KEYS: readonly MarketingSettingKey[] = [
  "meta_pixel_id",
  ...SOCIAL_NETWORKS.map((n) => `social_${n.id}` as const),
];

export function isMarketingSettingKey(key: string): key is MarketingSettingKey {
  return (MARKETING_SETTING_KEYS as readonly string[]).includes(key);
}

/** Pixel da Meta: só números (normalmente 15 ou 16 dígitos). */
export function normalizeMetaPixelId(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "";
  return /^\d{8,20}$/.test(value) ? value : null;
}

/** Endereço de perfil: https e domínio da rede certa. Vazio = desconectar. */
export function normalizeSocialUrl(network: SocialNetworkInfo, raw: string): string | null {
  let value = raw.trim();
  if (!value) return "";
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^(www\.|m\.)/, "");
    const ok = network.hosts.some((h) => host === h || host.endsWith(`.${h}`));
    if (!ok || url.pathname.length <= 1) return null;
    url.protocol = "https:";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getSocialLinks(
  settings: MarketingSettings,
): { network: SocialNetworkInfo; url: string }[] {
  return SOCIAL_NETWORKS.flatMap((network) => {
    const url = settings[`social_${network.id}`];
    return url ? [{ network, url }] : [];
  });
}
