# Fase 3 & 4 - Konten, UX, Keamanan, Performa

Dokumentasi ringkas penambahan pada Fase 3 dan Fase 4.

## Fase 3 - Konten & UX

### 1. Route yang sebelumnya hilang

Ditambahkan halaman:

- `/survey` - pilihan survey kepuasan masyarakat (SKM, SPAK, PTSP)
- `/ppid` - Pejabat Pengelola Informasi dan Dokumentasi
- `/laporan` - index dokumen akuntabilitas
- `/laporan/[slug]` - halaman detail untuk 7 kategori (Renstra, PK, RKT, dll)

### 2. CMS Halaman Statis

Sistem CMS sederhana untuk halaman statis yang dapat dikelola dari admin.

- URL publik: `/halaman/[slug]`
- Admin UI: `/admin/halaman`
- API: `/api/admin/halaman` (GET, POST, PUT, DELETE)
- Tabel Supabase: `static_pages` (lihat `docs/schema.sql`)
- Izin baru: `halaman:view|create|update|delete|publish`

### 3. Pencarian Full-Text

- API baru: `/api/search?q=...&limit=10`
- Query tabel: `berita`, `pengumuman`, `static_pages`, `agenda`
- Pakai `ilike` di kolom title/excerpt/content/description
- Client di `/pencarian` menggabungkan hasil lokal (data statis) dengan hasil API

### 4. i18n (ID/EN)

Ditambah kunci baru pada `src/data/i18n.js`:

- `footer.*`: quickLinks, officeHours, followUs, copyright
- `actions.*`: readMore, viewAll, back, submit, cancel, save, send, loading

### 5. Aksesibilitas

- Skip-to-content link di `AppShell`
- `id="konten-utama"` pada main dan `tabIndex="-1"` agar fokus bisa pindah
- Fokus `focus-visible` yang konsisten di `globals.css`

## Fase 4 - Keamanan & Performa

### 1. Security Headers

Di `next.config.mjs` ditambahkan header keamanan:

- `Content-Security-Policy` (CSP) dengan whitelist Vercel, Supabase, Google Maps/Drive
- `Strict-Transport-Security` (HSTS) - hanya di production
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` memblokir camera/mic/geolocation/FLoC
- `X-DNS-Prefetch-Control: on`

### 2. Rate Limit via Upstash Redis

`src/lib/rate-limit.js` menyediakan rate limiter hybrid:

- Jika env `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN` tersedia, pakai Upstash REST
- Jika tidak, fallback ke in-memory bucket (per proses)

Dipakai di:

- `/api/kontak` (5 request / menit per IP)
- `/api/search` (30 request / menit per IP)

### 3. PWA

- `public/manifest.webmanifest` dengan shortcut Berita dan Kontak
- `public/sw.js` service worker dengan strategi network-first untuk navigation, cache-first untuk static asset, dan fallback `public/offline.html`
- `src/components/PwaRegister.jsx` mendaftarkan SW hanya di production
- Tidak mengganggu `/admin` (di-bypass)

### 4. Testing (Vitest)

- Config: `vitest.config.mjs`
- Scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`
- Test yang sudah ditulis:
  - `tests/validation.test.js` - 17 test (cleanString, cleanHtml, requireFields, oneOf, toDateISO, isHttpsUrl)
  - `tests/permissions.test.js` - 10 test (role matrix)
  - `tests/rate-limit.test.js` - 2 test (in-memory fallback)

Total 29 test, semua lulus.

### 5. CI/CD GitHub Actions

- `.github/workflows/ci.yml` menjalankan lint, test, build pada push ke `main` dan setiap PR
- Node.js 20
- Gunakan repo secrets untuk `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`

## Env Baru

| Env | Wajib | Fungsi |
| --- | --- | --- |
| `UPSTASH_REDIS_REST_URL` | opsional | Rate limit terpusat |
| `UPSTASH_REDIS_REST_TOKEN` | opsional | Rate limit terpusat |

Jika tidak diset, rate limit fallback ke memori lokal.

## Migrasi Database Tambahan

Sudah ditambahkan ke `docs/schema.sql`:

- Tabel `static_pages` (dengan RLS: publik baca halaman published, admin/editor baca semua)
- Tabel `documents` (opsional untuk katalog dokumen masa depan)
