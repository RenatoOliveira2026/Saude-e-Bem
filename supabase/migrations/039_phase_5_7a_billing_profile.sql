-- Fase 5.7A — Dados de faturamento no perfil do usuário

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists cpf text,
  add column if not exists celular text,
  add column if not exists cep text,
  add column if not exists endereco text,
  add column if not exists numero text,
  add column if not exists complemento text,
  add column if not exists bairro text,
  add column if not exists cidade text,
  add column if not exists estado char(2),
  add column if not exists billing_completed_at timestamptz;

comment on column public.profiles.full_name is 'Nome completo para faturamento e Mercado Pago';
comment on column public.profiles.cpf is 'CPF (apenas dígitos)';
comment on column public.profiles.celular is 'Celular com DDD (apenas dígitos)';
comment on column public.profiles.cep is 'CEP (8 dígitos)';
comment on column public.profiles.billing_completed_at is 'Preenchido quando cadastro de faturamento estiver completo';

create index if not exists profiles_cpf_idx on public.profiles (cpf)
  where cpf is not null;
