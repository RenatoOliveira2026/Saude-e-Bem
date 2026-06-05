-- =============================================================================
-- Saúde & Bem — Fase 4.7: profiles.plan (free | premium_monthly | premium_annual | admin)
-- Execute após 021_user_tool_results_rpc.sql
-- =============================================================================

alter table public.profiles
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'premium_monthly', 'premium_annual', 'admin'));

comment on column public.profiles.plan is
  'Plano do usuário: free, premium_monthly, premium_annual ou admin';

-- Backfill a partir de membership_tier legado
update public.profiles
set plan = 'premium_monthly'
where membership_tier = 'premium'
  and plan = 'free';

-- Administradores recebem plan admin
update public.profiles p
set plan = 'admin'
where exists (
  select 1 from public.admin_users au where au.user_id = p.id
);

-- Sincroniza plan ao alterar assinatura (preserva admin)
create or replace function public.sync_profile_membership_tier()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_active boolean;
  new_tier text;
  new_plan text;
  current_plan text;
begin
  is_active := NEW.status in ('active', 'trialing')
    and NEW.plan = 'premium'
    and (NEW.current_period_end is null or NEW.current_period_end > timezone('utc', now()));

  new_tier := case when is_active then 'premium' else 'free' end;

  new_plan := case
    when is_active and NEW.billing_plan_id = 'premium_annual' then 'premium_annual'
    when is_active and NEW.billing_plan_id = 'premium_monthly' then 'premium_monthly'
    when is_active then 'premium_monthly'
    else 'free'
  end;

  select p.plan into current_plan from public.profiles p where p.id = NEW.user_id;

  update public.profiles
  set
    membership_tier = new_tier,
    plan = case when current_plan = 'admin' then 'admin' else new_plan end,
    club_joined_at = coalesce(club_joined_at, timezone('utc', now()))
  where id = NEW.user_id;

  return NEW;
end;
$$;

-- Premium ativo via plan ou assinatura
create or replace function public.user_has_active_premium(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select p.plan in ('premium_monthly', 'premium_annual', 'admin')
      from public.profiles p
      where p.id = coalesce(p_user_id, auth.uid())
    ),
    (
      select true
      from public.subscriptions s
      where s.user_id = coalesce(p_user_id, auth.uid())
        and s.plan = 'premium'
        and s.status in ('active', 'trialing')
        and (
          s.current_period_end is null
          or s.current_period_end > timezone('utc', now())
        )
      limit 1
    ),
    false
  );
$$;
