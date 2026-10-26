/**
 * Fotos de capa padrão (Unsplash, licença de uso livre) para protocolos,
 * itens da biblioteca e guias em PDF.
 *
 * Só são usadas quando o item não tem capa própria, ou quando a capa é
 * genérica (logo do site ou ilustração de categoria). Uma capa enviada pelo
 * painel sempre tem prioridade.
 */

type CoverKind = "protocol" | "library" | "ebook";

const PROTOCOL_PHOTOS: Record<string, string> = {
  "energia-diaria": "1627622718888-1c8f96aadbbe",
  "sono-reparador": "1732360466799-1a66fa1337dd",
  "saude-intestinal": "1684403620650-81dc661a69db",
  "detox-natural": "1553455860-2fa544e14141",
  "longevidade-saudavel": "1657049010734-d7d7ea43d617",
  "menopausa-saudavel": "1616180041016-68e6cbdbf3d6",
  "sono-restaurador": "1601276174812-63280a55656e",
  "energia-diaria-premium": "1728450167629-8eb96e9a461c",
  "reducao-estresse": "1603710488233-cdd4e1eb9c14",
  "saude-intestinal-premium": "1599184469041-d592691ed302",
  "habitos-saudaveis-30-dias": "1569230919100-d3fd5e1132f4",
  "hidratacao-inteligente": "1525881157111-2379cbebbf9b",
  "mobilidade-alongamento": "1637157216470-d92cd2edb2e8",
  "foco-produtividade": "1758691030771-9dadc2a828d4",
  "emagrecimento-saudavel": "1543352632-5a4b24e4d2a6",
  "longevidade-premium": "1763697038882-aa77b44e7c68",
};

const LIBRARY_ONLY_PHOTOS: Record<string, string> = {
  "guia-hidratacao": "1622575464646-c3c26ee5a3db",
  "checklist-saude-preventiva": "1758691462413-b07dee2933fe",
  "sono-reparador-ebook": "1616418928117-4e6d19be2df1",
  "manual-longevidade": "1654321247660-611000f17f30",
  "guia-emagrecimento-metabolico": "1550989460-0adf9ea622e2",
  "coracao-saudavel": "1712334562767-5d366d0c40d9",
};

const EBOOK_PHOTOS: Record<string, string> = {
  "guia-detox-inteligente": "1466637574441-749b8f19452f",
  "guia-energia-natural": "1604010864944-e5ec5c985630",
  "guia-sono-saudavel": "1652161853855-005106816b9f",
  "guia-habitos-saudaveis": "1599008633840-052c7f756385",
  "guia-saude-intestinal": "1564894809611-1742fc40ed80",
};

const PHOTOS: Record<CoverKind, Record<string, string>> = {
  protocol: PROTOCOL_PHOTOS,
  // Itens da biblioteca que são versões dos protocolos premium usam a mesma foto.
  library: { ...PROTOCOL_PHOTOS, ...LIBRARY_ONLY_PHOTOS },
  ebook: EBOOK_PHOTOS,
};

function unsplashUrl(id: string): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
}

/** Capa ausente, logo do site ou ilustração genérica de categoria. */
export function isGenericCover(url?: string | null): boolean {
  if (!url?.trim()) return true;
  const path = url.trim().split("?")[0] ?? "";
  return (
    /\/logo-saude-bem\.png(\.png)?$/.test(path) ||
    /\/blog\/categories\/[^/]+\.svg$/.test(path)
  );
}

/** Mantém uma capa própria; senão, devolve a foto padrão do item (se houver). */
export function resolveCoverPhoto(
  kind: CoverKind,
  slug: string,
  current?: string | null,
): string | undefined {
  if (!isGenericCover(current)) return current ?? undefined;
  const id = PHOTOS[kind][slug];
  return id ? unsplashUrl(id) : (current ?? undefined);
}
