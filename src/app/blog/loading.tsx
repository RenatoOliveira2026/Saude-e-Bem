import { ContentListingLoading } from "@/components/pages";
import { PageHero } from "@/components/layout/PageHero";

export default function BlogLoading() {
  return (
    <>
      <PageHero
        badge="Blog"
        title="Artigos & insights de saúde"
        description="Conteúdo escrito por especialistas para informar, inspirar e traduzir ciência em ações práticas."
      />
      <ContentListingLoading variant="blog" />
    </>
  );
}
