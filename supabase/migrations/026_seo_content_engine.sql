-- Fase 5.1 — SEO para biblioteca e marketplace

ALTER TABLE public.library_items
  ADD COLUMN IF NOT EXISTS long_description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS seo_keywords text,
  ADD COLUMN IF NOT EXISTS og_image_url text;

ALTER TABLE public.marketplace_products
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS seo_keywords text,
  ADD COLUMN IF NOT EXISTS og_image_url text;
