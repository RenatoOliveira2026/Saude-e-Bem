-- Fase 5.0 — Content Engine: biblioteca inteligente + marketplace

-- ---------------------------------------------------------------------------
-- library_items (biblioteca gratuita / premium)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.library_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  category_label text NOT NULL,
  item_type text NOT NULL CHECK (
    item_type IN ('ebook', 'protocolo', 'video', 'pdf', 'affiliate')
  ),
  tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  is_premium boolean NOT NULL DEFAULT false,
  image_url text,
  estimated_read_time text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  assets jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS library_items_status_idx ON public.library_items (status);
CREATE INDEX IF NOT EXISTS library_items_tier_idx ON public.library_items (tier);
CREATE INDEX IF NOT EXISTS library_items_item_type_idx ON public.library_items (item_type);

ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "library_items_public_read"
  ON public.library_items FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "library_items_admin_all"
  ON public.library_items FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- marketplace_products
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  category_label text NOT NULL,
  product_type text NOT NULL,
  fulfillment text NOT NULL CHECK (
    fulfillment IN ('digital', 'affiliate', 'own', 'subscription')
  ),
  is_premium boolean NOT NULL DEFAULT false,
  image_url text,
  current_price numeric(10, 2),
  old_price numeric(10, 2),
  installments text,
  featured boolean NOT NULL DEFAULT false,
  editor_choice boolean NOT NULL DEFAULT false,
  library_slug text,
  affiliate_slug text,
  health_tags text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS marketplace_products_status_idx ON public.marketplace_products (status);
CREATE INDEX IF NOT EXISTS marketplace_products_fulfillment_idx ON public.marketplace_products (fulfillment);

ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "marketplace_products_public_read"
  ON public.marketplace_products FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "marketplace_products_admin_all"
  ON public.marketplace_products FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- updated_at triggers (reuse pattern from 008 if exists)
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS library_items_updated_at ON public.library_items;
CREATE TRIGGER library_items_updated_at
  BEFORE UPDATE ON public.library_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS marketplace_products_updated_at ON public.marketplace_products;
CREATE TRIGGER marketplace_products_updated_at
  BEFORE UPDATE ON public.marketplace_products
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
