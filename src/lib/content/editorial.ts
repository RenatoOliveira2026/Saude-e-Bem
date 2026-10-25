/** Autoria editorial do portal (usada quando não há profissional identificado). */
export const EDITORIAL_TEAM_NAME = "Equipe Saúde & Bem";
export const EDITORIAL_TEAM_ROLE = "Equipe editorial";

export function isEditorialAuthor(author: string | null | undefined): boolean {
  if (!author) return true;
  return author.trim().toLowerCase().startsWith("equipe");
}
