/** Tipos de material na biblioteca (Fase 4.6). */
export type LibraryItemType = "ebook" | "protocolo" | "video" | "pdf" | "affiliate";

export type LibraryFilterId =
  | "todos"
  | "gratuitos"
  | "premium"
  | "ebooks"
  | "protocolos"
  | "videos";

export interface LibraryFilterOption {
  id: LibraryFilterId;
  label: string;
}

/** Metadados de mídia — preparado para Supabase Storage e afiliados. */
export interface LibraryItemAssets {
  /** Caminho no bucket Supabase Storage (ex.: `library/ebooks/guia.pdf`) */
  storagePath?: string;
  pdfUrl?: string;
  videoUrl?: string;
  ebookFileUrl?: string;
  affiliateProductId?: string;
  affiliateUrl?: string;
}

/** Item do catálogo inteligente. */
export interface LibraryItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  type: LibraryItemType;
  isPremium: boolean;
  image?: string;
  estimatedReadTime: string;
  /** Destaque na listagem */
  featured?: boolean;
  /** Integração futura com Storage, PDFs, vídeos e afiliados */
  assets?: LibraryItemAssets;
}

export interface LibraryCatalogStats {
  total: number;
  free: number;
  premium: number;
  byType: Record<LibraryItemType, number>;
}
