# Website Kemenag Barito Utara

Website resmi Kementerian Agama Kabupaten Barito Utara berbasis **Next.js 16 App Router** dengan halaman publik, panel admin CMS lengkap, integrasi Supabase Auth & Cloudflare R2 Storage, PWA, chatbot AI multi-model, dan pengujian otomatis dengan Vitest & Playwright.

## Teknologi utama

| Kategori | Teknologi |
|----------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Database | Prisma ORM → PostgreSQL (via Supabase) |
| Auth & Realtime | Supabase |
| File Storage | Cloudflare R2 |
| AI Chatbot | Google Gemini / Groq / Mistral / OpenRouter (multi-model fallback) |
| Testing | Vitest (unit), Playwright (E2E) |
| SEO | Structured Data JSON-LD, Sitemap dinamis, Robots.txt |
| PWA | Service Worker (`/public/sw.js`), Web Manifest |

## Struktur folder utama

```bash
.
├── prisma/               # Skema database & konfigurasi Prisma (~1000 baris, 104+ model)
├── public/               # Aset statis, sw.js, manifest.webmanifest, offline.html
│   └── assets/           # icons/, images/, branding/, apps/, workers/
├── src/
│   ├── app/              # Routing App Router & API routes
│   │   ├── admin/        # Panel admin (14 sub-route)
│   │   ├── api/          # 12 public API + 18+ admin API
│   │   ├── layout.js     # Root layout (JsonLd, ChatWidget, RealtimeSync)
│   │   ├── sitemap.js    # Sitemap dinamis (SSG + DB)
│   │   └── robots.js     # Robots.txt dinamis
│   ├── components/
│   │   ├── common/       # PageBanner, RealtimeSync, dll.
│   │   ├── features/     # admin/, chat/, portal/, seo/
│   │   └── layout/       # AppShell, Providers, PwaRegister, dll.
│   ├── data/             # Data statis (site.js, laporan.js, navigasi, dll.)
│   └── lib/              # Business logic, Prisma, Auth, Storage, SEO
├── tests/                # 7 unit test (Vitest) + 1 E2E spec (Playwright)
├── proxy.js              # Root middleware (session refresh, delegasi ke src/lib/supabase/proxy)
└── src/proxy.js          # Full middleware (admin guard + updateSession)
```

## Menjalankan proyek secara lokal

1. Install dependency:
```bash
npm install
```

2. Buat file `.env.local` dan tambahkan variabel berikut:
```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Chatbot (minimal 1)
GEMINI_API_KEY=
GROQ_API_KEY=
MISTRAL_API_KEY=
OPENROUTER_API_KEY=

# Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_ENDPOINT=
CLOUDFLARE_R2_BUCKET_NAME=

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Optional
NEXT_PUBLIC_SITE_URL=https://baritoutara.kemenag.go.id
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

3. Jalankan development server:
```bash
npm run dev
```

## Scripts

```bash
npm run dev           # Dev server (Turbopack)
npm run build         # Production build (auto: prisma generate)
npm run start         # Production server
npm run lint          # ESLint (flat config)
npm run test          # Unit test (Vitest)
npm run test:watch    # Unit test watch mode
npm run test:coverage # Coverage report
npm run test:e2e      # E2E test (Playwright, Chromium)
npm run test:e2e:ui   # E2E dengan UI interaktif
npm run db:push       # Prisma db push
```

> ⚠️ Script `lint:fix` dan `typecheck` **tidak ada** meskipun disebutkan di dokumentasi lama.

## Prinsip arsitektur proyek

- **Database**: Semua akses data wajib melalui Prisma ORM — tidak boleh raw SQL.
- **API Response**: Semua API route wajib menggunakan `apiResponse()` dari `src/lib/prisma-helpers.js` untuk serialisasi BigInt yang konsisten.
- **Audit Log**: Setiap operasi CRUD di panel admin wajib dicatat via `recordAudit()` dari `src/lib/audit.js`.
- **Admin Auth**: Semua API admin wajib memanggil `validateAdmin()` dari `src/lib/cms-utils.js`.
- **Rate Limit**: Gunakan `rateLimit()` dari `src/lib/rate-limit.js` — otomatis fallback ke in-memory jika Redis tidak tersedia.
- **Middleware (proxy.js)**: Next.js 16 menggunakan `proxy.js` bukan `middleware.js`. **Jangan membuat atau mengubah ke `middleware.js`** — akan memutus sistem sesi dan keamanan admin.
- **UI — PageBanner**: Setiap halaman publik WAJIB menyertakan `<PageBanner />` dari `src/components/common/PageBanner.jsx` di bagian paling atas.
- **UI — Layout**: DILARANG menggunakan `max-w-*` sebagai wrapper konten utama. Gunakan `w-full px-6 sm:px-10 lg:px-16 xl:px-20`.
- **Konfirmasi Hapus**: Gunakan `<DeleteConfirmModal />` dari `src/components/features/admin/slides/SlidesUI.jsx` — jangan gunakan `window.confirm()` native.

## SEO & Structured Data

- Structured data JSON-LD di root layout: `organizationSchema`, `websiteSchema`, `navigationSchema`
- Sitemap dinamis (`/sitemap.xml`) — include halaman statis + berita dari DB
- Robots.txt dinamis — melindungi `/admin`, `/api/`, `/auth/`
- CSP header dikonfigurasi di `next.config.mjs` termasuk `worker-src 'self'` untuk PWA
- Google Search Console terverifikasi via meta tag di `layout.js`

## Status Pengembangan

- [x] Panel admin CMS lengkap (berita, galeri, laporan, slide, pesan, seksi/pegawai)
- [x] Chatbot AI multi-model dengan 100-layer fallback
- [x] PWA (Service Worker + Web Manifest)
- [x] SEO Structured Data JSON-LD (Organization + LocalBusiness — 2 valid items)
- [x] Manajemen kepegawaian per seksi/bidang dengan foto dan detail pegawai
- [x] Konfirmasi hapus menggunakan modal floating (bukan browser native confirm)
- [ ] Menyatukan source-of-truth data antara `src/data` dan database
- [ ] Migrasi database terstruktur (saat ini masih `db:push`)

## Catatan

Repository ini adalah website institusi pemerintah. Fokus utama:
- Kejelasan informasi publik
- Kestabilan dan keamanan data
- Kemudahan pengelolaan admin
- Aksesibilitas dan performa
- Kesiapan pengembangan jangka panjang

Dikembangkan oleh **Muhammad Nazilah, S.E.**
