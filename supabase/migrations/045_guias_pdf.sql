-- 045 — Guias em PDF da biblioteca
-- Os 5 guias passam a ter arquivo real (public/materiais), com número de páginas
-- e descrições que correspondem ao conteúdo. Zera os contadores de download
-- de exemplo, que não refletiam downloads reais.

with guias(slug, pages, description, long_description, highlights, pdf_url) as (
  values
  ('guia-detox-inteligente', 12, 'Sem milagres: o que a ciência diz sobre detox e como apoiar fígado e rins com hábitos reais.', 'Guia de 12 páginas com o que funciona e o que é mito, plano de 10 dias com uma troca por dia e receitas simples e baratas.', '["O que a ciência diz", "Plano de 10 dias", "Receitas práticas"]'::jsonb, '/materiais/guia-detox-inteligente.pdf'),
  ('guia-energia-natural', 14, 'Mais disposição no dia a dia com sono, luz, alimentação, água e movimento.', 'Guia de 14 páginas com rotina matinal, alimentos-chave, exercícios simples e plano de 14 dias, além dos sinais de cansaço que pedem consulta.', '["Rotina matinal", "Alimentos-chave", "Plano de 14 dias"]'::jsonb, '/materiais/guia-energia-natural.pdf'),
  ('guia-habitos-saudaveis', 11, 'Como criar hábitos que duram: começar pequeno, encaixar na rotina e manter a constância.', 'Guia de 11 páginas com os 4 princípios para formar hábitos, exemplos práticos e um painel semanal para imprimir.', '["Começar pequeno", "Encaixar na rotina", "Painel semanal"]'::jsonb, '/materiais/guia-habitos-saudaveis.pdf'),
  ('guia-saude-intestinal', 11, 'Fibras, água, movimento e hábitos para um intestino que funciona bem.', 'Guia de 11 páginas com alimentos ricos em fibras, um dia de cardápio exemplo, plano gradual de 21 dias e diário do intestino.', '["Fibras na prática", "Plano de 21 dias", "Diário do intestino"]'::jsonb, '/materiais/guia-saude-intestinal.pdf'),
  ('guia-sono-saudavel', 12, 'Hábitos simples para dormir melhor, quarto ideal e rotina noturna passo a passo.', 'Guia de 12 páginas com checklist do quarto, rotina noturna, plano de 7 dias, diário do sono e quando procurar o médico.', '["Checklist do quarto", "Rotina noturna", "Plano de 7 dias"]'::jsonb, '/materiais/guia-sono-saudavel.pdf')
)
update public.ebooks e
set
  pages = g.pages,
  description = g.description,
  long_description = g.long_description,
  highlights = g.highlights,
  pdf_url = g.pdf_url,
  downloads = 0,
  updated_at = now()
from guias g
where e.slug = g.slug;
