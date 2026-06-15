-- Fase 6.1 — Atualizar preços oficiais do Clube (R$ 19,90 / R$ 197,00)

update public.membership_plans
set
  price = 19.90,
  description = 'Acesso completo a protocolos, biblioteca e ferramentas premium.',
  features = '["Todos os protocolos premium","Biblioteca ampliada","Ferramentas avançadas","Área de membros do Clube","Suporte prioritário"]'::jsonb
where slug = 'premium-mensal';

update public.membership_plans
set
  price = 197.00,
  description = 'Melhor custo-benefício — 12 meses de acesso premium ao Clube.',
  features = '["Tudo do Premium Mensal","Lives exclusivas gravadas","Acesso antecipado a novidades","Economia vs. plano mensal"]'::jsonb
where slug = 'premium-anual';
