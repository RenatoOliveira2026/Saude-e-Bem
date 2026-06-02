"use client";

import { CmsEditorShell } from "@/components/admin/cms/CmsEditorShell";
import { CmsFeaturedSwitch } from "@/components/admin/cms/CmsFeaturedSwitch";
import { CmsSeoSection } from "@/components/admin/cms/CmsSeoSection";
import { ImageUploadField } from "@/components/admin/cms/ImageUploadField";
import { PdfUploadField } from "@/components/admin/cms/PdfUploadField";
import { RichContentEditor } from "@/components/admin/cms/RichContentEditor";
import { EbookPreview } from "@/components/admin/cms/previews/EbookPreview";
import { Input, Select } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  createEbookAction,
  updateEbookAction,
} from "@/lib/admin/actions/ebooks.actions";
import { parseContentBlocks } from "@/lib/admin/cms/content-blocks";
import { arrayToLines, linesToArray } from "@/lib/admin/utils";
import type { AdminActionState } from "@/lib/admin/types";
import { libraryCategories } from "@/lib/data/library";
import type { LibraryResource } from "@/lib/data/types";
import { routes } from "@/lib/routes";
import { useActionState, useMemo, useState } from "react";

const initialState: AdminActionState = {};

const iconOptions = [
  { value: "leaf", label: "Folha" },
  { value: "bolt", label: "Energia" },
  { value: "moon", label: "Sono" },
  { value: "checklist", label: "Checklist" },
  { value: "vitality", label: "Vitalidade" },
  { value: "book", label: "Livro" },
];

interface EbookCmsFormProps {
  ebook?: LibraryResource;
}

export function EbookCmsForm({ ebook }: EbookCmsFormProps) {
  const action = ebook ? updateEbookAction : createEbookAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const initialBlocks = useMemo(
    () =>
      ebook?.contentBlocks ??
      parseContentBlocks(ebook?.longDescription ?? ""),
    [ebook],
  );

  const [title, setTitle] = useState(ebook?.title ?? "");
  const [description, setDescription] = useState(ebook?.description ?? "");
  const [categoryLabel, setCategoryLabel] = useState(ebook?.categoryLabel ?? "");
  const [format, setFormat] = useState(ebook?.format ?? "PDF");
  const [pages, setPages] = useState(String(ebook?.pages ?? 0));
  const [highlightsText, setHighlightsText] = useState(
    ebook ? arrayToLines(ebook.highlights) : "",
  );
  const [coverImageUrl, setCoverImageUrl] = useState(ebook?.coverImageUrl ?? "");
  const [pdfUrl, setPdfUrl] = useState(ebook?.pdfUrl ?? "");

  const categoryOptions = libraryCategories
    .filter((c) => c.id !== "todos")
    .map((c) => ({ value: c.id, label: c.label }));

  const previewUrl =
    ebook?.status === "published" && ebook.slug
      ? routes.bibliotecaItem(ebook.slug)
      : undefined;

  return (
    <CmsEditorShell
      formAction={formAction}
      state={state}
      pending={pending}
      isEdit={Boolean(ebook)}
      previewUrl={previewUrl}
      preview={
        <EbookPreview
          title={title}
          description={description}
          longDescription={description}
          categoryLabel={categoryLabel}
          format={format}
          pages={Number.parseInt(pages, 10) || 0}
          highlights={linesToArray(highlightsText)}
          coverImageUrl={coverImageUrl}
          pdfUrl={pdfUrl}
        />
      }
    >
      {ebook && <input type="hidden" name="id" value={ebook.id} />}

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Input label="Título" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Slug" name="slug" defaultValue={ebook?.slug} hint="Vazio = automático" />
        </div>

        <Textarea label="Descrição curta" name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />

        <ImageUploadField
          label="Capa do conteúdo"
          name="cover_image_url"
          folder="biblioteca"
          defaultUrl={ebook?.coverImageUrl}
          onUrlChange={setCoverImageUrl}
        />

        <PdfUploadField name="pdf_url" defaultUrl={ebook?.pdfUrl} onUrlChange={setPdfUrl} />

        <RichContentEditor
          label="Conteúdo do material"
          name="content_blocks"
          initialBlocks={initialBlocks}
          imageFolder="biblioteca"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Categoria" name="category" defaultValue={ebook?.category ?? "Detox"} options={categoryOptions} />
          <Input label="Rótulo categoria" name="category_label" value={categoryLabel} onChange={(e) => setCategoryLabel(e.target.value)} />
          <Select label="Ícone" name="icon" defaultValue={ebook?.icon ?? "leaf"} options={iconOptions} />
          <Input label="Formato" name="format" value={format} onChange={(e) => setFormat(e.target.value)} />
          <Input label="Páginas" name="pages" type="number" min={0} value={pages} onChange={(e) => setPages(e.target.value)} />
          <Input label="Downloads" name="downloads" type="number" min={0} defaultValue={ebook?.downloads ?? 0} />
        </div>

        <Textarea label="Destaques" name="highlights" value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} hint="Um por linha" rows={4} />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_premium" defaultChecked={ebook?.isPremium} className="h-4 w-4 rounded" />
          Premium
        </label>

        <CmsFeaturedSwitch defaultChecked={ebook?.featured} />

        <CmsSeoSection
          ogFolder="biblioteca"
          values={{
            seoTitle: ebook?.seoTitle,
            seoDescription: ebook?.seoDescription,
            seoKeywords: ebook?.seoKeywords,
            ogImageUrl: ebook?.ogImageUrl,
          }}
        />
      </div>
    </CmsEditorShell>
  );
}
