/**
 * Gera migration SQL + JSON para 20 artigos SEO — Fase 7.1A
 * Uso: npm run generate:seo-articles
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { enrichArticle } from "./seo-articles-71a-builder.mjs";
import { SEO_ARTICLE_DEFINITIONS } from "./seo-articles-71a-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const ARTICLES = SEO_ARTICLE_DEFINITIONS.map((def, index) =>
  enrichArticle(def, index),
);

const ARTICLE_ID_PREFIX = "a7100001-0001-4001-8001";

function articleId(index) {
  return `${ARTICLE_ID_PREFIX}-${String(index + 1).padStart(12, "0")}`;
}

function sqlStr(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}

function sqlJson(obj) {
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function sqlNullableStr(s) {
  return s == null || s === "" ? "null" : sqlStr(s);
}

function buildMigrationLines() {
  const lines = [
    "-- =============================================================================",
    "-- Saúde & Bem — 20 artigos SEO iniciais (Fase 7.1A)",
    "-- Gerado por scripts/generate-seo-articles-seed.mjs",
    "-- =============================================================================",
    "",
    "delete from public.favorites where content_id in (",
    "  select id from public.articles where id::text like 'a7100001-%'",
    ");",
    "delete from public.articles where id::text like 'a7100001-%';",
    "",
    `-- Articles (${ARTICLES.length})`,
  ];

  for (let i = 0; i < ARTICLES.length; i++) {
    const a = ARTICLES[i];
    lines.push(
      `insert into public.articles (id, slug, title, excerpt, content, category, category_label, author, author_role, read_time, published_at, featured, is_premium, cover_image_url, seo_title, seo_description, seo_keywords, og_image_url, status) values (` +
        `${sqlStr(articleId(i))}, ${sqlStr(a.slug)}, ${sqlStr(a.title)}, ${sqlStr(a.excerpt)}, ${sqlJson(a.content)}, ` +
        `${sqlStr(a.category)}, ${sqlStr(a.category_label)}, ${sqlStr(a.author)}, ${sqlStr(a.author_role)}, ` +
        `${sqlStr(a.read_time)}, ${sqlStr(a.published_at)}, ${a.featured}, ${a.is_premium}, ` +
        `${sqlNullableStr(a.cover_image_url)}, ${sqlNullableStr(a.seo_title)}, ${sqlNullableStr(a.seo_description)}, ` +
        `${sqlNullableStr(a.seo_keywords)}, ${sqlNullableStr(a.og_image_url)}, 'published');`,
    );
  }

  lines.push(
    "",
    "select 'seo_articles_71a' as seed, count(*) as inserted from public.articles where id::text like 'a7100001-%';",
  );

  return lines;
}

const migrationPath = join(root, "supabase", "migrations", "037_seed_seo_articles_71a.sql");
const jsonPath = join(
  root,
  "src",
  "lib",
  "content-engine",
  "seed",
  "seo-articles-71a.generated.json",
);

writeFileSync(migrationPath, buildMigrationLines().join("\n") + "\n", "utf8");
writeFileSync(jsonPath, JSON.stringify(ARTICLES, null, 2) + "\n", "utf8");

console.log(`Migration: ${migrationPath}`);
console.log(`JSON mock: ${jsonPath}`);
console.log(`Artigos: ${ARTICLES.length}`);
