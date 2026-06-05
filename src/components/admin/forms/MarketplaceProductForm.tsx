"use client";

import { AdminMessage } from "@/components/admin/AdminMessage";
import { CmsSeoSection } from "@/components/admin/cms/CmsSeoSection";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  createMarketplaceProductAction,
  updateMarketplaceProductAction,
} from "@/lib/admin/actions/marketplace.actions";
import type { MarketplaceProductAdminRecord } from "@/lib/admin/services/marketplace.service";
import type { AdminActionState } from "@/lib/admin/types";
import {
  MARKETPLACE_FULFILLMENT_OPTIONS,
  MARKETPLACE_PRODUCT_TYPE_OPTIONS,
} from "@/lib/content-engine/constants";
import { useActionState } from "react";

const initialState: AdminActionState = {};
const selectClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-forest";

interface MarketplaceProductFormProps {
  product?: MarketplaceProductAdminRecord;
}

export function MarketplaceProductForm({ product }: MarketplaceProductFormProps) {
  const action = product ? updateMarketplaceProductAction : createMarketplaceProductAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      <AdminMessage error={state.error} success={state.success} />
      <Input label="Título" name="title" defaultValue={product?.title} required />
      <Input label="Slug" name="slug" defaultValue={product?.slug} required />
      <Textarea
        label="Descrição"
        name="description"
        defaultValue={product?.description}
        rows={4}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Categoria (slug)" name="category" defaultValue={product?.category} required />
        <Input
          label="Categoria (label)"
          name="category_label"
          defaultValue={product?.category_label}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fulfillment" className="mb-1.5 block text-sm font-medium text-graphite">
            Tipo de produto
          </label>
          <select
            id="fulfillment"
            name="fulfillment"
            defaultValue={product?.fulfillment ?? "digital"}
            className={selectClass}
          >
            {MARKETPLACE_FULFILLMENT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="product_type" className="mb-1.5 block text-sm font-medium text-graphite">
            Formato
          </label>
          <select
            id="product_type"
            name="product_type"
            defaultValue={product?.product_type ?? "ebook"}
            className={selectClass}
          >
            {MARKETPLACE_PRODUCT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Preço atual (R$)"
          name="current_price"
          type="number"
          step="0.01"
          defaultValue={product?.current_price ?? undefined}
        />
        <Input
          label="Preço anterior (R$)"
          name="old_price"
          type="number"
          step="0.01"
          defaultValue={product?.old_price ?? undefined}
        />
      </div>
      <Input label="Parcelamento" name="installments" defaultValue={product?.installments ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Slug biblioteca (digital)"
          name="library_slug"
          defaultValue={product?.library_slug ?? ""}
        />
        <Input
          label="Slug afiliado"
          name="affiliate_slug"
          defaultValue={product?.affiliate_slug ?? ""}
        />
      </div>
      <div>
        <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-graphite">
          Status
        </label>
        <select id="status" name="status" defaultValue={product?.status ?? "draft"} className={selectClass}>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="archived">Arquivado</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-forest">
        <input type="checkbox" name="is_premium" defaultChecked={product?.is_premium} />
        Premium
      </label>
      <label className="flex items-center gap-2 text-sm text-forest">
        <input type="checkbox" name="featured" defaultChecked={product?.featured} />
        Destaque
      </label>
      <label className="flex items-center gap-2 text-sm text-forest">
        <input type="checkbox" name="editor_choice" defaultChecked={product?.editor_choice} />
        Escolha do editor
      </label>
      <CmsSeoSection
        ogFolder="marketplace"
        values={{
          seoTitle: product?.seo_title,
          seoDescription: product?.seo_description,
          seoKeywords: product?.seo_keywords,
          ogImageUrl: product?.og_image_url,
        }}
      />
      <Button type="submit" variant="primary" disabled={pending}>
        {product ? "Salvar" : "Criar produto"}
      </Button>
    </form>
  );
}
