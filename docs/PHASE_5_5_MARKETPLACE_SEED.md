# Fase 5.5 — Popular Marketplace (Seed)

**Status:** concluída — seed aplicado no Supabase e validado localmente.

## Objetivo

Cadastrar 10 produtos iniciais no marketplace (`affiliate_links`) com 5 categorias e 3 destaques.

## Artefatos

| Arquivo | Descrição |
|---------|-----------|
| `supabase/migrations/035_phase_5_5_marketplace_seed.sql` | Seed idempotente (DELETE por prefixo `f0550005-*` + INSERT) |
| `scripts/verify-marketplace-seed.mjs` | Aplica (`--apply`) e valida contagem/categorias/destaques |
| `scripts/smoke-marketplace-seed.mjs` | Smoke HTTP em `/recomendados`, detalhe, admin e API go |

## Mapeamento de categorias

| Pedido | Coluna `category` |
|--------|-------------------|
| Livros | `livros` |
| Sono | `sono` |
| Exercícios | `exercicios` |
| Saúde | `equipamentos-saude` |
| Bem-estar | `bem-estar` |

**Nota:** coluna de status é `active` (não `is_active`).

## Produtos inseridos (10)

| # | Slug | Título | Categoria | Featured |
|---|------|--------|-----------|----------|
| 1 | `habitos-atomicos` | Hábitos Atômicos | livros | sim |
| 2 | `o-poder-do-habito` | O Poder do Hábito | livros | — |
| 3 | `magnesio-glicinato-sono` | Magnésio Glicinato para Sono | sono | sim |
| 4 | `travesseiro-ergonomico-cervical` | Travesseiro Ergonômico Cervical | sono | — |
| 5 | `kit-faixas-resistencia-pro` | Kit Faixas de Resistência Pro | exercicios | — |
| 6 | `tapete-yoga-antiderrapante` | Tapete de Yoga Antiderrapante | exercicios | — |
| 7 | `oximetro-pulso-digital` | Oxímetro de Pulso Digital | equipamentos-saude | — |
| 8 | `balanca-inteligente-bioimpedancia` | Balança Inteligente Bioimpedância | equipamentos-saude | — |
| 9 | `difusor-aromaterapia-ultrassonico` | Difusor Aromaterapia Ultrassônico | bem-estar | sim |
| 10 | `journal-gratidao-90-dias` | Journal de Gratidão 90 Dias | bem-estar | — |

Campos preenchidos por produto: `title`, `slug`, `description`, `short_description`, `category`, `affiliate_url`, `image_url` (`/logo-saude-bem.png`), `featured`, `active`, além de metadados (`benefits`, `seo_*`, preço, parcelas quando aplicável).

## Validação Supabase

```text
Produtos seed: 10
Ativos: 10 | Destaques: 3
Categorias: equipamentos-saude, bem-estar, livros, exercicios, sono
OK seed validado
```

Comando:

```bash
node scripts/verify-marketplace-seed.mjs --apply   # aplica + valida
node scripts/verify-marketplace-seed.mjs           # só valida
```

### Correções aplicadas durante a fase

1. **`installments` NOT NULL** — produtos sem parcelas recebem `''` (SQL e script JS).
2. **Filtro por UUID** — validação usa `.in("id", SEED_IDS)` em vez de `.like("id", …)` (Postgres não aceita `LIKE` em uuid via API).

## Smoke test de rotas

### Local (`http://localhost:3002`)

```text
/recomendados -> 200
/recomendados/habitos-atomicos -> 200
/admin/afiliados -> 307 (redirect login — esperado)
/api/affiliates/habitos-atomicos/go -> 307 (redirect afiliado)
OK smoke marketplace seed
```

Comando:

```bash
SMOKE_BASE_URL=http://localhost:3002 node scripts/smoke-marketplace-seed.mjs
```

### Produção (`https://www.saudeebem.com.br`)

| Rota | Status | Observação |
|------|--------|------------|
| `/recomendados` | 200 | Página responde; produtos seed ainda não visíveis no HTML (deploy/ISR ou env Supabase distinto) |
| `/recomendados/habitos-atomicos` | 500 | Requer redeploy com código Fase 5.4+ e revalidação |
| `/admin/afiliados` | 307 | Redirect login — esperado |
| `/api/affiliates/habitos-atomicos/go` | 404 | Rota/código ou dados ainda não alinhados em produção |

**Próximo passo produção:** garantir que Vercel usa o mesmo projeto Supabase onde o seed foi aplicado, executar migration `034` se pendente, redeploy e revalidar cache (`revalidate = 3600`).

## Aplicar seed manualmente (SQL Editor)

Executar `supabase/migrations/035_phase_5_5_marketplace_seed.sql` após `034_phase_5_4_marketplace.sql`.

Query de conferência incluída no final do arquivo:

```sql
select
  count(*) filter (where active) as ativos,
  count(*) filter (where featured) as destaques
from public.affiliate_links
where id::text like 'f0550005-%';
-- Esperado: ativos = 10, destaques = 3
```

## Resumo executivo

- Seed SQL criado e idempotente.
- 10 ofertas ativas, 2 por categoria, 3 em destaque.
- Banco validado via service role.
- Rotas públicas, detalhe, admin e tracking validados em ambiente local.
- Produção depende de deploy alinhado ao Supabase onde o seed foi aplicado.
