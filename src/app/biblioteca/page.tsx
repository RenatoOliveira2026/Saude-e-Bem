import {
  ContentEmptyState,
  CrossLinks,
  LibraryListing,
  PageCta,
} from "@/components/pages";
import { PageHero } from "@/components/layout/PageHero";
import {
  getFeaturedLibraryResource,
  getLibraryResources,
} from "@/lib/data/repositories/library.repository";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Biblioteca",
  description:
    "Guias, checklists, estudos e planos curados — materiais gratuitos para aprofundar seu conhecimento em saúde e longevidade.",
};

export default async function BibliotecaPage() {
  const [resources, featured] = await Promise.all([
    getLibraryResources(),
    getFeaturedLibraryResource(),
  ]);

  const isEmpty = resources.length === 0;

  return (
    <>
      <PageHero
        badge="Biblioteca"
        title="Recursos curados para sua evolução"
        description="Materiais selecionados pela equipe Saúde & Bem — guias práticos, checklists, estudos científicos e planos de ação para download."
      />
      {isEmpty ? (
        <ContentEmptyState
          icon="download"
          title="Biblioteca em expansão"
          description="Guias e materiais curados serão adicionados em breve. Enquanto isso, leia artigos no blog ou inicie um protocolo."
          actionLabel="Ler artigos no blog"
          actionHref={routes.blog}
        />
      ) : (
        <LibraryListing resources={resources} featured={featured} />
      )}
      <PageCta
        title="Biblioteca premium no Clube"
        description="Membros têm acesso a guias avançados, planos de 90 dias e estudos exclusivos atualizados mensalmente."
        primaryLabel="Entrar na lista de espera"
        primaryHref={`${routes.clube}#lista-espera`}
        secondaryLabel="Ler artigos no blog"
        secondaryHref={routes.blog}
      />
      <CrossLinks />
    </>
  );
}
