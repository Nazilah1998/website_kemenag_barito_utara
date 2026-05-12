# CLAUDE.md — Panduan Proyek Website Kemenag Barito Utara

Dokumen ini adalah instruksi konteks untuk AI coding assistant agar memahami struktur, aturan, dan konvensi proyek ini tanpa perlu bertanya berulang kali.

---

## 1. Identitas Proyek

- **Nama**: Website Resmi Kemenag Kabupaten Barito Utara
- **URL Produksi**: https://www.kemenag-baritoutara.com
- **Tujuan**: Portal informasi publik, layanan digital PTSP, berita kegiatan, dan publikasi resmi instansi pemerintah.
- **Target Pengguna**: Masyarakat umum, pegawai ASN Kemenag, admin kantor.

---

## 2. Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16.2.3 (App Router) |
| Language | JavaScript (JSX) — **bukan TypeScript** |
| Styling | Tailwind CSS v4 |
| Database | **Prisma ORM** (Primary access) |
| Infrastructure | Supabase (Postgres Host + Auth) |
| Storage Media | Supabase Storage (bucket: `cms-media`) |
| Hosting | Vercel |
| AI Chatbot | Google Gemini API (gemini-flash-latest) |
| PDF Viewer | react-pdf + pdfjs-dist |
| Testing | Vitest + Playwright |

---

## 3. Perintah Penting

```bash
# Jalankan server development
npm run dev

# Buka Prisma Studio (Local DB UI)
npx prisma studio

# Build production (Otomatis generate prisma client)
npm run build

# Unit test
npm run test

# E2E test (Playwright)
npm run test:e2e
```

> **Server Dev berjalan di**: `http://localhost:3000`  
> Ada proxy layer (`proxy.js`) yang mem-forward request ke Next.js.

---

## 4. Struktur Direktori

```
/
├── prisma/                     # Skema database & migrasi Prisma
│   └── schema.prisma           # Single source of truth database
│
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Dashboard admin (Prisma-powered)
│   │   ├── api/                # API routes
│   │   │   ├── admin/          # API Admin (Standar: validateAdmin + Prisma)
│   │   │   └── chat/route.js   # AI Chatbot endpoint
│   │   └── ...
│   │
│   ├── lib/                    # Utility & helper functions
│   │   ├── prisma.js           # Singleton Prisma Client
│   │   ├── prisma-helpers.js   # Helper BigInt & API response
│   │   ├── audit.js            # Audit Logging via Prisma
│   │   ├── cms-utils.js        # validateAdmin security logic
│   │   ├── supabase/           # Supabase Auth & Storage clients
│   │   └── ...
│   │
│   ├── context/                # React Context providers
│   └── hooks/                  # Custom React hooks
│
├── public/                     # Aset statis (gambar, logo, dll)
│   ├── kemenag-512.png         # Logo utama Kemenag
│   ├── kemenag.svg             # Logo SVG
│   ├── kantor-kemenag.jpg      # Foto kantor (quality: 100)
│   └── ...
│
├── tests/                      # Vitest unit tests
├── next.config.mjs             # Konfigurasi Next.js
├── .env.local                  # Environment variables (JANGAN di-commit)
├── vercel.json                 # Konfigurasi Vercel
└── TODO.md                     # Daftar task yang belum selesai
```

---

## 5. Environment Variables

File: `.env.local` (tidak di-commit ke Git)

```env
# Database (Prisma)
DATABASE_URL="postgresql://user:pass@host:5432/db"
DIRECT_URL="postgresql://user:pass@host:5432/db"

# Supabase (Auth & Storage)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_CMS_BUCKET=cms-media
```

> **Untuk deploy ke Vercel**: semua env variable di atas HARUS ditambahkan di Vercel Dashboard → Project Settings → Environment Variables.

---

### Peran Supabase (Post-Migration)
- **Auth**: Mengelola user session dan login (src/lib/supabase/server.js).
- **Storage**: Menyimpan file media (berita, galeri, laporan) di bucket `cms-media`.
- **Database Host**: Menjadi infrastruktur fisik PostgreSQL.

