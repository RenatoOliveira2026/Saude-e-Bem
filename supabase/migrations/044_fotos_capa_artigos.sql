-- 044 — Fotos de capa dos artigos (Unsplash, licença de uso livre)
-- Substitui as 5 ilustrações de categoria repetidas por uma foto por artigo,
-- escolhida para o público 50+. Atualiza capa, imagem de compartilhamento e o
-- primeiro bloco de imagem do conteúdo.

with fotos(slug, url) as (
  values
  ('agua-energia-cognicao', 'https://images.unsplash.com/photo-1573363580403-c85455a5ab8f?auto=format&fit=crop&w=1600&q=80'),
  ('alimentacao-saudavel-iniciantes', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80'),
  ('alongamento-diario', 'https://images.unsplash.com/photo-1702648158754-484755fadf79?auto=format&fit=crop&w=1600&q=80'),
  ('beneficios-caminhada-diaria', 'https://images.unsplash.com/photo-1790699297352-a4a28cc05f9f?auto=format&fit=crop&w=1600&q=80'),
  ('biomarcadores-envelhecimento', 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1600&q=80'),
  ('colesterol-hdl-triglicerides', 'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?auto=format&fit=crop&w=1600&q=80'),
  ('como-aumentar-energia-naturalmente', 'https://images.unsplash.com/photo-1731338493464-db479f155a3a?auto=format&fit=crop&w=1600&q=80'),
  ('como-criar-habitos-saudaveis', 'https://images.unsplash.com/photo-1554331292-735256644d5f?auto=format&fit=crop&w=1600&q=80'),
  ('como-criar-rotina-sustentavel', 'https://images.unsplash.com/photo-1632772998001-cc9bf6f7c852?auto=format&fit=crop&w=1600&q=80'),
  ('como-melhorar-imunidade', 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=1600&q=80'),
  ('como-melhorar-produtividade', 'https://images.unsplash.com/photo-1758612898691-afe3e1d08a0a?auto=format&fit=crop&w=1600&q=80'),
  ('como-melhorar-qualidade-do-sono', 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1600&q=80'),
  ('como-reduzir-estresse-naturalmente', 'https://images.unsplash.com/photo-1515413741792-b5900ade941f?auto=format&fit=crop&w=1600&q=80'),
  ('controle-ansiedade', 'https://images.unsplash.com/photo-1621850204256-a84f9acbc5e9?auto=format&fit=crop&w=1600&q=80'),
  ('dormir-melhor-sem-medicamentos', 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1600&q=80'),
  ('emagrecimento-sustentavel', 'https://images.unsplash.com/photo-1575467678930-c7acd65d6470?auto=format&fit=crop&w=1600&q=80'),
  ('exercicios-para-iniciantes', 'https://images.unsplash.com/photo-1764173040044-9835cc696a39?auto=format&fit=crop&w=1600&q=80'),
  ('habitos-matinais-saudaveis', 'https://images.unsplash.com/photo-1758874959821-5484186a8d21?auto=format&fit=crop&w=1600&q=80'),
  ('hidratacao-inteligente', 'https://images.unsplash.com/photo-1517093911940-08cb5b3952e7?auto=format&fit=crop&w=1600&q=80'),
  ('hidratacao-meta-diaria', 'https://images.unsplash.com/photo-1781510350868-b81dfa490295?auto=format&fit=crop&w=1600&q=80'),
  ('higiene-sono-guia', 'https://images.unsplash.com/photo-1552858725-a19e7fcd3ac4?auto=format&fit=crop&w=1600&q=80'),
  ('longevidade-qualidade-vida', 'https://images.unsplash.com/photo-1514415008039-efa173293080?auto=format&fit=crop&w=1600&q=80'),
  ('magnesio-qualidade-sono', 'https://images.unsplash.com/photo-1600189020840-e9918c25269d?auto=format&fit=crop&w=1600&q=80'),
  ('pilares-longevidade-2026', 'https://images.unsplash.com/photo-1559234938-b60fff04894d?auto=format&fit=crop&w=1600&q=80'),
  ('plateau-emagrecimento', 'https://images.unsplash.com/photo-1531171673193-06ab3c43e4a5?auto=format&fit=crop&w=1600&q=80'),
  ('pressao-arterial-prevencao', 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=1600&q=80'),
  ('saude-intestinal-bem-estar', 'https://images.unsplash.com/photo-1530259152377-3a014e1092e0?auto=format&fit=crop&w=1600&q=80'),
  ('saude-mental-rotina', 'https://images.unsplash.com/photo-1764173039543-f9f197744e1b?auto=format&fit=crop&w=1600&q=80'),
  ('sono-imunidade-metabolismo', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=1600&q=80'),
  ('tecnicas-respiracao', 'https://images.unsplash.com/photo-1765970333960-9cc0e5d6541b?auto=format&fit=crop&w=1600&q=80')
)
update public.articles a
set
  cover_image_url = f.url,
  og_image_url = f.url,
  content = case
    when jsonb_typeof(a.content) = 'array' and a.content->0->>'type' = 'image'
      then jsonb_set(
        jsonb_set(a.content, '{0,url}', to_jsonb(f.url)),
        '{0,alt}', to_jsonb('Foto ilustrativa: ' || a.title || ' (Unsplash)')
      )
    else a.content
  end,
  updated_at = now()
from fotos f
where a.slug = f.slug;
