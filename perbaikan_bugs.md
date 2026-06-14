# Laporan Perbaikan & Bug — Portal Kemenag Barito Utara

> **Dibuat:** 15 Juni 2026
> **Metode:** Penelusuran kode menyeluruh (static analysis)

## ✅ Putaran 2 — Baru Saja Diperbaiki (Dead Code & Google Drive)

### Dead Code Dihapus (7 item)

| # | File | Keterangan |
|---|------|------------|
| 1 | `src/components/features/berita/BeritaListClient.jsx` | Dead component — tidak di-import |
| 2 | `src/hooks/useBeritaList.js` | Dead hook — hanya dipakai BeritaListClient |
| 3 | `src/components/features/berita/components/BeritaPublicFilters.jsx` | Dead component — cascade dari BeritaListClient |
| 4 | `src/components/features/berita/components/BeritaPublicCards.jsx` | Dead component — cascade dari BeritaListClient |
| 5 | `src/components/features/home/NewsSection.jsx` | Dead component — digantikan HomeNewsSection |
| 6 | `src/lib/berita.js:196-205` | `estimateReadingTime` duplikat (sudah ada di `berita-utils.js`) |
| 7 | `src/lib/berita.js:5` | Unused import `normalizeCoverImageUrl` |

### `toGoogleDriveDownloadUrl()` — Dihapus

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `src/app/berita/[slug]/page.js:28-40, 128` |
| **Masalah** | Fungsi dibuat untuk ekstrak file ID Google Drive. Setelah migrasi ke **Supabase Storage**, fungsi tidak berguna. Dead code. |
| **Perbaikan** | Fungsi + pemanggilannya dihapus. Link download langsung pakai `{coverImage}`. Import path juga dibersihkan (`../../../lib/berita` → `@/lib/berita`). |

---

## 🔴 Bagian Berita — BELUM Diperbaiki (18 item)

### 🔴 Kritis (4)

---

#### B1. Navigasi Artikel Sebelumnya/Selanjutnya Tidak Pernah Berfungsi

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `src/app/berita/[slug]/page.js:124` |
| **Root Cause** | `getAdjacentBerita(berita.slug)` dipanggil dengan **string slug**, bukan object berita. Fungsi mengecek `currentBerita?.isoDate` — karena string, `?.isoDate` undefined → langsung return `{ newer: null, older: null }`. |
| **Dampak** | Tombol "Artikel Sebelumnya" dan "Artikel Selanjutnya" **tidak pernah muncul**. Seluruh section adjacent navigation selalu hidden. |
| **Perbaikan** | Ubah `getAdjacentBerita(berita.slug)` → `getAdjacentBerita(berita)` |

---

#### B2. `dangerouslySetInnerHTML` Tanpa Sanitasi Ulang

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `src/app/berita/[slug]/page.js:180` |
| **Root Cause** | Konten di-render via `dangerouslySetInnerHTML={{ __html: berita.content || "" }}`. Sanitasi hanya saat admin **menyimpan**. Berita lama (sebelum sanitasi) atau impor bisa mengandung script berbahaya. Tidak ada sanitasi ulang di server. |
| **Dampak** | Potensi XSS (Cross-Site Scripting) pada halaman publik. |
| **Perbaikan** | Sanitasi ulang konten di server-side dengan `sanitizeEditorHtml()` atau DOMPurify sebelum render |

---

#### B3. `t("locale")` Bug — Terjemahan Tidak Berfungsi

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `src/components/features/berita/components/BeritaDetailActions.jsx:71` |
| **Root Cause** | `copied ? (t("locale") === "en" ? "Link copied" : "Tautan tersalin") : ...` — key `"locale"` tidak ada di object translasi. `t()` fallback ke string `"locale"`, kondisi `=== "en"` **selalu false**. |
| **Dampak** | Teks "Tautan tersalin" selalu muncul meskipun locale English. |
| **Perbaikan** | Gunakan `locale` langsung: `const { t, locale } = useLanguage();` lalu `locale === "en" ? ...` |

---

#### B4. Missing `error.js` untuk Route `/berita` dan `/berita/[slug]`

