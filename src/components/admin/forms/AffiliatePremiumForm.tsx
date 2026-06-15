"use client";

import { AdminFormTabs } from "@/components/admin/AdminFormTabs";
import { AdminMessage } from "@/components/admin/AdminMessage";
import { ImageUploadField } from "@/components/admin/cms/ImageUploadField";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  createAffiliateAction,
  updateAffiliateAction,
} from "@/lib/admin/actions/affiliates.actions";
import type { AdminActionState } from "@/lib/admin/types";
import { AFFILIATE_CATEGORY_OPTIONS } from "@/lib/affiliates/categories";
import {
  AFFILIATE_COMMISSION_TYPES,
  AFFILIATE_PLATFORMS,
  AFFILIATE_PRODUCT_TYPES,
} from "@/lib/affiliates/types";
import type { AffiliateLinkRecord } from "@/lib/affiliates/types";
import { useActionState } from "react";

const initialState: AdminActionState = {};

const selectClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-forest";

interface AffiliatePremiumFormProps {
  link?: AffiliateLinkRecord;
}

export function AffiliatePremiumForm({ link }: AffiliatePremiumFormProps) {
  const action = link ? updateAffiliateAction : createAffiliateAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const categoryValue =
    AFFILIATE_CATEGORY_OPTIONS.find(
      (opt) =>
        opt.value === link?.category ||
        opt.label.toLowerCase() === link?.category?.toLowerCase(),
    )?.value ?? link?.category ?? "";

  const tabs = [
    {
      id: "basic",
      label: "Informações",
      content: (
        <div className="space-y-4">
          <Input label="Nome do produto" name="title" defaultValue={link?.title} required />
          <Input label="Slug" name="slug" defaultValue={link?.slug} required />
          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-graphite">
              Categoria
            </label>
            <select
              id="category"
              name="category"
              defaultValue={categoryValue}
              required
              className={selectClass}
            >
              <option value="" disabled>
                Selecione
              </option>
              {AFFILIATE_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="product_type"
              className="mb-1.5 block text-sm font-medium text-graphite"
            >
              Tipo de produto
            </label>
            <select
              id="product_type"
              name="product_type"
              defaultValue={link?.productType ?? "outro"}
              className={selectClass}
            >
              {AFFILIATE_PRODUCT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <Input label="Marca" name="brand" defaultValue={link?.brand} />
          <Input
            label="Nome do produtor"
            name="producer_name"
            defaultValue={link?.producerName}
          />
        </div>
      ),
    },
    {
      id: "media",
      label: "Mídia",
      content: (
        <div className="space-y-4">
          <ImageUploadField
            label="Imagem principal"
            name="image_url"
            folder="afiliados"
            defaultUrl={link?.imageUrl ?? undefined}
          />
          <p className="text-xs text-muted">Imagem obrigatória para publicar a oferta.</p>
          <Input
            label="Vídeo YouTube (URL opcional)"
            name="video_url"
            type="url"
            defaultValue={link?.videoUrl ?? ""}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      ),
    },
    {
      id: "content",
      label: "Conteúdo",
      content: (
        <div className="space-y-4">
          <Textarea
            label="Descrição curta"
            name="short_description"
            defaultValue={link?.shortDescription}
            rows={2}
            required
            placeholder="Resumo para cards e listagens (até 160 caracteres)"
          />
          <Textarea
            label="Descrição detalhada"
            name="description"
            defaultValue={link?.description}
            rows={5}
          />
          <Textarea
            label="Benefícios (um por linha)"
            name="benefits"
            defaultValue={link?.benefits}
            rows={4}
          />
          <Textarea
            label="Para quem é"
            name="target_audience"
            defaultValue={link?.targetAudience}
            rows={3}
          />
          <Textarea
            label="Contraindicações"
            name="contraindications"
            defaultValue={link?.contraindications}
            rows={3}
          />
        </div>
      ),
    },
    {
      id: "commercial",
      label: "Comercial",
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Preço atual (R$)"
            name="current_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={link?.currentPrice?.toString() ?? ""}
          />
          <Input
            label="Preço antigo (R$)"
            name="old_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={link?.oldPrice?.toString() ?? ""}
          />
          <div className="sm:col-span-2">
            <Input
              label="Parcelamento"
              name="installments"
              defaultValue={link?.installments}
              placeholder="Ex.: 12x de R$ 29,90 sem juros"
            />
          </div>
        </div>
      ),
    },
    {
      id: "affiliate",
      label: "Afiliado",
      content: (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="affiliate_platform"
              className="mb-1.5 block text-sm font-medium text-graphite"
            >
              Plataforma
            </label>
            <select
              id="affiliate_platform"
              name="affiliate_platform"
              defaultValue={link?.affiliatePlatform ?? ""}
              required
              className={selectClass}
            >
              <option value="" disabled>
                Selecione a plataforma
              </option>
              {AFFILIATE_PLATFORMS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Link de afiliado"
            name="affiliate_url"
            type="url"
            defaultValue={link?.affiliateUrl}
            required
          />
          <Input
            label="Link oficial"
            name="official_url"
            type="url"
            defaultValue={link?.officialUrl}
          />
          <div>
            <label
              htmlFor="commission_type"
              className="mb-1.5 block text-sm font-medium text-graphite"
            >
              Tipo de comissão
            </label>
            <select
              id="commission_type"
              name="commission_type"
              defaultValue={link?.commissionType ?? ""}
              className={selectClass}
            >
              <option value="">Selecione</option>
              {AFFILIATE_COMMISSION_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Valor da comissão"
            name="commission_value"
            defaultValue={link?.commissionValue}
            placeholder="Ex.: 8% ou R$ 45,00"
          />
          <Input
            label="Duração do cookie"
            name="cookie_duration"
            defaultValue={link?.cookieDuration}
            placeholder="Ex.: 30 dias"
          />
        </div>
      ),
    },
    {
      id: "seo",
      label: "SEO",
      content: (
        <div className="space-y-4">
          <Input label="SEO Title" name="seo_title" defaultValue={link?.seoTitle ?? ""} />
          <Textarea
            label="SEO Description"
            name="seo_description"
            defaultValue={link?.seoDescription ?? ""}
            rows={3}
          />
          <Input
            label="SEO Keywords"
            name="seo_keywords"
            defaultValue={link?.seoKeywords ?? ""}
          />
        </div>
      ),
    },
    {
      id: "social",
      label: "Prova social",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Avaliação (0–5)"
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              defaultValue={link?.rating?.toString() ?? ""}
            />
            <Input
              label="Quantidade de avaliações"
              name="reviews_count"
              type="number"
              min="0"
              defaultValue={link?.reviewsCount?.toString() ?? "0"}
            />
          </div>
          <Textarea
            label="Depoimento 1"
            name="testimonial_1"
            defaultValue={link?.testimonial1}
            rows={2}
          />
          <Textarea
            label="Depoimento 2"
            name="testimonial_2"
            defaultValue={link?.testimonial2}
            rows={2}
          />
          <Textarea
            label="Depoimento 3"
            name="testimonial_3"
            defaultValue={link?.testimonial3}
            rows={2}
          />
        </div>
      ),
    },
    {
      id: "highlights",
      label: "Destaques",
      content: (
        <div className="space-y-3 rounded-xl border border-border bg-off-white/50 p-4">
          <label className="flex items-center gap-2 text-sm text-graphite">
            <input
              type="checkbox"
              name="active"
              defaultChecked={link?.active ?? true}
              className="h-4 w-4 rounded border-border text-sage"
            />
            Ativo (visível no portal)
          </label>
          <label className="flex items-center gap-2 text-sm text-graphite">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={link?.featured ?? false}
              className="h-4 w-4 rounded border-border text-sage"
            />
            Destaque no marketplace (/recomendados)
          </label>
          <label className="flex items-center gap-2 text-sm text-graphite">
            <input
              type="checkbox"
              name="editor_choice"
              defaultChecked={link?.editorChoice ?? false}
              className="h-4 w-4 rounded border-border text-sage"
            />
            Escolha do Editor
          </label>
        </div>
      ),
    },
  ];

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-6">
      {link && <input type="hidden" name="id" value={link.id} />}
      <AdminMessage error={state.error} success={state.success} />
      <AdminFormTabs tabs={tabs} />
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Salvando…" : link ? "Salvar alterações" : "Criar afiliado"}
      </Button>
    </form>
  );
}
