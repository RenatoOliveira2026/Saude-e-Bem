-- 054 — T-05 (parte 2 de 2): corpo premium só para assinante ou admin (S-04)
--
-- Aplicar DEPOIS do deploy do código da T-05 (que lê as listagens das views
-- criadas na 053). Antes desta migração, as políticas "Public can read
-- published ..." liberavam a `anon` e a qualquer usuário logado todas as
-- colunas das linhas publicadas, inclusive as premium: pela API REST (chave
-- anon, pública no site) dava para ler o protocolo inteiro.
--
-- Agora as tabelas só devolvem linhas premium para quem tem premium ativo ou é
-- admin (as mesmas funções que o app usa: user_has_active_premium, is_admin).
-- Linhas gratuitas continuam públicas. A política de admin não muda.

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
  on public.articles for select
  to anon, authenticated
  using (
    status = 'published'
    and (
      not coalesce(is_premium, false)
      or public.user_has_active_premium(auth.uid())
      or public.is_admin()
    )
  );

drop policy if exists "Public can read published protocols" on public.protocols;
create policy "Public can read published protocols"
  on public.protocols for select
  to anon, authenticated
  using (
    status = 'published'
    and (
      not coalesce(is_premium, false)
      or public.user_has_active_premium(auth.uid())
      or public.is_admin()
    )
  );

drop policy if exists "Public can read published ebooks" on public.ebooks;
create policy "Public can read published ebooks"
  on public.ebooks for select
  to anon, authenticated
  using (
    status = 'published'
    and (
      not coalesce(is_premium, false)
      or public.user_has_active_premium(auth.uid())
      or public.is_admin()
    )
  );
