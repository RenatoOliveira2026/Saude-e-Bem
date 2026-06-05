"use client";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import type { AdminListItem } from "@/components/admin/AdminContentList";
import { Button } from "@/components/ui/Button";
import { deleteAffiliateAction } from "@/lib/admin/actions/affiliates.actions";
import { deleteLibraryItemAction } from "@/lib/admin/actions/library-items.actions";
import { deleteMarketplaceProductAction } from "@/lib/admin/actions/marketplace.actions";
import {
  deleteArticleAction,
  publishArticleFormAction,
} from "@/lib/admin/actions/articles.actions";
import {
  deleteEbookAction,
  publishEbookFormAction,
} from "@/lib/admin/actions/ebooks.actions";
import {
  deleteProtocolAction,
  publishProtocolFormAction,
} from "@/lib/admin/actions/protocols.actions";
import { adminRoutes, routes } from "@/lib/routes";

export type AdminListResource =
  | "articles"
  | "protocols"
  | "ebooks"
  | "affiliates"
  | "library-items"
  | "marketplace";

interface AdminRowActionsProps {
  resource: AdminListResource;
  item: AdminListItem;
}

export function AdminRowActions({ resource, item }: AdminRowActionsProps) {
  if (resource === "affiliates") {
    return (
      <>
        <Button href={adminRoutes.afiliadoEditar(item.id)} variant="ghost" size="sm">
          Editar
        </Button>
        <AdminDeleteButton onDelete={() => deleteAffiliateAction(item.id)} />
      </>
    );
  }

  if (resource === "library-items") {
    return (
      <>
        <Button href={adminRoutes.bibliotecaItemEditar(item.id)} variant="ghost" size="sm">
          Editar
        </Button>
        {item.status === "published" && (
          <Button href={routes.bibliotecaItem(item.slug)} variant="ghost" size="sm">
            Ver
          </Button>
        )}
        <AdminDeleteButton onDelete={() => deleteLibraryItemAction(item.id)} />
      </>
    );
  }

  if (resource === "marketplace") {
    return (
      <>
        <Button href={adminRoutes.marketplaceEditar(item.id)} variant="ghost" size="sm">
          Editar
        </Button>
        {item.status === "published" && (
          <Button href={routes.marketplaceItem(item.slug)} variant="ghost" size="sm">
            Ver
          </Button>
        )}
        <AdminDeleteButton onDelete={() => deleteMarketplaceProductAction(item.id)} />
      </>
    );
  }

  if (resource === "articles") {
    return (
      <>
        <Button href={adminRoutes.artigoEditar(item.id)} variant="ghost" size="sm">
          Editar
        </Button>
        {item.status === "published" && (
          <Button href={routes.artigo(item.slug)} variant="ghost" size="sm">
            Ver
          </Button>
        )}
        {item.status === "draft" && (
          <form action={publishArticleFormAction}>
            <input type="hidden" name="id" value={item.id} />
            <Button type="submit" variant="secondary" size="sm">
              Publicar
            </Button>
          </form>
        )}
        <AdminDeleteButton onDelete={() => deleteArticleAction(item.id)} />
      </>
    );
  }

  if (resource === "protocols") {
    return (
      <>
        <Button href={adminRoutes.protocoloEditar(item.id)} variant="ghost" size="sm">
          Editar
        </Button>
        {item.status === "published" && (
          <Button href={routes.protocolo(item.slug)} variant="ghost" size="sm">
            Ver
          </Button>
        )}
        {item.status === "draft" && (
          <form action={publishProtocolFormAction}>
            <input type="hidden" name="id" value={item.id} />
            <Button type="submit" variant="secondary" size="sm">
              Publicar
            </Button>
          </form>
        )}
        <AdminDeleteButton onDelete={() => deleteProtocolAction(item.id)} />
      </>
    );
  }

  return (
    <>
      <Button href={adminRoutes.bibliotecaEditar(item.id)} variant="ghost" size="sm">
        Editar
      </Button>
      {item.status === "published" && (
        <Button href={routes.bibliotecaItem(item.slug)} variant="ghost" size="sm">
          Ver
        </Button>
      )}
      {item.status === "draft" && (
        <form action={publishEbookFormAction}>
          <input type="hidden" name="id" value={item.id} />
          <Button type="submit" variant="secondary" size="sm">
            Publicar
          </Button>
        </form>
      )}
      <AdminDeleteButton onDelete={() => deleteEbookAction(item.id)} />
    </>
  );
}
