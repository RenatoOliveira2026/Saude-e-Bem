-- Área de Marketing do painel: contas conectadas (Pixel da Meta e perfis sociais).
-- Leitura pública (o site mostra os perfis no rodapé); só administradores alteram.

create table if not exists public.marketing_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

comment on table public.marketing_settings is 'Contas de marketing do portal (pixel e perfis sociais)';

alter table public.marketing_settings enable row level security;

drop policy if exists "marketing_settings public read" on public.marketing_settings;
create policy "marketing_settings public read"
  on public.marketing_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "marketing_settings admin insert" on public.marketing_settings;
create policy "marketing_settings admin insert"
  on public.marketing_settings
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "marketing_settings admin update" on public.marketing_settings;
create policy "marketing_settings admin update"
  on public.marketing_settings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "marketing_settings admin delete" on public.marketing_settings;
create policy "marketing_settings admin delete"
  on public.marketing_settings
  for delete
  to authenticated
  using (public.is_admin());
