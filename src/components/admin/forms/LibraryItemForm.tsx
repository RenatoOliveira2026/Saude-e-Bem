"use client";

import { AdminMessage } from "@/components/admin/AdminMessage";
import { CmsSeoSection } from "@/components/admin/cms/CmsSeoSection";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  createLibraryItemAction,
  updateLibraryItemAction,
} from "@/lib/admin/actions/library-items.actions";
import type { AdminActionState } from "@/lib/admin/types";
import { LIBRARY_TIER_OPTIONS } from "@/lib/content-engine/constants";
import type { LibraryItemAdminRecord } from "@/lib/admin/services/library-items.service";
import { useActionState } from "react";

const initialState: AdminActionState = {};
const selectClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-forest";

interface LibraryItemFormProps {
  item?: LibraryItemAdminRecord;
}

export function LibraryItemForm({ item }: LibraryItemFormProps) {
  const action = item ? updateLibraryItemAction : createLibraryItemAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-6">
      {item && <input type="hidden" name="id" value={item.id} />}
      <AdminMessage error={state.error} success={state.success} />
      <Input label="Título" name="title" defaultValue={item?.title} required />
      <Input label="Slug" name="slug" defaultValue={item?.slug} required />
      <Textarea
        label="Descrição"
        name="description"
        defaultValue={item?.description}
        rows={4}
        required
      />
      <Textarea
        label="Descrição longa (SEO / página)"
        name="long_description"
        defaultValue={item?.long_description}
        rows={6}
        hint="Texto completo exibido na página de detalhe"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Categoria (slug)" name="category" defaultValue={item?.category} required />
        <Input
          label="Categoria (label)"
          name="category_label"
          defaultValue={item?.category_label}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="item_type" className="mb-1.5 block text-sm font-medium text-graphite">
            Tipo
          </label>
          <select
            id="item_type"
            name="item_type"
            defaultValue={item?.item_type ?? "ebook"}
            className={selectClass}
          >
            <option value="ebook">E-book</option>
            <option value="protocolo">Protocolo</option>
            <option value="video">Vídeo</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        <div>
          <label htmlFor="tier" className="mb-1.5 block text-sm font-medium text-graphite">
            Camada
          </label>
          <select id="tier" name="tier" defaultValue={item?.tier ?? "free"} className={selectClass}>
            {LIBRARY_TIER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Input
        label="Tempo estimado"
        name="estimated_read_time"
        defaultValue={item?.estimated_read_time ?? "10 min"}
      />
      <div>
        <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-graphite">
          Status
        </label>
        <select id="status" name="status" defaultValue={item?.status ?? "draft"} className={selectClass}>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="archived">Arquivado</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-forest">
        <input type="checkbox" name="featured" defaultChecked={item?.featured} />
        Destaque na listagem
      </label>
      <label className="flex items-center gap-2 text-sm text-forest">
        <input type="checkbox" name="is_premium" defaultChecked={item?.is_premium} />
        Marcar como premium (além do tier)
      </label>
      <CmsSeoSection
        ogFolder="biblioteca"
        values={{
          seoTitle: item?.seo_title,
          seoDescription: item?.seo_description,
          seoKeywords: item?.seo_keywords,
          ogImageUrl: item?.og_image_url,
        }}
      />
      <Button type="submit" variant="primary" disabled={pending}>
        {item ? "Salvar" : "Criar item"}
      </Button>
    </form>
  );
}
