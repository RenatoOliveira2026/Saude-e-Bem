import { getCurrentUser } from "@/lib/auth/session";
import { getClubMembership } from "@/lib/club/access";
import { fetchIntelligentRecommendations } from "@/lib/club/services/intelligent-recommendations.service";
import type { FavoriteContentType } from "@/lib/favorites/types";
import { RelatedContentLinks } from "./RelatedContentLinks";

interface RelatedContentSectionProps {
  contentType: FavoriteContentType;
  contentId: string;
  title?: string;
}

export async function RelatedContentSection({
  contentType,
  contentId,
  title = "Conteúdos relacionados para você",
}: RelatedContentSectionProps) {
  const user = await getCurrentUser();
  if (!user) return null;

  const membership = await getClubMembership(user.id);
  const recommendations = await fetchIntelligentRecommendations({
    userId: user.id,
    isPremium: membership.isPremium,
    limit: 12,
  });

  const related = recommendations
    .filter(
      (item) =>
        item.id !== contentId &&
        (item.kind === "related" || item.kind === "personalized"),
    )
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <RelatedContentLinks
      title={title}
      links={related.map((item) => ({
        label: item.title,
        href: item.href,
        description: item.reason,
      }))}
    />
  );
}
