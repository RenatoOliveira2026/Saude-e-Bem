# Saúde & Bem

Plataforma premium de saúde, bem-estar e longevidade.

## URLs

| Ambiente | URL |
|----------|-----|
| **Desenvolvimento** | [http://localhost:3001](http://localhost:3001) |
| **Produção** | [https://saudeebem.com.br](https://saudeebem.com.br) |

> A porta de desenvolvimento é definida em `.env.local` (`PORT=3001`). Os scripts `dev` e `start` carregam esse arquivo antes de iniciar o Next.js.

## Getting Started

Copie as variáveis de ambiente e instale as dependências:

```bash
# .env.local já inclui PORT=3001
npm install
npm run dev
```

Abra [http://localhost:3001](http://localhost:3001) no navegador.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (porta via `PORT` em `.env.local`) |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção (porta via `PORT` em `.env.local`) |
| `npm run lint` | Verificação ESLint |

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Montserrat + Open Sans

## Estrutura

```
src/
├── app/           # Páginas e rotas
├── components/    # UI, layout, brand, pages
└── lib/           # Utilitários e dados mockados
```