| Aspek | Detail |
|-------|--------|
| **Lokasi** | Tidak ada file di `src/app/berita/error.js` maupun `src/app/berita/[slug]/error.js` |
| **Root Cause** | `getAllBerita()` di listing punya try-catch, tapi `getBeritaBySlug()` di detail page (`page.js:107`) **tidak**. Jika koneksi DB terputus, throw error tidak tertangani. |
| **Dampak** | White screen / crash di production tanpa fallback UI. |
| **Perbaikan** | Buat `src/app/berita/error.js` dan `src/app/berita/[slug]/error.js` |

---

### 🟡 Sedang (3)

---

#### B5. Featured News + Pesan Arsip Kosong Kontradiktif

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `src/app/berita/page.js:92-105`, `src/components/features/berita/BeritaPageClient.jsx` |
| **Root Cause** | Jika hanya 1 hasil pencarian: `showFeatured = true` (tampilkan featured card), `paginatedNews` kosong karena sudah di-slice. User lihat featured card + pesan "Belum ada berita arsip lain". |
| **Skenario** | Cari keyword yang hanya cocok 1 berita → lihat pesan membingungkan |
| **Perbaikan** | Jika `totalResults <= 1` dan `showFeatured`, jangan tampilkan pesan "Belum ada berita arsip" |

---

#### B7. `buildPagination()` Duplikasi Logika

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `NewsPagination.jsx:41-55` dan `berita-utils.js:194-208` |
| **Root Cause** | Fungsi `buildPagination()` identik ditulis di dua tempat. |
| **Dampak** | Perubahan harus di dua tempat. Rawan inkonsistensi. |
| **Perbaikan** | Pindahkan ke shared utility (`berita-utils.js`) dan import di `NewsPagination.jsx` |

---

#### B8. Translation Key `berita.publicService` Mungkin Tidak Ada

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `src/components/features/berita/components/BeritaDetailHeader.jsx:11` |
| **Root Cause** | `eyebrow={t("berita.publicService")}` — jika key tidak ada di file i18n, `t()` fallback ke literal string. |
| **Dampak** | Teks "berita.publicService" muncul literal di PageBanner. |
| **Perbaikan** | Verifikasi key di file i18n, atau ganti dengan key yang sudah pasti ada |

---

### 🟢 Rendah / Aksesibilitas (5)

---

#### B9. Ukuran Font Terlalu Kecil

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `BeritaCards.jsx`, `BeritaViewsBadge.jsx`, `BeritaDetailLocalized.jsx`, `BeritaDetailNavigation.jsx`, `NewsPagination.jsx` |
| **Masalah** | Banyak `text-[9px]`, `text-[10px]`, `text-[11px]` — di bawah `text-xs` (12px). Font <12px sulit dibaca, berpotensi gagal WCAG AA. |
| **Perbaikan** | Naikkan minimal ke `text-xs` (12px) |

---

#### B10. Tombol Pagination Tanpa `aria-label` Spesifik

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `NewsPagination.jsx` |
| **Masalah** | Semua tombol halaman punya `aria-label` sama (`"berita pagination"`). Screen reader tidak bisa bedakan halaman. Tombol prev/next juga tidak punya label jelas. |
| **Perbaikan** | Tambah `aria-label={"Halaman " + page}` pada tiap tombol |

---

#### B11. Filter Mobile Toggle Tanpa `aria-expanded`

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `BeritaFilters.jsx:254` |
| **Masalah** | Tombol toggle filter mobile hanya `aria-label="Toggle Filters"`, tanpa `aria-expanded` atau `aria-controls`. |
| **Perbaikan** | Tambah `aria-expanded={isFilterOpen}` dan `aria-controls="filter-panel"` |

---

#### B12. Focus Indicator Tidak Terlihat pada Link Navigasi

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `BeritaDetailLocalized.jsx` (BackLink), `BeritaDetailNavigation.jsx` |
| **Masalah** | Link tidak memiliki `focus-visible:ring-*` atau `focus-visible:outline-*`. User keyboard tidak bisa melihat elemen fokus. |
| **Perbaikan** | Tambah `focus-visible:ring-2 focus-visible:ring-emerald-500` |

---

#### B13. Kategori di Sidebar Tidak Bisa Diklik

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `BeritaDetailLocalized.jsx:43` |
| **Masalah** | Kategori ditampilkan sebagai teks biasa, bukan link ke `/berita?category=X`. |
| **Perbaikan** | Bungkus dengan `<Link href={`/berita?category=${category}`}>` |

