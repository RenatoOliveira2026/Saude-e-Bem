# Fase 4.1.1 — Ajuste de tamanho do logo

## Objetivo

Aumentar o tamanho **visual** do lockup oficial (`/logo-saude-bem.png`) sem substituir ou regenerar arquivos de imagem, favicon ou ícones PWA.

## Regras aplicadas

| Contexto | Altura | Observação |
|----------|--------|------------|
| Header (mobile) | 50px → 56px (`sm`) | Faixa 50–60px |
| Header (desktop `md+`) | 64px (`h-16`) | Proporção 4:1, `max-w` proporcional |
| Login / auth | 160px | Centralizado acima do formulário |
| Footer | Sem alteração | Mantido da 4.1 |

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/components/brand/logo-config.ts` | `logoDisplayHeights`, `logoContextClasses` |
| `src/components/brand/Logo.tsx` | `sizes`, `object-center` em auth, fallback maior |
| `src/components/auth/AuthLayout.tsx` | Wrapper centralizado para o logo |
| `src/components/layout/Header.tsx` | `min-h` do bar para acomodar 64px (menu inalterado) |
| `src/components/club/ClubShell.tsx` | Removido `max-w-[140px]` que reduzia o logo |

## Não alterado (conforme escopo)

- `public/favicon.ico`
- `public/manifest.json`
- `public/icons/*`
- `public/logo-saude-bem.png`
- Scripts `generate-brand-icons`

## Validação

### Build

```bash
npm run build
```

- [x] Build sem erros TypeScript

### Home

- [ ] Header: logo ~64px em viewport `md+`
- [ ] Mobile: logo entre 50px e 60px
- [ ] Menu e navegação sem mudança de layout

### Login (`/entrar`, `/cadastro`)

- [ ] Logo ~160px de altura
- [ ] Centralizado acima do card do formulário
- [ ] Proporção do PNG preservada (`object-contain`)

## Comandos úteis

```bash
npm run dev
# Home: http://localhost:3001
# Login: http://localhost:3001/entrar
```

## Checkpoint v4.1.1 (opcional)

```bash
git add .
git commit -m "fix: ajustar tamanho visual do logo (Fase 4.1.1)"
git push
git tag -a v4.1.1 -m "Fase 4.1.1 - Logo size"
git push origin v4.1.1
```

## Referência de classes (header)

```text
h-[50px]  → mobile (50px)
sm:h-14   → 56px
md:h-16   → 64px desktop
```

## Referência de classes (auth)

```text
h-[160px] mx-auto object-contain object-center
```
