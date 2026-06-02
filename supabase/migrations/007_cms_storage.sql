-- =============================================================================
-- Saúde & Bem — Fase 2.8: Storage CMS + campos de mídia
-- Execute após 006_admin_roles.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Campos de mídia nas tabelas de conteúdo
-- -----------------------------------------------------------------------------
alter table public.articles
  add column if not exists cover_image_url text;

alter table public.protocols
  add column if not exists cover_image_url text;

alter table public.ebooks
  add column if not exists cover_image_url text;

alter table public.ebooks
  add column if not exists pdf_url text;

comment on column public.articles.cover_image_url is 'URL pública da capa (Supabase Storage cms-images)';
comment on column public.ebooks.pdf_url is 'URL pública do PDF (Supabase Storage cms-pdfs)';

-- -----------------------------------------------------------------------------
-- 2. Buckets Storage
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'cms-images',
    'cms-images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  ),
  (
    'cms-pdfs',
    'cms-pdfs',
    true,
    52428800,
    array['application/pdf']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- -----------------------------------------------------------------------------
-- 3. Políticas Storage — leitura pública, escrita apenas admins
-- -----------------------------------------------------------------------------
drop policy if exists "Public read cms images" on storage.objects;
create policy "Public read cms images"
  on storage.objects for select
  to public
  using (bucket_id = 'cms-images');

drop policy if exists "Admins upload cms images" on storage.objects;
create policy "Admins upload cms images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cms-images' and public.is_admin());

drop policy if exists "Admins update cms images" on storage.objects;
create policy "Admins update cms images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'cms-images' and public.is_admin());

drop policy if exists "Admins delete cms images" on storage.objects;
create policy "Admins delete cms images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cms-images' and public.is_admin());

drop policy if exists "Public read cms pdfs" on storage.objects;
create policy "Public read cms pdfs"
  on storage.objects for select
  to public
  using (bucket_id = 'cms-pdfs');

drop policy if exists "Admins upload cms pdfs" on storage.objects;
create policy "Admins upload cms pdfs"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cms-pdfs' and public.is_admin());

drop policy if exists "Admins update cms pdfs" on storage.objects;
create policy "Admins update cms pdfs"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'cms-pdfs' and public.is_admin());

drop policy if exists "Admins delete cms pdfs" on storage.objects;
create policy "Admins delete cms pdfs"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cms-pdfs' and public.is_admin());
