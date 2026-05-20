# TODO - Optimasi + Fitur Viewer PDF Laporan (Selesai)

- [x] 1. Optimasi loading preview PDF agar lebih cepat:
  - [x] Lazy mount viewer hanya saat dibuka
  - [x] Render bertahap (halaman awal dulu), bukan blocking semua halaman sekaligus
  - [x] Gunakan ukuran render responsif agar tidak terlalu berat
  - [x] Cegah re-render berulang yang tidak perlu

- [x] 2. Tambah toolbar viewer:
  - [x] Indikator Halaman X / Y
  - [x] Tombol Prev / Next
  - [x] Tombol Download dokumen (ikon + label)

- [x] 3. Tambah scroll internal pada area PDF:
  - [x] Container tinggi tetap
  - [x] Overflow vertikal aktif
  - [x] UX scroll halus untuk melihat halaman bawah

- [x] 4. Integrasi properti viewer dari daftar dokumen:
  - [x] Kirim `fileUrl` dan `title` dari `LaporanDocumentsClient` ke `PdfViewerClient`
  - [x] Rapikan fallback agar tetap inline (tidak memaksa tab baru)

- [x] 5. Critical-path testing halaman `/laporan/[slug]`:
  - [x] Buka/Tutup dokumen tetap normal
  - [x] Preview tampil lebih cepat
  - [x] Halaman X/Y tampil
  - [x] Prev/Next berfungsi
  - [x] Scroll internal berfungsi
  - [x] Download berfungsi

# TODO - Responsive PDF Viewer Mobile (Selesai)

- [x] 1. Rapikan toolbar PDF agar responsif dan compact di mobile
- [x] 2. Pastikan lebar halaman PDF selalu fit container tanpa scroll horizontal
- [x] 3. Tambahkan kontrol Fit + batas zoom aman untuk mobile
- [x] 4. Tuning container preview di `LaporanDocumentsClient` untuk padding mobile
- [x] 5. Uji critical-path mobile/tablet/desktop setelah perbaikan

# TODO - Prioritas Refactor Selanjutnya

- [ ] 1. Menyatukan source-of-truth data antara `src/data` dan database (Prisma)
- [ ] 2. Menjadikan skema database lebih disiplin melalui migration terstruktur (`prisma migrate dev`)
- [ ] 3. Peningkatan aksesibilitas (A11y) untuk keseluruhan halaman publik
- [ ] 4. Optimasi SEO & Metadata Dinamis pada halaman `/berita` dan `/informasi`
