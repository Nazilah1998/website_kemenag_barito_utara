# AGENTS.md — Kemenag Barito Utara

## Stack
- **Next.js 16** (App Router, Turbopack), React 19, Tailwind CSS 4
- **Prisma ORM** (PostgreSQL via Supabase) — two schemas: `auth` + `public`
- **Supabase** for Auth & Storage only (not DB queries)
- **Cloudflare R2** for file/media storage
- **Vitest** (unit), **Playwright** (E2E)
- **Google Gemini / Groq / Mistral / OpenRouter** — multi-model AI chatbot fallback

## Critical: Middleware (`proxy.js`)
Next.js 16 uses `proxy.js` (not `middleware.js`). **Two files export `proxy` + `config`:**
- `/proxy.js` (root) — delegates to `src/lib/supabase/proxy` (session refresh only)
- `src/proxy.js` — admin guard + `updateSession` (full middleware)

Do **NOT** create `middleware.js` — it breaks admin auth.

## Commands (Windows PowerShell — use `;` not `&&`)
| Action | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` (auto-runs `prisma generate`) |
| Start (prod) | `npm run start` |
| Lint | `npm run lint` |
| Unit tests | `npm test` (Vitest; `tests/**/*.test.{js,jsx}`) |
| Watch tests | `npm run test:watch` |
| Coverage | `npm run test:coverage` |
| E2E tests | `npm run test:e2e` (Playwright; `tests/e2e/`) |
| E2E UI mode | `npm run test:e2e:ui` |
| DB push | `npm run db:push` |

## Architecture
- **Alias**: `@/*` → `./src/*`
- **Root layout**: `src/app/layout.js` — includes ChatWidget, RealtimeSync, Providers
- **Entrypoints**: `src/app/page.js` (home), `src/app/admin/` (admin panel)
- **API routes**: `src/app/api/`; admin APIs under `src/app/api/admin/` (30+ endpoints)
- **Prisma client**: `src/lib/prisma.js` (singleton, `prisma/adapter-pg` pool, `'server-only'`)
- **Env validation**: `src/lib/env.js` — throws on missing `SUPABASE_URL`/`SUPABASE_ANON_KEY`
- **API responses** MUST use `apiResponse()` from `src/lib/prisma-helpers.js` (BigInt serialization)
- **Audit log**: `recordAudit()` from `src/lib/audit.js` — auto-log admin CRUD

## UI / Layout
- Every public page MUST use `<PageBanner />` from `src/components/common/PageBanner.jsx` at top
- **DO NOT** use `max-w-*` wrappers — use `w-full px-6 sm:px-10 lg:px-16 xl:px-20`
- Chatbot AI widget: `src/components/features/chat/ChatWidget.js`
- CSS: Tailwind v4 (`@import "tailwindcss"` in `globals.css`; `postcss.config.mjs` uses `@tailwindcss/postcss`)

## Database
- Prisma ORM only — never raw SQL
- Source of truth: `prisma/schema.prisma` (1000 lines)
- Models: `berita`, `agenda`, `galeri`, `dokumen`, `laporan_*`, `profiles`, `admin_users`, `static_pages`, `seksi`, `pegawai_seksi`, `layanan_ptsp`, `link_aplikasi_seksi`
- Rate limit: Upstash Redis or in-memory failover (`src/lib/rate-limit.js`)
- Prisma engine type: `"binary"` (override via `PRISMA_CLIENT_ENGINE_TYPE` env)

## Testing
- Vitest: happy-dom, `@testing-library/jest-dom/vitest`, `next/navigation` mocked (see `vitest.setup.js`)
- Playwright: single project (chromium), base URL `http://127.0.0.1:3000`, auto-starts dev server
- 7 unit tests in `tests/`; 1 E2E spec in `tests/e2e/`

## Environment
- `.env*` files are gitignored — create `.env.local` from scratch
- `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`, `GROQ_API_KEY`, `MISTRAL_API_KEY`, `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
- `CLOUDFLARE_R2_*` (access key, secret, endpoint, bucket)
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (optional, for distributed rate limit)

## Notes
- ESLint: flat config (`eslint.config.mjs`), `eslint-config-next/core-web-vitals`
- Security headers (CSP, HSTS) configured in `next.config.mjs`
- Prisma config: `prisma.config.js` (separate from schema)
- Dev by Muhammad Nazilah, S.E.
