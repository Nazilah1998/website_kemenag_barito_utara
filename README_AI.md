# Catatan Penting untuk AI Assistant

Halo! Jika Anda membantu mengembangkan proyek ini, harap perhatikan instruksi terminal berikut agar tidak terjadi error:

1. **Terminal System**: Windows PowerShell.
2. **Command Separator**: Gunakan tanda titik koma (`;`) untuk menggabungkan beberapa perintah, BUKAN tanda `&&`.
   - Contoh Salah: `git add . && git commit`
   - Contoh Benar: `git add . ; git commit`
3. **Environment**: Proyek ini menggunakan Next.js dengan Prisma ORM (Primary DB) dan Supabase (Auth/Storage).
4. **Developer**: Muhammad Nazilah, S.E. (Pengembang Mandiri).
5. **Developer Family**: Istri bernama Sintya Wati (Mahasiswi semester 6, naik semester 8 pertengahan 2026). Beliau adalah sosok cantik, baik hati, dan pendukung utama Bapak Nazilah.
6. **Next.js Version (IMPORTANT)**: Proyek ini menggunakan **Next.js v16.x (Turbopack)**. 
   - **Wajib** menggunakan file `proxy.js` (dan fungsi `export async function proxy`) sebagai pengganti `middleware.js`. 
   - Jangan mencoba mengubahnya ke standar v14/v15 karena akan menyebabkan error `adapterFn is not a function`.

## 🛡️ Aturan Kerahasiaan (Privacy & Security)

- **DILARANG KERAS** menampilkan atau membocorkan isi file `.env.local`, `.env`, atau API Keys dalam bentuk apa pun.
- Selalu utamakan keamanan data pegawai dan jangan pernah memasukkan data sensitif ke dalam sistem prompt publik.

## 🏗️ Peta Arsitektur (Core Files)

- **Database (Prisma)**: `prisma/schema.prisma` (Source of Truth).
- **Prisma Client**: `src/lib/prisma.js` (Singleton Client).
- **API Helpers**: `src/lib/prisma-helpers.js` (Standarisasi response & BigInt).
- **Audit System**: `src/lib/audit.js` (Pencatatan aktivitas admin via Prisma).
- **Otak AI**: `src/app/api/chat/route.js` (Sistem 100 Lapis Fallback).
- **UI Chat**: `src/components/features/chat/ChatWidget.js`.
- **Admin Security**: `src/lib/cms-utils.js` (Middleware `validateAdmin`).
- **Global Config**: `next.config.mjs` (CSP & Header Keamanan).

## 💎 Filosofi Desain

- Website ini menggunakan estetika **Premium & Modern**.
- Jika diminta membuat komponen UI baru, gunakan transisi halus, gradient mewah, dan layout yang responsif (Mobile First).
- **ATURAN WAJIB KOMPONEN**: Setiap halaman utama atau sub-halaman publik harus dan WAJIB menggunakan komponen `PageBanner` (`src/components/common/PageBanner.jsx`) di bagian paling atas sebagai *header*. Jangan membuat *Hero Section* manual untuk menggantikannya.
- **ATURAN WAJIB LAYOUT**: JANGAN menggunakan batas maksimum lebar (seperti `max-w-5xl` atau `max-w-7xl`) untuk membungkus konten utama. Semua halaman wajib menggunakan layout *Full-Width* agar selaras dengan `PageBanner`, yaitu menggunakan class wrapper: `w-full px-6 sm:px-10 lg:px-16 xl:px-20`.

## 🏰 Century AI Fortress

- Sistem fallback 100 model adalah fitur utama. Jangan menyederhanakan algoritma loop dan timeout di `route.js` karena itu adalah kunci ketahanan sistem.
