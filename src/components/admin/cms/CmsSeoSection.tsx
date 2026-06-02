import { ImageUploadField } from "@/components/admin/cms/ImageUploadField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export interface CmsSeoValues {
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  ogImageUrl?: string | null;
}

interface CmsSeoSectionProps {
  values?: CmsSeoValues;
  ogFolder: string;
}

export function CmsSeoSection({ values, ogFolder }: CmsSeoSectionProps) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-soft">
      <div>
        <h3 className="font-heading text-base font-semibold text-forest">SEO</h3>
        <p className="mt-1 text-sm text-muted">
          Metadados para buscadores e redes sociais.
        </p>
      </div>
      <Input
        label="SEO Title"
        name="seo_title"
        defaultValue={values?.seoTitle ?? ""}
        hint="Se vazio, usa o título do conteúdo"
      />
      <Textarea
        label="SEO Description"
        name="seo_description"
        defaultValue={values?.seoDescription ?? ""}
        rows={3}
      />
      <Input
        label="SEO Keywords"
        name="seo_keywords"
        defaultValue={values?.seoKeywords ?? ""}
        hint="Separadas por vírgula"
      />
      <ImageUploadField
        label="Open Graph Image"
        name="og_image_url"
        folder={ogFolder}
        defaultUrl={values?.ogImageUrl ?? undefined}
        hint="Imagem ao compartilhar link (1200×630 recomendado)"
      />
    </section>
  );
}
