import { ContentListingLoading } from "@/components/pages";
import { PageHero } from "@/components/layout/PageHero";

export default function BibliotecaLoading() {
  return (
    <>
      <PageHero
        badge="Biblioteca"
        title="Recursos curados para sua evolução"
        description="Materiais selecionados pela equipe Saúde & Bem."
      />
      <ContentListingLoading variant="library" />
    </>
  );
}
