-- Novo preço do Premium Anual: R$ 149,00 (antes R$ 197,00).
-- O valor cobrado no checkout vem de src/lib/payments/pricing.ts;
-- aqui só alinhamos o catálogo exibido a partir do banco.

update public.membership_plans
set price = 149.00
where slug = 'premium-anual';
