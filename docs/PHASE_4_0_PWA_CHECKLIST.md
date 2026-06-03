# Fase 4.0 — PWA Saúde & Bem — Checklist

## Objetivo

Transformar o portal em Progressive Web App instalável em Android, iPhone e desktop, com cache de assets, tela offline e base para auditoria Lighthouse PWA.

## Entregas

### 1. Web App Manifest

- [ ] `public/manifest.json` — `name`, `short_name`, `description`, `lang`, `start_url`, `scope`, `display`, `theme_color`, `background_color`
- [ ] Ícones `192x192` e `512x512` em `public/icons/`
- [ ] Ícone maskable SVG em `public/icons/icon-maskable.svg`
- [ ] Atalhos (protocolos, biblioteca, ferramentas, minha jornada)
- [ ] Link no layout via `metadata.manifest`

### 2. Service Worker

- [ ] `public/sw.js` — versão `saude-bem-pwa-v1`
- [ ] Precache: offline, manifest, ícones
- [ ] Navegação: network-first → cache → `/offline`
- [ ] Assets estáticos: cache-first + atualização em background
- [ ] Exclusões: `/api/*`, `/auth/*`, Supabase
- [ ] Headers em `next.config.ts` (`Service-Worker-Allowed`, cache SW)

### 3. Registro e instalação

- [ ] `PwaProvider` registra SW após `load`
- [ ] `InstallPrompt` — evento `beforeinstallprompt` (Android/Chrome desktop)
- [ ] `IosInstallHint` — instruções Add to Home Screen (Safari iOS)
- [ ] Middleware ignora `sw.js`, `manifest.json`, `offline.html`

### 4. Meta tags e viewport

- [ ] `viewport.themeColor` em `src/app/layout.tsx`
- [ ] `appleWebApp`, `applicationName`, `mobile-web-app-capable`
- [ ] Apple Touch Icon `/icons/icon-192.png`

### 5. Tela offline

- [ ] `src/app/offline/page.tsx` — UI alinhada ao design system
- [ ] `public/offline.html` — fallback estático para o SW

### 6. Ícones temporários

- [ ] `public/icons/icon-192.png`, `icon-512.png` (cópia do logo oficial)
- [ ] `public/brand/app-icon.svg` referenciado no manifest
- [ ] Substituir por pack dedicado antes de produção final (recomendado)

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

## Teste manual

1. [ ] `npm run dev` → DevTools → Application → Manifest válido
2. [ ] Application → Service Workers — `sw.js` ativo, scope `/`
3. [ ] DevTools → Network → Offline → navegar para página nova → `/offline`
4. [ ] Android Chrome — banner ou botão “Instalar app”
5. [ ] iOS Safari — hint “Adicionar à Tela de Início” após alguns segundos
6. [ ] Desktop Chrome — ícone instalar na barra de endereço
7. [ ] Atalhos do manifest abrem rotas corretas

## Auditoria Lighthouse (PWA)

Executar em **HTTPS** (produção ou túnel):

```bash
npx lighthouse https://saude-e-bem.vercel.app --only-categories=pwa --view
```

Checklist Lighthouse PWA:

- [ ] Manifest atende critérios instaláveis
- [ ] Service worker registrado e controla a página
- [ ] Resposta offline (página `/offline` ou `offline.html`)
- [ ] `theme-color` presente
- [ ] Ícones 192 px e 512 px
- [ ] `start_url` carrega com HTTP 200
- [ ] `display: standalone` (ou equivalente)

Dicas para nota máxima:

- Testar em janela anônima após primeiro deploy
- Garantir que `sw.js` e `manifest.json` retornam 200 em produção
- Evitar redirecionar `sw.js` ou bloquear por CSP
- Substituir ícones temporários por PNGs nas dimensões exatas (192×192, 512×512)

## Build

```bash
npm run build
```

- [ ] Build sem erros TypeScript

## Vercel — corrigir 404 (só `public/` servido)

Sintoma em produção: `/manifest.json` e `/sw.js` retornam **200**, mas `/`, `/offline` e `/_next/*` retornam **404 NOT_FOUND** da plataforma Vercel.

**Causa:** Framework Preset **Other** ou **Output Directory** = `public` (deploy estático, sem o servidor Next.js).

**Correção no dashboard** (Settings → Build and Deployment):

1. **Framework Preset:** `Next.js`
2. **Root Directory:** vazio (raiz do repositório `Saude-e-Bem`)
3. **Output Directory:** vazio (não usar `public` nem `.next`)
4. **Build Command:** `npm run build` (ou deixar padrão)
5. **Install Command:** `npm install`
6. Redeploy com **Clear Build Cache**

O repositório inclui `vercel.json` com `"framework": "nextjs"` para reforçar o preset no deploy.

**Proxy Next.js 16:** `src/proxy.ts` (substitui `middleware.ts` deprecado).

Após redeploy, validar:

- `https://saude-e-bem.vercel.app/` → **200** (HTML da home)
- `https://saude-e-bem.vercel.app/offline` → **200**
- Domínio de deployment no GitHub (Deployments) pode exigir login (401) se **Deployment Protection** estiver ativo — isso é diferente de 404.

## Checkpoint v4.0

```bash
git add .
git commit -m "Checkpoint Fase 4.0 - PWA instalável Saúde & Bem"
git push
git tag -a v4.0 -m "Fase 4.0 - Progressive Web App"
git push origin v4.0
```

Tag alternativa alinhada às fases anteriores (opcional):

```bash
git tag -a v0.4.0 -m "Fase 4.0 - PWA"
git push origin v0.4.0
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
