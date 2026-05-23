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

No `typecheck` or `lint:fix` script exists despite README claims.

## Architecture
- **Alias**: `@/*` → `./src/*` (jsconfig.json + vitest.config.mjs)
- **Root layout**: `src/app/layout.js` — includes ChatWidget, RealtimeSync, Providers, JsonLd structured data
- **Entrypoints**: `src/app/page.js` (home), `src/app/admin/` (14 sub-routes)
- **API routes**: `src/app/api/` (12 public dirs); admin APIs under `src/app/api/admin/` (18 entries incl. audit, berita, dashboard, editors, galeri, galeri-berita, halaman, homepage-slides, laporan, login, logout, my-permissions, pesan, register-editor, reset-password, seksi, session, update-password)
- **Prisma client**: `src/lib/prisma.js` (singleton, `prisma/adapter-pg` pool via `pg.Pool`, `'server-only'`)
- **Env validation**: `src/lib/env.js` — checks `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- **API responses** MUST use `apiResponse()` from `src/lib/prisma-helpers.js` (BigInt serialization)
- **Audit log**: `recordAudit()` / `listAudit()` / `deleteAudit()` from `src/lib/audit.js` — auto-log admin CRUD
- **Admin auth guard**: `validateAdmin()` from `src/lib/cms-utils.js` (role/permission check in API routes)
- **Rate limit**: `rateLimit()` from `src/lib/rate-limit.js` — Upstash Redis or in-memory Map fallback
- **SEO structured data**: `src/lib/structured-data.js` — `organizationSchema()`, `websiteSchema()`, `newsArticleSchema()`, `breadcrumbSchema()`, `contactPageSchema()`, `navigationSchema()`

## UI / Layout
- Every public page MUST use `<PageBanner />` from `src/components/common/PageBanner.jsx` at top
- **DO NOT** use `max-w-*` wrappers — use `w-full px-6 sm:px-10 lg:px-16 xl:px-20`
- Chatbot AI widget: `src/components/features/chat/ChatWidget.js`
- CSS: Tailwind v4 (`@import "tailwindcss"` in `globals.css`; `postcss.config.mjs` uses `@tailwindcss/postcss`)
- **Shared Admin UI components** in `src/components/features/admin/slides/SlidesUI.jsx`:
  - `<FloatingFeedback />` — floating toast (success/error)
  - `<DeleteConfirmModal />` — premium delete confirmation modal — **ALWAYS use this instead of `window.confirm()`**
  - `<StatCard />`, `<StatusPill />`, `<ActionIconButton />`, `<ToggleSwitch />`, `<SlidePagination />`

## Database
- Prisma ORM only — never raw SQL
- Source of truth: `prisma/schema.prisma` (~1000 lines, 104 models incl. auth schema)
- App models: `admin_audit_log`, `admin_users`, `agenda`, `berita`, `categories`, `documents`, `dokumen`, `editor_requests`, `galeri`, `homepage_slides`, `kontak_pesan`, `news`, `profiles`, `report_categories`, `report_documents`, `static_pages`, `user_permissions`, `seksi`, `pegawai_seksi`, `layanan_ptsp`, `link_aplikasi_seksi`, `layanan_publik`, `testimonials`
- Auth schema models (`@schema("auth")`) exist but are managed by Supabase — do not modify
- Rate limit: Upstash Redis or in-memory failover (`src/lib/rate-limit.js`)
- Prisma engine type: `"binary"` (set in schema.prisma; overridable via `PRISMA_CLIENT_ENGINE_TYPE` env)

## Testing
- Vitest: happy-dom, `@testing-library/jest-dom/vitest`, `next/navigation` mocked (see `vitest.setup.js`)
- Playwright: single project (chromium), base URL `http://127.0.0.1:3000`, auto-starts dev server
- 7 unit test files in `tests/`: `admin-laporan-manager`, `laporan-admin-reducer`, `laporan-admin-utils`, `permissions`, `rate-limit`, `structured-data`, `validation`
- 1 E2E spec in `tests/e2e/`

## SEO & PWA
- JSON-LD injected at root layout via `<JsonLd />` from `src/components/features/seo/JsonLd.jsx`
- Active schemas: `organizationSchema` (GovernmentOrganization + GovernmentOffice) + `websiteSchema` + `navigationSchema`
- Organization schema includes: `logo` (`/assets/icons/kemenag-512.png`), `image` array (logo + logo-share + kantor photo), `priceRange: "Gratis"`
- Google Rich Results Test: **2 valid items — Organization + Local businesses** (0 errors, 0 warnings)
- Sitemap: `src/app/sitemap.js` (dynamic — static routes + berita from DB, revalidate 300s)
- Robots: `src/app/robots.js` (disallow: /admin, /api/, /auth/, /login, /debug-error)
- PWA: `/public/sw.js` (cache-first static, network-first navigation), `/public/manifest.webmanifest`
- CSP includes `worker-src 'self'` to allow Service Worker registration

## Environment
- `.env*` files are gitignored — create `.env.local` from scratch
- Required: `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- AI keys: `GEMINI_API_KEY`, `GROQ_API_KEY`, `MISTRAL_API_KEY`, `OPENROUTER_API_KEY`
- Turnstile: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
- R2: `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_ENDPOINT`, `CLOUDFLARE_R2_BUCKET_NAME`
- Optional: `NEXT_PUBLIC_SITE_URL` (defaults to `https://baritoutara.kemenag.go.id`), `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (fallback to `ANON_KEY`)
- Optional rate limit: `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (in-memory used if absent)

## Notes
- ESLint: flat config (`eslint.config.mjs`), `eslint-config-next/core-web-vitals`
- Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy) configured in `next.config.mjs`
- CSP includes `worker-src 'self'` for PWA Service Worker support
- Prisma separate config: `prisma.config.js` (uses `DIRECT_URL` || `DATABASE_URL`)
- `prisma generate` runs automatically as part of `npm run build`
- Root canonical removed from layout.js — set canonical per-page only (homepage: `src/app/page.js`)
- Google Search Console: verified, indexing requested
- Dev by Muhammad Nazilah, S.E.
