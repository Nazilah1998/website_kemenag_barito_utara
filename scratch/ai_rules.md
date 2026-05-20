# Aturan Penting Operasional AI (Antigravity)

Aturan-aturan berikut dibuat berdasarkan permintaan eksplisit dari USER dan **TIDAK BOLEH DILANGGAR** dalam kondisi apa pun:

1. **LARANGAN MENJALANKAN TERMINAL MANDIRI**:
   - AI **TIDAK BOLEH** menjalankan perintah terminal apa pun (seperti `npm`, `npx`, `git`, `prisma`, dll.) secara mandiri menggunakan `run_command` atau tools terminal lainnya.
   - Semua eksekusi perintah terminal harus diserahkan secara manual kepada USER.

2. **ALUR KERJA INTERAKTIF TERMINAL**:
   - Ketika ada kebutuhan untuk menjalankan perintah terminal (misalnya migrasi DB, install package, running test, build, dll.), AI harus **menuliskan instruksi perintah yang jelas** kepada USER di dalam chat.
   - USER akan menjalankan perintah tersebut secara manual di terminal mereka dan memberikan hasilnya (output/logs) kepada AI untuk ditindaklanjuti.

3. **FOKUS AI**:
   - AI harus berfokus penuh pada **brainstorming konsep, analisis kode, dan melakukan penulisan/modifikasi file kode sumber** (coding/refactoring) secara langsung.

4. **KONTROL OPERASI GIT**:
   - AI **TIDAK BOLEH** memberikan perintah Git (seperti `git add`, `git commit`, `git push`, dll.) atau menyuruh user melakukan apa pun dengan Git kecuali jika USER secara eksplisit meminta atau memberikan arahan terlebih dahulu.
   - Seluruh urusan terkait Git sepenuhnya menunggu arahan langsung dari USER.
