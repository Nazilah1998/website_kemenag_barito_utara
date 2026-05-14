# Website Kemenag Barito Utara

Website resmi Kementerian Agama Kabupaten Barito Utara berbasis **Next.js App Router** dengan halaman publik, panel admin, integrasi Supabase, PWA, dan pengujian menggunakan Vitest.

## Teknologi utama

- Next.js 16 (App Router)
- Prisma ORM
- Supabase (Auth & Storage)
- Tailwind CSS 4
- Vitest & Playwright
- Google Gemini AI (Chatbot)

## Struktur folder utama

```bash
.
├── prisma/               # Skema database & konfigurasi Prisma
├── public/               # Aset statis & manifest
├── src/
│   ├── app/              # Routing App Router & API routes
│   ├── components/       # Komponen UI (Public & Admin)
│   ├── context/          # State management (Bahasa, Tema)
│   ├── data/             # Data statis fallback
│   └── lib/              # Business logic, Prisma Client, Auth, Storage
├── tests/                # Unit test & E2E test
└── docs/                 # Dokumentasi tambahan
```

## Menjalankan proyek secara lokal

1. Install dependency:
```bash
npm install
```

2. Buat file `.env.local` dan tambahkan:
```env
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

3. Generate Prisma Client:
```bash
npx prisma generate
```

4. Jalankan development server:
```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run lint:fix
npm run typecheck
npm run test
npm run test:watch
npm run test:coverage
```

## Prinsip arsitektur proyek

- Semua akses database wajib melalui Prisma ORM.
- Semua API response harus konsisten (menggunakan `apiResponse` helper).
- Data sensitif tidak boleh diekspos ke client-side.
- Audit log otomatis mencatat setiap perubahan data di panel admin.
- Supabase khusus menangani Autentikasi dan Storage file.
- **Middleware (proxy.js)**: Karena menggunakan Next.js v16, sistem middleware wajib menggunakan file `proxy.js` (dengan fungsi `proxy`) di tingkat root atau `src/`, bukan `middleware.js`. Jangan mengubah ini karena akan memutus sistem sesi dan keamanan admin.
- **Konsistensi UI (Banner)**: Setiap halaman (terutama public pages) HARUS selalu menyertakan komponen `PageBanner` di bagian paling atas untuk menjaga keseragaman *header* dan *breadcrumb*.
- **Konsistensi UI (Layout)**: DILARANG menggunakan `max-w-*` untuk wrapper konten utama. Semua halaman WAJIB menggunakan format *Full-Width* mengikuti padding layar (`w-full px-6 sm:px-10 lg:px-16 xl:px-20`).

## Prioritas refactor berikutnya

- Merapikan modul admin laporan menjadi lebih modular
- Menyatukan source-of-truth data antara `src/data` dan database
- Menambah cakupan test untuk auth, laporan, dan route admin
- Menjadikan skema database lebih disiplin melalui migration terstruktur

## Catatan

Repository ini dikembangkan sebagai website institusi pemerintah, sehingga fokus utama bukan hanya tampilan, tetapi juga:

- kejelasan informasi,
- kestabilan data,
- kemudahan pengelolaan admin,
- aksesibilitas,
- dan kesiapan pengembangan jangka panjang.
