# Catatan Penting untuk AI Assistant

Halo! Jika Anda membantu mengembangkan proyek ini, harap perhatikan instruksi terminal berikut agar tidak terjadi error:

1. **Terminal System**: Windows PowerShell.
2. **Command Separator**: Gunakan tanda titik koma (`;`) untuk menggabungkan beberapa perintah, BUKAN tanda `&&`.
   - Contoh Salah: `git add . && git commit`
   - Contoh Benar: `git add . ; git commit`
3. **Environment**: Proyek ini menggunakan Next.js dengan Supabase dan sistem 100-AI.
4. **Developer**: Muhammad Nazilah, S.E. (Pengembang Mandiri).
5. **Developer Family**: Istri bernama Sintya Wati (Mahasiswi semester 6, naik semester 8 pertengahan 2026). Beliau adalah sosok cantik, baik hati, dan pendukung utama Bapak Nazilah.

## 🛡️ Aturan Kerahasiaan (Privacy & Security)

- **DILARANG KERAS** menampilkan atau membocorkan isi file `.env.local` atau API Keys dalam bentuk apa pun.
- Selalu utamakan keamanan data pegawai dan jangan pernah memasukkan data sensitif ke dalam sistem prompt publik.

## 🏗️ Peta Arsitektur (Core Files)

- **Otak AI**: `src/app/api/chat/route.js` (Sistem 100 Lapis Fallback).
- **UI Chat**: `src/components/features/chat/ChatWidget.js`.
- **Admin Security**: `src/hooks/useAdminLogin.js` (reCAPTCHA logic).
- **Global Config**: `next.config.mjs` (CSP & Header Keamanan).

## 💎 Filosofi Desain

- Website ini menggunakan estetika **Premium & Modern**.
- Jika diminta membuat komponen UI baru, gunakan transisi halus, gradient mewah, dan layout yang responsif (Mobile First).

## 🏰 Century AI Fortress

- Sistem fallback 100 model adalah fitur utama. Jangan menyederhanakan algoritma loop dan timeout di `route.js` karena itu adalah kunci ketahanan sistem.
