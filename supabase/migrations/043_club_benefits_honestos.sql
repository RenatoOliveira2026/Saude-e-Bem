-- 043 — Benefícios do Clube alinhados ao que é entregue no lançamento
-- Remove "Suporte prioritário" e "Lives exclusivas gravadas" (ainda não oferecidos)
-- e inclui "Navegação sem anúncios" (membros não veem os espaços do AdSense).

update public.membership_plans
set
  features = '["Todos os protocolos premium","Biblioteca ampliada","Ferramentas avançadas","Área de membros do Clube","Navegação sem anúncios"]'::jsonb
where slug = 'premium-mensal';

update public.membership_plans
set
  features = '["Tudo do Premium Mensal","Acesso antecipado a novidades","Economia vs. plano mensal"]'::jsonb
where slug = 'premium-anual';
