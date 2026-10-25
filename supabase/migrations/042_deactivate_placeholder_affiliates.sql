-- 042 — Desativar afiliados de exemplo
-- O seed 035 criou ofertas com links example.com. Elas não levam a loja nenhuma
-- e não geram comissão, então ficam inativas até receberem links reais pelo
-- painel (/admin/afiliados). O código também ignora links de exemplo.

update public.affiliate_links
set active = false
where coalesce(affiliate_url, '') ~* '^https?://([a-z0-9-]+\.)*example\.(com|org|net)(/|$)'
   or coalesce(url, '') ~* '^https?://([a-z0-9-]+\.)*example\.(com|org|net)(/|$)';
