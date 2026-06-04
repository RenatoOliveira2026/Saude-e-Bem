# Fase 4.1 — Branding e Identidade Visual — Checklist

## Objetivo

Aplicar a identidade visual oficial do Saúde & Bem em todo o portal, ícones e PWA.

## Paleta oficial

| Token | Hex | Uso |
|-------|-----|-----|
| Verde principal | `#2E6B1F` | `forest` / primário |
| Verde secundário | `#4F8F3A` | `sage` / secundário |
| Laranja principal | `#E97D4B` | `gold` / destaque |
| Fundo | `#F8FAF7` | `off-white` / background |
| Texto | `#1F2937` | `graphite` / foreground |

## Etapa 1 — Logo oficial

- [x] Lockup único: `public/logo-saude-bem.png`
- [x] `LogoImage` / `LogoHeader` / `LogoFooter` / `LogoAuth` usam PNG oficial
- [x] Fallback `LogoMark` com paleta 4.1
- [x] SVGs em `public/brand/` atualizados (`app-icon.svg`, `logo-mark-dark.svg`)

## Etapa 2 — Favicon

- [x] `public/favicon.ico` (16, 32, 48 px)
- [x] Referência em `logo-config.ts` → `brandIcons`
- [x] Gerado via `npm run generate:brand-icons`

## Etapa 3 — Ícones PWA

- [x] `public/icons/icon-192.png`
- [x] `public/icons/icon-512.png`
- [x] `public/icons/apple-touch-icon.png` (180×180)
- [x] `public/icons/icon-maskable.png` (512, safe zone)

## Etapa 4 — Paleta no código

- [x] `src/components/brand/logo-config.ts` — `brandColors`
- [x] `src/app/globals.css` — tokens CSS + Tailwind `@theme`
- [x] Utilitário `.brand-accent-bar` (gradiente marca)

## Etapa 5 — manifest.json

- [x] `theme_color`: `#2E6B1F`
- [x] `background_color`: `#F8FAF7`
- [x] Ícones PNG oficiais (192, 512, maskable, apple-touch)
- [x] `public/sw.js` — cache `saude-bem-pwa-v2` + novos assets

## Etapa 6 — UI (login, dashboard, cabeçalho)

- [x] `AuthLayout` — gradiente, barra de marca, card com ring
- [x] `Header` — barra de marca, borda verde no scroll
- [x] `ClubShell` — logo oficial + gradiente área clube
- [x] `ClubDashboard` — hero com gradiente marca

## Arquivos principais

| Área | Path |
|------|------|
| Paleta / ícones metadata | `src/components/brand/logo-config.ts` |
| Tokens CSS | `src/app/globals.css` |
| Gerador de ícones | `scripts/generate-brand-icons.mjs` |
| Manifest | `public/manifest.json` |
| PWA config | `src/lib/pwa/config.ts` |
| Login | `src/components/auth/AuthLayout.tsx` |
| Header | `src/components/layout/Header.tsx` |
| Clube | `src/components/club/ClubShell.tsx`, `ClubDashboard.tsx` |

## Comandos

```bash
npm install
npm run generate:brand-icons
npm run build
```

## Teste manual

1. [ ] Home — cores verde/laranja e logo PNG no header
2. [ ] `/entrar` — logo auth + fundo gradiente
3. [ ] `/clube/dashboard` — shell e hero com nova identidade
4. [ ] DevTools → Application → Manifest + ícones 192/512
5. [ ] `/favicon.ico` e `/icons/apple-touch-icon.png` retornam 200

## Build

- [x] `npm run build` sem erros

## Checkpoint v4.1

```bash
git add .
git commit -m "Checkpoint Fase 4.1 - Branding e identidade visual oficial"
git push
git tag -a v4.1 -m "Fase 4.1 - Branding"
git push origin v4.1
```

## Fora de escopo (4.1)

- [ ] Tipografia custom (arquivo de fonte própria)
- [ ] Ilustrações / fotografia de marca
- [ ] Redesign completo de todas as páginas internas (admin, blog body)
