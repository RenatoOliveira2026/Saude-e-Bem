/** Tipos de conteúdo favoritável — espelha check constraint da tabela favorites */
export type FavoriteContentType = "article" | "protocol" | "ebook";

export interface Favorite {
  id: string;
  userId: string;
  contentType: FavoriteContentType;
  contentId: string;
  createdAt: string;
}

export interface FavoriteInput {
  contentType: FavoriteContentType;
  contentId: string;
}
