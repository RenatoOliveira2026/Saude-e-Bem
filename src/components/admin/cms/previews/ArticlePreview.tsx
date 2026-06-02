"use client";

import { ContentBlockRenderer } from "@/components/admin/cms/ContentBlockRenderer";
import type { ContentBlock } from "@/lib/admin/cms/content-blocks";
import Image from "next/image";

interface ArticlePreviewProps {
  title: string;
  excerpt: string;
  categoryLabel: string;
  author: string;
  readTime: string;
  coverImageUrl?: string;
  blocks: ContentBlock[];
}

export function ArticlePreview({
  title,
  excerpt,
  categoryLabel,
  author,
  readTime,
  coverImageUrl,
  blocks,
}: ArticlePreviewProps) {
  return (
    <article>
      <span className="inline-block rounded-full bg-sage/15 px-3 py-1 text-xs font-medium text-forest">
        {categoryLabel || "Categoria"}
      </span>
      {coverImageUrl && (
        <div className="relative mt-4 aspect-[21/9] overflow-hidden rounded-xl">
          <Image src={coverImageUrl} alt="" fill className="object-cover" unoptimized />
        </div>
      )}
      <h1 className="mt-4 font-heading text-2xl font-semibold text-forest text-pretty">
        {title || "Título do artigo"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {author || "Autor"} · {readTime || "5 min"}
      </p>
      <p className="mt-4 text-base text-graphite">{excerpt || "Resumo do artigo…"}</p>
      <div className="mt-8">
        <ContentBlockRenderer blocks={blocks} />
      </div>
    </article>
  );
}