### Peran Prisma (Primary)
- **Data Access**: Semua operasi CRUD ke database wajib menggunakan Prisma Client (`src/lib/prisma.js`).
- **Audit Log**: Log aktivitas admin otomatis menggunakan Prisma.
- **BigInt Serialization**: Semua response API wajib melalui helper `apiResponse` (src/lib/prisma-helpers.js) untuk menangani tipe data BigInt.
- **Transaction**: Gunakan `prisma.$transaction` untuk operasi multi-tabel (misal: hapus berita + galeri).

---

## 7. AI Chatbot

- **File backend**: `src/app/api/chat/route.js`
- **File frontend**: `src/components/features/chat/ChatWidget.js`
- **Model AI**: `gemini-flash-latest` (dengan fallback ke model lain jika gagal)
- **API**: Google Generative Language API v1beta
- **System Prompt**: Berisi identitas bot, aturan jawaban singkat (max 2-3 kalimat), dan pengetahuan lengkap tentang Kemenag Barito Utara (pimpinan, layanan, haji, nikah, kepegawaian, dll.). **Catatan**: Juga mencakup informasi pribadi pengembang (Bapak Nazilah) dan istrinya (Sintya Wati) sebagai bagian dari memori bot.
- **maxOutputTokens**: 400 token
- **Integrasi**: ChatWidget dipasang di `src/app/layout.js` (tersedia di semua halaman)
- **Quick Actions**: 4 pertanyaan populer muncul di awal chat

---

## 8. Konvensi Koding

### JavaScript (bukan TypeScript)
- Proyek ini menggunakan **JavaScript murni** (`.js` / `.jsx`), bukan TypeScript.
- Jangan tambahkan type annotation TypeScript kecuali diminta secara eksplisit.
- File komponen menggunakan ekstensi `.js`.

### React / Next.js
- Gunakan **Next.js App Router** (bukan Pages Router).
- Server Components by default. Tambahkan `"use client"` hanya jika benar-benar perlu interaktivitas.
- Gunakan `next/image` untuk semua gambar (optimasi otomatis).
- Kualitas gambar yang dikonfigurasi: `[100, 70, 75, 85]` (lihat `next.config.mjs`).
- API routes ada di `src/app/api/*/route.js`.

### Styling (Tailwind CSS v4)
- Gunakan Tailwind utility classes.
- Untuk komponen chatbot dan UI custom: boleh menggunakan **inline styles** jika diperlukan animasi dinamis.
- Skema warna utama: **Emerald** (`emerald-600`, `emerald-700`, dll.) — sesuai branding Kemenag.
- Dark mode didukung (toggle ada di navbar).

### Data Statis
- Data yang jarang berubah (nama pejabat, info kontak, layanan) disimpan di `src/data/*.js`.
- **JANGAN** hardcode data di komponen — selalu import dari `src/data/`.

### Komponen
- Komponen fitur spesifik → `src/components/features/[feature]/`.
- Komponen generik/reusable → `src/components/common/`.
- Komponen layout (header/footer) → `src/components/layout/`.
- **ATURAN WAJIB UI (Banner)**: Setiap halaman (terutama public pages) HARUS menggunakan `src/components/common/PageBanner.jsx` di bagian atas (sebagai pengganti Hero Section manual) untuk menjaga konsistensi visual *breadcrumb* dan *header*.
- **ATURAN WAJIB UI (Layout)**: Konten utama di bawah banner HARUS menggunakan kontainer *Full-Width* (mengalir bebas mengikuti *padding*) menggunakan `w-full px-6 sm:px-10 lg:px-16 xl:px-20`. DILARANG KERAS membatasi lebar konten dengan `max-w-*` yang menyisakan blank space tidak proporsional di tepi layar.

### API Routes
- Selalu gunakan `NextResponse` dari `next/server`.
- Selalu handle error dengan try-catch dan kembalikan response JSON yang informatif.
- Terapkan rate limiting untuk endpoint publik (gunakan `src/lib/rate-limit.js`).
- Validasi input di server-side (gunakan `src/lib/validation.js`).

---

