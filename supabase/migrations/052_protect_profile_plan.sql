-- 052 — T-02: o usuário não pode alterar o próprio plano (SECURITY_STATUS S-02)
--
-- Antes: a política "Users can update own profile" e o GRANT UPDATE para
-- `authenticated` permitiam ao próprio usuário gravar plan = 'premium_annual'
-- (ou membership_tier = 'premium') pela API REST e liberar o Clube sem pagar.
--
-- Agora um trigger recusa mudanças nessas colunas quando o UPDATE vem direto
-- dos papéis da API (`authenticated`/`anon`), exceto para administradores.
-- Continuam funcionando:
--   * webhook, crons e serviços com service role (papel `service_role`);
--   * funções SECURITY DEFINER (sync_profile_membership_tier, touch_club_joined),
--     que executam como o dono das funções;
--   * edição de nome, objetivo e dados de cobrança pelo próprio usuário.
--
-- O trigger é SECURITY INVOKER de propósito: `current_user` precisa refletir
-- quem executou o UPDATE.

create or replace function public.protect_profile_privileged_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if (
       new.plan is distinct from old.plan
    or new.membership_tier is distinct from old.membership_tier
    or new.club_joined_at is distinct from old.club_joined_at
    or new.id is distinct from old.id
  )
  and current_user in ('authenticated', 'anon')
  and not coalesce(public.is_admin(), false)
  then
    raise exception 'Alteração não permitida nos campos de plano do perfil.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

comment on function public.protect_profile_privileged_columns() is
  'T-02: impede que o usuário altere plan/membership_tier/club_joined_at do próprio perfil.';

drop trigger if exists profiles_protect_privileged_columns on public.profiles;
create trigger profiles_protect_privileged_columns
  before update on public.profiles
  for each row
  execute function public.protect_profile_privileged_columns();

-- Alinha as políticas de `profiles` com a migração 001 (no banco estavam
-- aplicadas ao papel `public`).
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);
