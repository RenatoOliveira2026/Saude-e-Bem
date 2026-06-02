"use client";

import { CmsEditorShell } from "@/components/admin/cms/CmsEditorShell";
import { CmsFeaturedSwitch } from "@/components/admin/cms/CmsFeaturedSwitch";
import { CmsSeoSection } from "@/components/admin/cms/CmsSeoSection";
import { ImageUploadField } from "@/components/admin/cms/ImageUploadField";
import { RichContentEditor } from "@/components/admin/cms/RichContentEditor";
import { ArticlePreview } from "@/components/admin/cms/previews/ArticlePreview";
import { Input, Select } from "@/components/ui/Input";
import {
  createArticleAction,
  updateArticleAction,
} from "@/lib/admin/actions/articles.actions";
import {
  parseContentBlocks,
  type ContentBlock,
} from "@/lib/admin/cms/content-blocks";
import type { AdminActionState } from "@/lib/admin/types";
import { blogCategories } from "@/lib/data/blog";
import type { BlogArticle } from "@/lib/data/types";
import { blogCategoryLabels } from "@/lib/data/types";
import { routes } from "@/lib/routes";
import { useActionState, useMemo, useState } from "react";

const initialState: AdminActionState = {};

interface ArticleCmsFormProps {
  article?: BlogArticle;
}

export function ArticleCmsForm({ article }: ArticleCmsFormProps) {
  const action = article ? updateArticleAction : createArticleAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const initialBlocks = useMemo(
    () => article?.contentBlocks ?? parseContentBlocks(article?.content ?? []),
    [article],
  );

  const [title, setTitle] = useState(article?.title ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [author, setAuthor] = useState(article?.author ?? "Equipe Saúde & Bem");
  const [readTime, setReadTime] = useState(article?.readTime ?? "5 min");
  const [category, setCategory] = useState<string>(article?.category ?? "longevidade");
  const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImageUrl ?? "");
  const [previewBlocks, setPreviewBlocks] = useState<ContentBlock[]>(initialBlocks);

  const categoryOptions = blogCategories
    .filter((c) => c.id !== "todos")
    .map((c) => ({ value: c.id, label: c.label }));

  const previewUrl =
    article?.status === "published" && article.slug
      ? routes.artigo(article.slug)
      : undefined;

  return (
    <CmsEditorShell
      formAction={formAction}
      state={state}
      pending={pending}
      isEdit={Boolean(article)}
      previewUrl={previewUrl}
      preview={
        <ArticlePreview
          title={title}
          excerpt={excerpt}
          categoryLabel={blogCategoryLabels[category as keyof typeof blogCategoryLabels] ?? category}
          author={author}
          readTime={readTime}
          coverImageUrl={coverImageUrl}
          blocks={previewBlocks}
        />
      }
    >
      {article && <input type="hidden" name="id" value={article.id} />}

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Input label="Título" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Slug" name="slug" defaultValue={article?.slug} hint="Vazio = automático" />
        </div>

        <Input
          label="Resumo"
          name="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
        />

        <ImageUploadField
          label="Capa do conteúdo"
          name="cover_image_url"
          folder="artigos"
          defaultUrl={article?.coverImageUrl}
          onUrlChange={setCoverImageUrl}
        />

        <div
          onFocusCapture={() => {
            const input = document.querySelector<HTMLInputElement>(
              'input[name="content_blocks"]',
            );
            if (input?.value) {
              try {
                setPreviewBlocks(parseContentBlocks(JSON.parse(input.value)));
              } catch {
                /* ignore */
              }
            }
          }}
        >
          <RichContentEditor
            label="Conteúdo visual"
            name="content_blocks"
            initialBlocks={initialBlocks}
            imageFolder="artigos"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            label="Categoria"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categoryOptions}
          />
          <Input label="Autor" name="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          <Input label="Cargo" name="author_role" defaultValue={article?.authorRole ?? "Medicina Preventiva"} />
          <Input label="Tempo de leitura" name="read_time" value={readTime} onChange={(e) => setReadTime(e.target.value)} />
          <Input label="Data publicação" name="published_at" defaultValue={article?.publishedAt ?? ""} placeholder="28 Mai 2026" />
        </div>

        <CmsFeaturedSwitch defaultChecked={article?.featured} />

        <label className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
          <input
            type="checkbox"
            name="is_premium"
            defaultChecked={article?.isPremium}
            className="h-4 w-4 rounded"
          />
          <span className="text-sm text-forest">
            Conteúdo premium (Clube Saúde &amp; Bem)
          </span>
        </label>

        <CmsSeoSection
          ogFolder="artigos"
          values={{
            seoTitle: article?.seoTitle,
            seoDescription: article?.seoDescription,
            seoKeywords: article?.seoKeywords,
            ogImageUrl: article?.ogImageUrl,
          }}
        />
      </div>
    </CmsEditorShell>
  );
}