## 9. Halaman & Routing

| Route | Deskripsi |
|---|---|
| `/` | Homepage |
| `/profil/[slug]` | Profil instansi (sejarah, visi-misi, dll.) |
| `/berita` | Daftar berita |
| `/berita/[slug]` | Detail berita |
| `/layanan` | Daftar layanan publik |
| `/layanan/[slug]` | Detail layanan per seksi |
| `/informasi/[slug]` | Informasi publik |
| `/laporan` | Laporan & akuntabilitas |
| `/laporan/[slug]` | Detail laporan dengan PDF viewer |
| `/galeri` | Galeri kegiatan |
| `/kontak` | Halaman kontak |
| `/survey` | Survey kepuasan layanan |
| `/ppid` | PPID (Pejabat Pengelola Informasi dan Dokumentasi) |
| `/zona-integritas/[slug]` | Zona Integritas |
| `/login` | Login admin |
| `/admin/*` | Dashboard admin (auth required) |
| `/api/chat` | POST — AI Chatbot endpoint |
| `/api/admin/*` | API admin (auth required) |

---

## 10. Fitur Admin Dashboard

- Hanya dapat diakses oleh email yang sudah terdaftar sebagai admin.
- Autentikasi via Supabase Auth (login di `/login`).
- Fitur admin: kelola berita, kelola galeri, kelola laporan/PDF, audit log.
- Session check di: `src/app/api/admin/session/route.js`.

---

## 11. Internasionalisasi (i18n)

- Website mendukung **2 bahasa**: Indonesia (default) dan English.
- Data terjemahan: `src/data/i18n.js`.
- Toggle bahasa ada di navbar (ID/EN).
- Semua teks UI yang tampil ke publik harus menggunakan data dari `i18n.js`.

---

## 12. SEO & Metadata

- Setiap halaman wajib memiliki metadata (title, description) menggunakan `export const metadata` atau `generateMetadata()`.
- Structured data (JSON-LD) dikelola di `src/lib/structured-data.js`.
- Sitemap otomatis: `src/app/sitemap.js`.
- Robots.txt: `src/app/robots.js`.

---

## 13. Keamanan

- Content Security Policy (CSP) dikonfigurasi di `next.config.mjs`.
- Rate limiting diterapkan di API publik.
- Input validation wajib di server-side.
- reCAPTCHA v2 digunakan di form kontak publik.
- Service Role Key Supabase **HANYA** digunakan di server-side, tidak pernah di client.
- File `.env.local` tidak boleh di-commit ke Git.

---

## 14. Hal yang JANGAN Dilakukan

- ❌ Jangan ubah ke TypeScript.
- ❌ Jangan install library icon besar (lucide-react, heroicons, dll.) — gunakan inline SVG.
- ❌ Jangan hardcode data organisasi di komponen, selalu gunakan `src/data/`.
- ❌ Jangan ekspos `SUPABASE_SERVICE_ROLE_KEY` ke client-side.
- ❌ Jangan hapus komentar yang sudah ada di kode tanpa alasan jelas.
- ❌ Jangan tambahkan `console.log` permanen di production code.
- ❌ Jangan ubah skema warna dari Emerald tanpa diskusi — ini branding resmi instansi.
- ❌ Jangan commit file `.env.local` ke Git.

---

## 15. Todo yang Masih Pending

Lihat `TODO.md` untuk daftar lengkap. Prioritas saat ini:
1. Optimasi loading PDF viewer di halaman `/laporan/[slug]`
2. Toolbar PDF (navigasi halaman, download)
3. Responsif PDF viewer di mobile

---

## 16. Kontak & Informasi Instansi

- **Instansi**: Kementerian Agama Kabupaten Barito Utara
- **Alamat**: Jl. Ahmad Yani No.126, Muara Teweh 73811, Kalimantan Tengah
- **Telepon**: (0519) 21269
- **Email**: kepegawaiankemenagbarut@gmail.com
- **Kepala Kantor**: H. Arbaja, S.Ag., M.A.P
- **Instagram**: @kemenag.barut
- **YouTube**: @KemenagBaritoUtara
