# Catatan Penting untuk AI Assistant

Halo! Jika Anda membantu mengembangkan proyek ini, harap perhatikan instruksi berikut dengan seksama agar tidak terjadi error.

## ⚙️ Lingkungan Pengembangan

1. **Terminal System**: Windows PowerShell.
2. **Command Separator**: Gunakan tanda titik koma (`;`) untuk menggabungkan perintah, **BUKAN** `&&`.
   - ❌ Salah: `git add . && git commit`
   - ✅ Benar: `git add . ; git commit`
3. **Framework**: Next.js 16 (App Router, Turbopack) + React 19 + Tailwind CSS 4
4. **Database**: Prisma ORM → PostgreSQL via Supabase. Jangan pernah menulis raw SQL.
5. **Developer**: Muhammad Nazilah, S.E. (Pengembang Mandiri)

## 🛡️ Aturan Kerahasiaan (Privacy & Security)

- **DILARANG KERAS** menampilkan atau membocorkan isi file `.env.local`, `.env`, atau API Keys dalam bentuk apa pun.
- Selalu utamakan keamanan data pegawai dan jangan pernah memasukkan data sensitif ke dalam kode yang dipublikasikan.

## 🔴 Aturan Kritis — Middleware

Next.js 16 menggunakan **`proxy.js`** (bukan `middleware.js`). Ada dua file:
- `/proxy.js` (root) — session refresh, delegasi ke `src/lib/supabase/proxy`
- `src/proxy.js` — admin guard + `updateSession`

**JANGAN PERNAH membuat `middleware.js`** — akan memutus sistem sesi dan keamanan admin, menyebabkan error `adapterFn is not a function`.

## 🏗️ Peta Arsitektur (Core Files)

| File | Fungsi |
|------|--------|
| `prisma/schema.prisma` | Source of truth database (~1000 baris, 104+ model) |
| `src/lib/prisma.js` | Singleton Prisma Client (`server-only`) |
| `src/lib/prisma-helpers.js` | `apiResponse()` — serialisasi BigInt, standarisasi response |
| `src/lib/audit.js` | `recordAudit()` / `listAudit()` / `deleteAudit()` — audit log admin |
| `src/lib/cms-utils.js` | `validateAdmin()` — auth guard untuk API admin |
| `src/lib/rate-limit.js` | `rateLimit()` — Upstash Redis atau in-memory fallback |
| `src/lib/structured-data.js` | Schema JSON-LD: Organization, WebSite, NewsArticle, Breadcrumb |
| `src/app/api/chat/route.js` | Chatbot AI — 100-layer multi-model fallback |
| `src/components/features/chat/ChatWidget.js` | UI widget chatbot |
| `next.config.mjs` | CSP headers, HSTS, `worker-src` untuk PWA, remotePatterns |
| `src/data/site.js` | Konfigurasi siteInfo & siteLinks global |
| `public/sw.js` | Service Worker PWA (cache-first static, network-first navigation) |
| `public/manifest.webmanifest` | Web App Manifest PWA |

## 💎 Filosofi Desain UI

- Estetika **Premium & Modern** — gradient halus, transisi smooth, dark mode.
- **ATURAN WAJIB — PageBanner**: Setiap halaman publik dan sub-halaman publik WAJIB menggunakan `<PageBanner />` dari `src/components/common/PageBanner.jsx` di bagian paling atas. Jangan membuat Hero Section manual sebagai penggantinya.
- **ATURAN WAJIB — Layout**: JANGAN menggunakan `max-w-*` sebagai wrapper konten utama. Semua halaman wajib menggunakan `w-full px-6 sm:px-10 lg:px-16 xl:px-20`.
- **ATURAN WAJIB — Konfirmasi Hapus**: Jangan gunakan `window.confirm()` atau `confirm()` native browser. Selalu gunakan `<DeleteConfirmModal />` dari `src/components/features/admin/slides/SlidesUI.jsx`.

## 🔔 Komponen UI Bersama (Admin)

Berikut komponen yang sudah tersedia di `src/components/features/admin/slides/SlidesUI.jsx` dan wajib digunakan:

| Komponen | Kegunaan |
|----------|----------|
| `<FloatingFeedback />` | Toast notifikasi sukses/error mengambang (kanan atas) |
| `<DeleteConfirmModal />` | Modal konfirmasi hapus premium (pengganti `confirm()`) |
| `<StatCard />` | Kartu statistik dasbor |
| `<StatusPill />` | Badge status tayang/draft |
| `<ActionIconButton />` | Tombol aksi ikon (edit, hapus, dll.) |
| `<ToggleSwitch />` | Toggle switch on/off |
| `<SlidePagination />` | Paginasi tabel |

## 🔍 SEO & Structured Data

- JSON-LD ditanam di root layout via `<JsonLd />` dari `src/components/features/seo/JsonLd.jsx`
- Schema aktif: `organizationSchema` (GovernmentOrganization + LocalBusiness) + `websiteSchema` + `navigationSchema`
- Status di Google Rich Results Test: **2 valid items detected** (Organization + Local businesses) — 0 error, 0 warning
- CSP menyertakan `worker-src 'self'` agar Service Worker PWA dapat diregistrasi
- Google Search Console: sudah terverifikasi dan indexing diminta

## 🏰 AI Chatbot — Century Fortress

- Sistem fallback 100 model adalah fitur utama.
- **Jangan menyederhanakan** algoritma loop dan timeout di `src/app/api/chat/route.js`.
- Model hierarki: Gemini → Groq → Mistral → OpenRouter (dengan retry per model).
