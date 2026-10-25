-- 041 — Autoria editorial
-- Os seeds anteriores (003 e 037) atribuíam artigos a profissionais de saúde
-- fictícios. Em conteúdo de saúde isso induz o leitor a erro, então todos os
-- artigos passam a ser assinados pela equipe editorial do portal.
-- Quando houver um profissional real revisando, atualize os artigos pelo CMS.

update public.articles
set
  author = 'Equipe Saúde & Bem',
  author_role = 'Equipe editorial',
  updated_at = now()
where author in ('Dra. Marina Alves', 'Dr. Rafael Costa');
