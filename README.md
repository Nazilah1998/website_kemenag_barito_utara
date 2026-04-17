# Website Kemenag Barito Utara

Website resmi Kementerian Agama Kabupaten Barito Utara berbasis **Next.js App Router** dengan halaman publik, panel admin, integrasi Supabase, PWA, dan pengujian menggunakan Vitest.

## Teknologi utama

- Next.js 16
- React 19
- Supabase
- Tailwind CSS 4
- Vitest
- Vercel Analytics
- Vercel Speed Insights

## Struktur folder utama

```bash
.
├── docs/                 # dokumentasi teknis dan skema database
├── public/               # aset statis, manifest, service worker, offline page
├── src/
│   ├── app/              # routing App Router, halaman publik, admin, API route
│   ├── components/       # komponen UI publik dan admin
│   ├── context/          # global context, seperti tema dan bahasa
│   ├── data/             # data statis / fallback
│   └── lib/              # business logic, auth, validasi, helper domain, Supabase
├── tests/                # unit test & domain test
└── docs/schema.sql       # skema basis data
```

## Menjalankan proyek secara lokal

1. Install dependency:

```bash
npm install
```

2. Buat file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

3. Jalankan development server:

```bash
npm run dev
```

4. Buka browser ke:

```bash
http://localhost:3000
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

- Semua business logic dipusatkan di `src/lib`
- Semua halaman admin wajib melalui auth dan permission yang konsisten
- Data dinamis tidak boleh dijadikan source utama di `src/data`
- Perubahan database harus terdokumentasi dan terversi
- Fitur kritikal wajib memiliki test dasar

## Modul penting

### Halaman publik

Melayani informasi resmi instansi seperti profil, layanan, berita, galeri, laporan, ppid, kontak, dan zona integritas.

### Panel admin

Digunakan untuk mengelola konten dinamis seperti berita, halaman, dokumen laporan, audit, dan autentikasi admin.

### Integrasi database

Menggunakan Supabase untuk penyimpanan data dan storage dokumen, dengan fallback data statis pada beberapa modul tertentu.

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
