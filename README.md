# Your Guide Algarve

Marketplace de passeios e experiências no Algarve. Os visitantes navegam por atividades de parceiros e clicam para reservar via links de afiliado.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Supabase (Postgres + Auth) — região eu-west-3 (Paris)
- Deploy: Vercel

## Estrutura

- `app/(site)` — site público (home, listagem, detalhes do passeio)
- `app/admin` — painel administrativo (CRUD de passeios, parceiros, categorias)
- `components/site` — componentes do site público
- `components/admin` — componentes do painel
- `components/ui` — primitivos compartilhados
- `lib/supabase` — clientes Supabase (browser, server, middleware)

## Setup local

```bash
npm install
cp .env.example .env.local   # preencha com URL e ANON KEY do Supabase
npm run dev
```

## Admin

Acesse `/admin/login` com um usuário criado no Supabase Auth. Apenas e-mails listados na tabela `admins` podem entrar.
