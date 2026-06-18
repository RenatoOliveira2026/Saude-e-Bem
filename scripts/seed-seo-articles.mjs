/**
 * Insere/atualiza 20 artigos SEO no Supabase via service role — Fase 7.1A
 * Uso: npm run seed:seo-articles
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { enrichArticle } from "./seo-articles-71a-builder.mjs";
import { SEO_ARTICLE_DEFINITIONS } from "./seo-articles-71a-data.mjs";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const ARTICLE_ID_PREFIX = "a7100001-0001-4001-8001";

function articleId(index) {
  return `${ARTICLE_ID_PREFIX}-${String(index + 1).padStart(12, "0")}`;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error("❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const articles = SEO_ARTICLE_DEFINITIONS.map((def, index) => {
  const enriched = enrichArticle(def, index);
  return {
    id: articleId(index),
    slug: enriched.slug,
    title: enriched.title,
    excerpt: enriched.excerpt,
    content: enriched.content,
    category: enriched.category,
    category_label: enriched.category_label,
    author: enriched.author,
    author_role: enriched.author_role,
    read_time: enriched.read_time,
    published_at: enriched.published_at,
    featured: enriched.featured,
    is_premium: enriched.is_premium,
    cover_image_url: enriched.cover_image_url,
    seo_title: enriched.seo_title,
    seo_description: enriched.seo_description,
    seo_keywords: enriched.seo_keywords,
    og_image_url: enriched.og_image_url,
    status: "published",
  };
});

const { data, error } = await supabase.from("articles").upsert(articles, {
  onConflict: "slug",
});

if (error) {
  console.error("❌ Falha ao inserir artigos:", error.message);
  process.exit(1);
}

console.log(`✅ ${articles.length} artigos SEO sincronizados no Supabase.`);
console.log(data ? `Retorno: ${JSON.stringify(data)}` : "");
