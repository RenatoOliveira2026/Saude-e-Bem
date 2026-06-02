import type { IconName } from "@/components/icons";
import {
  blocksToPlainParagraphs,
  parseContentBlocks,
} from "@/lib/admin/cms/content-blocks";
import type {
  BlogArticle,
  BlogCategory,
  ContentCategory,
  ContentLevel,
  LibraryResource,
  Protocol,
  ProtocolStep,
} from "@/lib/data/types";
import type {
  ArticleRow,
  EbookRow,
  ProtocolRow,
} from "@/lib/supabase/types";

function parseStringArray(value: unknown): string[] {
  const blocks = parseContentBlocks(value);
  const fromBlocks = blocksToPlainParagraphs(blocks);
  if (fromBlocks.length > 0 && fromBlocks[0] !== "") return fromBlocks;

  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function mapSeoFields(row: {
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  og_image_url?: string | null;
}) {
  return {
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    seoKeywords: row.seo_keywords ?? undefined,
    ogImageUrl: row.og_image_url ?? undefined,
  };
}

function parseProtocolSteps(value: unknown): ProtocolStep[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is ProtocolStep =>
        typeof item === "object" &&
        item !== null &&
        "title" in item &&
        "description" in item &&
        typeof (item as ProtocolStep).title === "string" &&
        typeof (item as ProtocolStep).description === "string",
    )
    .map((item) => ({
      title: item.title,
      description: item.description,
    }));
}

export function mapArticleRow(row: ArticleRow): BlogArticle {
  const contentBlocks = parseContentBlocks(row.content);
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    title: row.title,
    excerpt: row.excerpt,
    contentBlocks,
    content: blocksToPlainParagraphs(contentBlocks),
    category: row.category as BlogCategory,
    categoryLabel: row.category_label,
    author: row.author,
    authorRole: row.author_role,
    readTime: row.read_time,
    publishedAt: row.published_at,
    featured: row.featured,
    coverImageUrl: row.cover_image_url ?? undefined,
    ...mapSeoFields(row),
  };
}

export function mapProtocolRow(row: ProtocolRow): Protocol {
  const contentBlocks = parseContentBlocks(row.content ?? row.long_description);
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    title: row.title,
    description: row.description,
    objective: row.objective,
    longDescription: row.long_description,
    category: row.category as ContentCategory,
    categoryLabel: row.category_label,
    duration: row.duration,
    level: row.level as ContentLevel,
    benefits: parseStringArray(row.benefits),
    steps: parseProtocolSteps(row.steps),
    isPremium: row.is_premium,
    featured: row.featured,
    tag: row.tag ?? undefined,
    participants: row.participants,
    coverImageUrl: row.cover_image_url ?? undefined,
    contentBlocks,
    ...mapSeoFields(row),
  };
}

export function mapEbookRow(row: EbookRow): LibraryResource {
  const contentBlocks = parseContentBlocks(row.content ?? row.long_description);
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    title: row.title,
    description: row.description,
    longDescription: row.long_description,
    category: row.category,
    categoryLabel: row.category_label,
    icon: row.icon as IconName,
    format: row.format,
    pages: row.pages,
    highlights: parseStringArray(row.highlights),
    isPremium: row.is_premium,
    downloads: row.downloads,
    featured: row.featured,
    coverImageUrl: row.cover_image_url ?? undefined,
    pdfUrl: row.pdf_url ?? undefined,
    contentBlocks,
    ...mapSeoFields(row),
  };
}
