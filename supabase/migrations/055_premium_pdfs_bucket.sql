-- 055 — T-06: PDFs premium em bucket privado (SECURITY_STATUS S-07)
--
-- Antes: o único bucket de PDFs (`cms-pdfs`) é público. Um PDF de e-book
-- premium enviado ali podia ser baixado por qualquer pessoa com o link.
-- Em 03/11/2026 não havia nenhum e-book premium (inventário somente leitura),
-- então nada estava exposto; esta migração prepara o caminho seguro.
--
-- Agora:
--   1. Bucket PRIVADO `cms-pdfs-premium` (até 50 MB, só PDF). O app guarda
--      em `ebooks.pdf_url` a referência `premium-pdf:<caminho>` e gera, no
--      servidor, um link assinado de 10 minutos.
--   2. Leitura no bucket privado só para assinante ativo ou admin (a URL
--      assinada é criada com a sessão do usuário, então a política decide).
--      Escrita só para admin.
--   3. `cms-images` deixa de aceitar SVG (SVG pode conter script). Arquivos
--      já enviados não mudam.
--
-- `cms-pdfs` continua público para os PDFs gratuitos.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cms-pdfs-premium', 'cms-pdfs-premium', false, 52428800, array['application/pdf'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Premium read cms premium pdfs" on storage.objects;
create policy "Premium read cms premium pdfs"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'cms-pdfs-premium'
    and (public.is_admin() or public.user_has_active_premium(auth.uid()))
  );

drop policy if exists "Admins upload cms premium pdfs" on storage.objects;
create policy "Admins upload cms premium pdfs"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cms-pdfs-premium' and public.is_admin());

drop policy if exists "Admins update cms premium pdfs" on storage.objects;
create policy "Admins update cms premium pdfs"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'cms-pdfs-premium' and public.is_admin())
  with check (bucket_id = 'cms-pdfs-premium' and public.is_admin());

drop policy if exists "Admins delete cms premium pdfs" on storage.objects;
create policy "Admins delete cms premium pdfs"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cms-pdfs-premium' and public.is_admin());

update storage.buckets
   set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
 where id = 'cms-images';

comment on column public.ebooks.pdf_url is
  'URL pública do PDF (bucket cms-pdfs ou /materiais) ou, em e-book premium, referência premium-pdf:<caminho> no bucket privado cms-pdfs-premium (T-06).';