---

### 💡 Feature Gaps (6)

---

#### F1. Tidak Ada Tombol Share WhatsApp

| Lokasi | `BeritaDetailActions.jsx` |
|--------|---------------------------|
| **Masalah** | WhatsApp platform sharing terpopuler di Indonesia. `buildWhatsAppLink()` ada di `site.js` tapi tidak dipakai. |
| **Perbaikan** | Tambah tombol: `https://wa.me/?text=...` |

---

#### F2. Reading Time Tidak Ditampilkan

| Lokasi | `berita-utils.js:177` (fungsi ada), `page.js` (tidak dipanggil) |
|--------|----------------------------------------------------------------|
| **Masalah** | `estimateReadingTime` ada di `berita-utils.js` (dipakai admin) tapi tidak dipanggil di public detail page. |
| **Perbaikan** | Panggil di detail page dan tampilkan di sidebar |

---

#### F3. Author Berita Tidak Ditampilkan

| Lokasi | `berita.js` (`normalizeBerita`), `page.js` |
|--------|--------------------------------------------|
| **Masalah** | Tabel `berita` punya `author_id` (FK ke `profiles`), admin API mengirimnya, tapi public page tidak menampilkan. |
| **Perbaikan** | Select `author_id`/`author` di normalizeBerita, tampilkan di sidebar |

---

#### F5. Meta Description Statis Per-Pencarian

| Lokasi | `src/app/berita/page.js:48-68` |
|--------|--------------------------------|
| **Masalah** | Metadata tidak berubah meskipun user mencari dengan kata kunci. |
| **Perbaikan** | Generate description dinamis dari `searchParams.q` |

---

#### F6. Badge Kategori Bukan Link Filter

| Lokasi | `BeritaCards.jsx` |
|--------|-------------------|
| **Masalah** | Badge kategori di kartu berita adalah `<span>`, bukan link. |
| **Perbaikan** | Jadikan `<Link href={`/berita?category=${item.category}`}>` |

---

#### F7. Featured News Tidak Bisa Dismiss

| Lokasi | `BeritaPageClient.jsx` |
|--------|------------------------|
| **Masalah** | Featured card selalu muncul di halaman 1 dan tidak bisa ditutup. |
| **Perbaikan** | Tambah tombol dismiss + simpan preferensi di localStorage |

---

### 🧹 Code Quality (2)

---

#### Q1. `formatDate()` Didefinisikan di 4+ Tempat

| Lokasi | File |
|--------|------|
| `BeritaDetailLocalized.jsx` | lines 10-18 |
| `BeritaDetailNavigation.jsx` | lines 14-22 |
| `BeritaCards.jsx` | (inline) |
| `berita.js` | (dalam `normalizeBerita`) |

**Perbaikan:** Pindahkan ke shared utility `src/lib/date-utils.js`

---

#### Q3. `stripTags()` vs `stripHtml()` — Duplikasi Utility

| Aspek | Detail |
|-------|--------|
| **Lokasi** | `page.js:43` (`stripTags`) vs `berita-utils.js:89` (`stripHtml`) |
| **Masalah** | Dua fungsi dengan tujuan sama, implementasi berbeda. `stripHtml` lebih komprehensif (hapus script/style tag). |
| **Perbaikan** | Gunakan `stripHtml` dari `berita-utils.js`, hapus `stripTags` lokal |

---

## Ringkasan Keseluruhan

| Status | Jumlah | Item |
|--------|--------|------|
| ✅ Putaran 1 — Portal | 12 | Semua isu portal sudah diperbaiki |
| ✅ Putaran 2 — Dead Code | 8 | 5 file dihapus + 3 pembersihan kode |
| 🔴 **Kritis (belum)** | **4** | B1, B2, B3, B4 |
| 🟡 **Sedang (belum)** | **3** | B5, B7, B8 |
| 🟢 **Rendah/A11y (belum)** | **5** | B9, B10, B11, B12, B13 |
| 💡 **Feature Gap (belum)** | **6** | F1, F2, F3, F5, F6, F7 |
| 🧹 **Code Quality (belum)** | **2** | Q1, Q3 |
| **Sisa yang perlu diperbaiki** | **20** | |

---

*Dibuat dengan analisis statik pada 15 Juni 2026.*
