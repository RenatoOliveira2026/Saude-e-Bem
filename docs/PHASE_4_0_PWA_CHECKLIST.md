# Fase 4.0 — PWA Saúde & Bem — Checklist

## Objetivo

Transformar o portal em Progressive Web App instalável em Android, iPhone e desktop, com cache de assets, tela offline e base para auditoria Lighthouse PWA.

**Status:** concluída e validada em produção (Vercel).

## Entregas

### 1. Web App Manifest

- [x] `public/manifest.json` — `name`, `short_name`, `description`, `lang`, `start_url`, `scope`, `display`, `theme_color`, `background_color`
- [x] Ícones `192x192` e `512x512` em `public/icons/`
- [x] Ícone maskable SVG em `public/icons/icon-maskable.svg`
- [x] Atalhos (protocolos, biblioteca, ferramentas, minha jornada)
- [x] Link no layout via `metadata.manifest`

### 2. Service Worker

- [x] `public/sw.js` — versão `saude-bem-pwa-v1`
- [x] Precache: offline, manifest, ícones
- [x] Navegação: network-first → cache → `/offline`
- [x] Assets estáticos: cache-first + atualização em background
- [x] Exclusões: `/api/*`, `/auth/*`, Supabase
- [x] Headers em `next.config.ts` (`Service-Worker-Allowed`, cache SW)

### 3. Registro e instalação

- [x] `PwaProvider` registra SW após `load`
- [x] `InstallPrompt` — evento `beforeinstallprompt` (Android/Chrome desktop)
- [x] `IosInstallHint` — instruções Add to Home Screen (Safari iOS)
- [x] Proxy ignora `sw.js`, `manifest.json`, `offline.html` (`src/proxy.ts`)

### 4. Meta tags e viewport

- [x] `viewport.themeColor` em `src/app/layout.tsx`
- [x] `appleWebApp`, `applicationName`, `mobile-web-app-capable`
- [x] Apple Touch Icon `/icons/icon-192.png`

### 5. Tela offline

- [x] `src/app/offline/page.tsx` — UI alinhada ao design system
- [x] `public/offline.html` — fallback estático para o SW

### 6. Ícones temporários

- [x] `public/icons/icon-192.png`, `icon-512.png` (cópia do logo oficial)
- [x] `public/brand/app-icon.svg` referenciado no manifest
- [ ] Substituir por pack dedicado antes de produção final (recomendado — melhoria futura)

## Arquivos principais

| Área | Path |
|------|------|
| Manifest | `public/manifest.json` |
| Service Worker | `public/sw.js` |
| Config | `src/lib/pwa/config.ts` |
| Provider | `src/components/pwa/PwaProvider.tsx` |
| Install Android | `src/components/pwa/InstallPrompt.tsx` |
| Install iOS | `src/components/pwa/IosInstallHint.tsx` |
| Offline | `src/app/offline/page.tsx`, `public/offline.html` |
| Layout | `src/app/layout.tsx` |
| Deploy Vercel | `vercel.json`, `src/proxy.ts` |

## Validação produção (Vercel)

**URL:** https://saude-e-bem.vercel.app

| Teste | Status |
|-------|--------|
| Home OK (`/`) | [x] Aprovado |
| Offline OK (`/offline`) | [x] Aprovado |
| Manifest OK (`/manifest.json`) | [x] Aprovado |
| Service Worker OK (`/sw.js` + registro) | [x] Aprovado |
| Produção validada na Vercel | [x] Aprovado |

**Deploy:** Framework Preset Next.js + `vercel.json`; commit `864f635` (`fix: corrigir deploy Vercel Next.js e proxy`).

## Teste manual

1. [x] `npm run dev` → DevTools → Application → Manifest válido
2. [x] Application → Service Workers — `sw.js` ativo, scope `/`
3. [x] DevTools → Network → Offline → navegar para página nova → `/offline`
4. [x] Android Chrome — banner ou botão “Instalar app”
5. [x] iOS Safari — hint “Adicionar à Tela de Início” após alguns segundos
6. [x] Desktop Chrome — ícone instalar na barra de endereço
7. [x] Atalhos do manifest abrem rotas corretas

## Auditoria Lighthouse (PWA)

Executar em **HTTPS** (produção):

```bash
npx lighthouse https://saude-e-bem.vercel.app --only-categories=pwa --view
```

Checklist Lighthouse PWA:

- [x] Manifest atende critérios instaláveis
- [x] Service worker registrado e controla a página
- [x] Resposta offline (página `/offline` ou `offline.html`)
- [x] `theme-color` presente
- [x] Ícones 192 px e 512 px
- [x] `start_url` carrega com HTTP 200
- [x] `display: standalone` (ou equivalente)

Dicas para nota máxima (melhorias opcionais):

- Substituir ícones temporários por PNGs nas dimensões exatas (192×192, 512×512)
- Adicionar `screenshots` no manifest para install UI avançada

## Build

```bash
npm run build
```

- [x] Build sem erros TypeScript

## Vercel — deploy Next.js (404 resolvido)

**Sintoma anterior:** `/manifest.json` e `/sw.js` retornavam **200**, mas `/`, `/offline` e `/_next/*` retornavam **404 NOT_FOUND**.

**Causa:** Framework Preset **Other** ou **Output Directory** = `public`.

**Correção aplicada:**

1. `vercel.json` — `"framework": "nextjs"`, `npm run build`
2. `src/proxy.ts` — substitui `middleware.ts` (Next.js 16)
3. Dashboard Vercel — Framework **Next.js**, Output Directory **vazio**, redeploy com cache limpo

**Validado em produção:**

- [x] `https://saude-e-bem.vercel.app/` → **200**
- [x] `https://saude-e-bem.vercel.app/offline` → **200**
- [x] `https://saude-e-bem.vercel.app/manifest.json` → **200**
- [x] `https://saude-e-bem.vercel.app/sw.js` → **200**

## Checkpoint v4.0 (implementação)

Tag e commit iniciais da fase:

```bash
git add .
git commit -m "Checkpoint Fase 4.0 - PWA instalável Saúde & Bem"
git push
git tag -a v4.0 -m "Fase 4.0 - Progressive Web App"
git push origin v4.0
```

**Registrado:** commit `7c6810e`, tag `v4.0`.

## Checkpoint final v4.0 (produção validada)

```bash
git add .
git commit -m "Checkpoint final Fase 4.0 - PWA validado em produção Vercel"
git push
git tag -a v4.0-production -m "Fase 4.0 - PWA em produção"
git push origin v4.0-production
```

Tag alternativa alinhada às fases anteriores (opcional):

```bash
git tag -a v0.4.0-production -m "Fase 4.0 - PWA produção"
git push origin v0.4.0-production
```

## Fora de escopo (Fase 4.0)

- [ ] Push notifications
- [ ] Background sync de favoritos
- [ ] Workbox / next-pwa
- [ ] Screenshots no manifest (Lighthouse “richer install UI” — opcional)

## Próximos passos sugeridos

- Pack de ícones profissional (maskable 512, splash iOS)
- `screenshots` no manifest para install UI avançada
- Estratégia de cache para páginas visitadas (runtime limitado)
- Push + notificações de novo conteúdo (fase futura)
