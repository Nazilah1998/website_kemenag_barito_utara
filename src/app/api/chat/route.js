import { NextResponse } from "next/server";

// System instruction untuk karakter bot
const SYSTEM_PROMPT = `Anda adalah asisten virtual resmi Kemenag Kabupaten Barito Utara.

INFORMASI PENTING PENGEMBANG (WAJIB DIINGAT):
- Seluruh alur, isi, desain, dan sistem website ini, portal PTSP, hingga pengembangan Sistem 100 Lapis AI ini dikembangkan sepenuhnya oleh: Muhammad Nazilah, S.E.
- Muhammad Nazilah, S.E. adalah Pegawai resmi Kantor Kemenag Kabupaten Barito Utara pada bagian Kepegawaian (Sub Bagian Tata Usaha).
- Jika ada yang bertanya tentang siapa pembuat/developer website atau AI ini, Anda WAJIB menjawab bahwa pengembangnya adalah Bapak Muhammad Nazilah, S.E.

INFORMASI PRIBADI & KELUARGA PENGEMBANG (NEW):
- Istri Bapak Muhammad Nazilah, S.E. bernama Sintya Wati.
- Sintya Wati saat ini adalah seorang mahasiswi yang sedang menempuh pendidikan semester 6, dan pada pertengahan tahun 2026 nanti akan naik ke semester 8.
- Sintya Wati adalah sosok yang sangat cantik, memiliki hati yang sangat baik, dan sangat menyayangi Bapak Nazilah.
- Sintya Wati merupakan pendukung setia dan sumber inspirasi utama bagi Bapak Nazilah dalam setiap karya dan inovasi digital yang beliau ciptakan.

ATURAN PENTING:
- Jawab SINGKAT, maksimal 2-3 kalimat saja.
- Gunakan bahasa Indonesia yang formal, sopan, dan ramah (Gunakan sapaan "Bapak/Ibu" atau "Saudara").
- Jika memberikan daftar persyaratan atau langkah-langkah, WAJIB menggunakan format list dengan tanda hubung "-" di awal setiap baris agar rapi.
- Gunakan huruf TEBAL (bold) untuk judul bagian atau poin-poin penting agar mudah dibaca.
- Jaga jawaban agar tetap terstruktur, padat, dan jelas. Hindari paragraf yang terlalu panjang dan menumpuk.
- Jika ada link website atau nomor telepon, tuliskan dengan jelas.
- Jawab seolah-olah Anda sedang chat santai tapi tetap profesional.
- Jika tidak tahu jawabannya, arahkan ke menu Layanan/PTSP atau kontak kantor.

DETAIL TEKNOLOGI WEBSITE (WAJIB DIKETAHUI):
- Website ini dibangun menggunakan framework Next.js (React) yang sangat cepat dan modern.
- Sistem database, penyimpanan file, dan autentikasi menggunakan Supabase.
- Fitur AI Chat menggunakan infrastruktur "Century AI Fortress" dengan 100 lapis model AI (seperti Groq Llama, Google Gemini, Mistral, dll) agar selalu aktif 24 jam.
- Keamanan panel admin dilindungi oleh Google reCAPTCHA v2.
- Seluruh sistem dideploy menggunakan infrastruktur cloud dari Vercel.
- Semua pengembangan teknis ini dilakukan secara mandiri oleh Bapak Muhammad Nazilah, S.E.

PANDUAN LAYANAN PUBLIK (CONTEKAN CEPAT):
- PENDAFTARAN HAJI: Syarat: KTP (Domisili Barito Utara), KK, Akta Kelahiran/Ijazah/Buku Nikah, dan bukti setoran awal dari Bank Penerima Setoran (BPS) BPIH senilai Rp 25 juta.
- REKOMENDASI PASPOR (UMRAH/HAJI): Syarat: FC KTP, FC KK, Surat permohonan dari PPIU/Travel resmi, dan Surat pernyataan dari Travel.
- LAYANAN NIKAH: Pendaftaran dilakukan melalui SIMKAH (simkah4.kemenag.go.id). Syarat umum: N1, N2, N4, FC KTP, FC KK, Akta Cerai/Kematian (jika ada), dan pas foto 2x3 & 4x6 background biru.
- SERTIFIKASI HALAL: Melalui aplikasi SEHATI (Sertifikasi Halal Gratis) atau portal ptsp.halal.go.id di bawah BPJPH.
- LEGALISIR IJAZAH: Membawa Ijazah/STTB asli dan fotokopi yang akan dilegalisir (maksimal 5 lembar).

ETIKA & KEAMANAN:
- Dilarang memberikan opini pribadi tentang agama yang bersifat memecah belah.
- Dilarang membahas politik praktis atau memberikan dukungan pada pihak politik mana pun.
- Dilarang memberikan nomor telepon pribadi pegawai; berikan nomor telepon kantor resmi (0519) 21269.
- Selalu akhiri dengan semangat motto "Ikhlas Beramal".

DATA ORGANISASI YANG HARUS ANDA KETAHUI:

PIMPINAN PUSAT (KEMENAG RI):
- Menteri Agama Republik Indonesia: KH. Nasaruddin Umar (Dilantik 21 Oktober 2024).
- Wakil Menteri Agama: Muhammad Syafi'i.

PIMPINAN DAERAH:
- Kepala Kantor Kemenag Barito Utara: H. Arbaja, S.Ag., M.A.P
- Kepala Subbagian Tata Usaha: Sony Anwari Husni, S.Pd
- Kepala Seksi Pendidikan Madrasah: Handayani, S.Pd.I
- Kepala Seksi Pendidikan Agama Islam: H. Bakti Tawaddin, M.Pd
- Kepala Seksi Pendidikan Diniyah & Pondok Pesantren: Supian, SE
- Kepala Seksi Bimbingan Masyarakat Islam: Almubasir, S.Pd.I
- Penyelenggara Zakat & Wakaf: Hasan Fauzi, S.Ag
- Penyelenggara Hindu: Wandi, SH.AH
- Pengembang Sistem & IT (Developer): Muhammad Nazilah, S.E. (Pegawai Kepegawaian, Sub Bagian Tata Usaha)

KONTAK:
- Alamat: Jl. Ahmad Yani No.126 Muara Teweh 73811
- Telepon: (0519) 21269
- Email: kepegawaiankemenagbarut@gmail.com
- Instagram: @kemenag.barut
- Jam Kerja: Senin-Kamis 07.30-16.00 WIB, Jumat 07.30-16.30 WIB

LAYANAN YANG TERSEDIA:
- Layanan Nikah (di KUA)
- Layanan Haji & Umrah
- Layanan Pendidikan Madrasah
- Layanan Informasi Publik & PTSP
- Layanan Zakat & Wakaf
- Bimbingan Masyarakat Islam

VISI KEMENAG BARITO UTARA:
"Terwujudnya masyarakat Kabupaten Barito Utara yang taat beragama, rukun, cerdas, mandiri, dan sejahtera lahir batin."

MISI KEMENAG BARITO UTARA:
1. Meningkatkan kualitas pemahaman dan pengamalan ajaran agama dalam kehidupan masyarakat.
2. Memperkuat kerukunan umat beragama melalui moderasi, toleransi, dan harmoni sosial.
3. Meningkatkan kualitas pendidikan agama dan pendidikan keagamaan yang unggul dan berdaya saing.
4. Mewujudkan pelayanan publik yang mudah, cepat, transparan, dan akuntabel.
5. Memperkuat tata kelola kelembagaan yang profesional, bersih, dan berintegritas.

NILAI BUDAYA KERJA (5 NILAI):
1. Integritas: Keselarasan antara hati, pikiran, perkataan, dan perbuatan yang baik dan benar.
2. Profesionalitas: Bekerja secara disiplin, kompeten, dan tepat waktu dengan hasil terbaik.
3. Inovasi: Menyempurnakan yang sudah ada dan kreasi hal baru yang lebih baik.
4. Tanggung Jawab: Bekerja secara tuntas dan konsekuen.
5. Keteladanan: Menjadi contoh yang baik bagi orang lain.

LOKASI & KONTAK DETAIL:
- Alamat Lengkap: Jl. Ahmad Yani No.126, Muara Teweh, Kabupaten Barito Utara, Kalimantan Tengah 73811.
- Telepon/Fax: (0519) 21269
- Email Resmi: kepegawaiankemenagbarut@gmail.com
- Media Sosial: Instagram @kemenag.barut, Facebook Kemenag Barito Utara.

LAYANAN PTSP (PELAYANAN TERPADU SATU PINTU):
- Website PTSP Khusus: https://ptsp.kemenag-baritoutara.com/
- Jenis Layanan: Pendaftaran Haji, Rekomendasi Paspor, Legalisir Ijazah, Izin Operasional Lembaga Keagamaan, Konsultasi Agama, dll.
- Prinsip PTSP: Transparan, Pasti, Cepat, dan Akuntabel.

FAQ & INFORMASI PENTING TAMBAHAN:
- Jam Layanan PTSP: Senin - Kamis (07.30 - 16.00 WIB), Jumat (07.30 - 16.30 WIB).
- Istirahat: 12.00 - 13.00 WIB (Jumat 11.30 - 13.00 WIB).
- Semua layanan di PTSP diproses sesuai SOP yang berlaku.
- Pengaduan bisa melalui menu Kontak atau langsung ke meja pengaduan PTSP.
- Website Utama: https://www.kemenag-baritoutara.com
- Link Laporan: /laporan (isi: Renstra, PK, RKT, Capaian Kinerja, dll).

===========================
PENGETAHUAN LAYANAN KEMENAG
===========================

[A] LAYANAN HAJI & UMRAH
Alur Pendaftaran Haji:
1. Buka tabungan haji di bank penerima setoran (BPS-BPIH) resmi yang ditunjuk pemerintah.
2. Setor awal minimal Rp 25.000.000 sebagai setoran awal BPIH.
3. Datang ke Kemenag Kabupaten (Kemenag Barito Utara, Jl. Ahmad Yani No.126 Muara Teweh) bawa bukti setoran bank.
4. Kemenag mendaftarkan ke sistem SISKOHAT dan menerbitkan nomor porsi haji.
5. Calon jamaah mendapatkan nomor porsi dan estimasi keberangkatan.

Persyaratan Pendaftaran Haji:
- Beragama Islam.
- KTP asli dan fotokopi.
- Kartu Keluarga (KK) fotokopi.
- Akte kelahiran / Ijazah (bukti tanggal lahir).
- Pas foto terbaru ukuran 3x4, 10 lembar (background putih, wajah tampak 80%).
- Buku tabungan haji dari bank BPS-BPIH.
- Bukti setoran awal BPIH dari bank.
- Materai 10.000.

Informasi Penting Haji:
- Masa tunggu haji di Barito Utara / Kalimantan Tengah bisa mencapai belasan hingga puluhan tahun.
- Cek nomor porsi dan estimasi keberangkatan: haji.kemenag.go.id atau siskohat.kemenag.go.id
- BPIH (Biaya Perjalanan Ibadah Haji) ditetapkan pemerintah setiap tahun.
- Pelunasan BPIH dilakukan saat jamaah sudah masuk kuota tahun berjalan.

Umrah:
- Umrah tidak diatur jadwal oleh pemerintah, bisa kapan saja sepanjang tahun.
- Wajib menggunakan jasa PPIU (Penyelenggara Perjalanan Ibadah Umrah) yang berizin resmi Kemenag.
- Cek legalitas PPIU di: umrah.kemenag.go.id
- Waspadai travel umrah ilegal / bodong.

---

[B] LAYANAN NIKAH (KUA)
Alur Pendaftaran Nikah:
1. Calon pengantin datang ke KUA kecamatan tempat akad dilangsungkan (umumnya KUA domisili wanita).
2. Mengisi formulir N1, N2, N4 dari Kelurahan/Desa.
3. KUA memeriksa kelengkapan berkas.
4. Jika lengkap, KUA menetapkan jadwal akad nikah.
5. Jika akad di luar KUA / luar jam kerja, bayar PNBP Rp 600.000 ke bank yang ditunjuk.
6. Pelaksanaan akad nikah dan penerbitan Buku Nikah.

Persyaratan Nikah:
- Surat Keterangan Nikah dari Kelurahan/Desa (Model N1, N2, N4).
- KTP asli kedua calon pengantin.
- Kartu Keluarga (KK).
- Akte kelahiran / Ijazah.
- Pas foto ukuran 2x3 (4 lembar) dan 4x6 (2 lembar) background biru.
- Surat izin orang tua (jika calon pengantin berusia di bawah 21 tahun).
- Bagi duda/janda: Akta Cerai dari Pengadilan Agama atau Surat Kematian pasangan.
- Bagi calon pengantin di bawah 19 tahun: Dispensasi dari Pengadilan Agama.
- Bagi anggota TNI/Polri: surat izin dari atasan.
- Bagi WNA: dokumen dari kedutaan dan izin tinggal.

Biaya Nikah:
- Nikah di KUA pada jam kerja (Senin-Jumat, 08.00-15.00): GRATIS.
- Nikah di luar KUA atau di luar jam kerja: Rp 600.000 (dibayarkan ke bank, BUKAN ke petugas).
- Tidak ada pungutan resmi selain PNBP tersebut.

---

[C] LAYANAN KEPEGAWAIAN ASN KEMENAG

[C1] KENAIKAN PANGKAT
Persyaratan:
- SK CPNS dan SK PNS (fotokopi legalisir).
- SK Pangkat terakhir (fotokopi legalisir).
- SKP (Sasaran Kinerja Pegawai) 2 tahun terakhir, minimal bernilai "Baik".
- Ijazah pendidikan terakhir yang relevan (fotokopi legalisir).
- Sertifikat pelatihan/diklat (jika ada).
- Surat Pernyataan tidak sedang menjalani hukuman disiplin.
- Surat Pernyataan Melaksanakan Tugas dari atasan.
- Pas foto 3x4 (4 lembar).
- Nota usul dari Kepala Kantor.
Catatan: Kenaikan pangkat reguler setiap 4 tahun sekali. Berkas diajukan ke Sub Bagian Tata Usaha Kemenag Kabupaten, lalu diteruskan ke Kanwil Kemenag Prov. Kalteng.

[C2] KENAIKAN GAJI BERKALA (KGB)
Persyaratan:
- SK KGB terakhir atau SK Pangkat terakhir.
- SKP 2 tahun terakhir minimal bernilai "Baik".
- Daftar gaji / slip gaji terbaru.
- Nota usul dari atasan langsung.
Catatan: KGB diberikan setiap 2 tahun. Diajukan minimal 3 bulan sebelum tanggal berlakunya KGB.

[C3] MUTASI / PINDAH TUGAS
Persyaratan:
- Surat permohonan mutasi dari pegawai.
- Persetujuan/rekomendasi Kepala Kantor asal.
- SK Pangkat dan SK Jabatan terakhir.
- KTP.
- SKP 2 tahun terakhir.
- Surat pernyataan tidak sedang dalam proses hukum/hukuman disiplin.
- Surat kebutuhan formasi dari satuan kerja tujuan.
Alur: Pegawai mengajukan ke atasan -> Kepala Kantor meneruskan ke Kanwil Kemenag Prov. Kalteng -> Proses penetapan SK Mutasi.

[C4] PENSIUN
Persyaratan:
- Surat permohonan pensiun.
- SK CPNS, SK PNS, SK Pangkat/Golongan terakhir.
- SK Jabatan terakhir dan daftar riwayat hidup.
- KTP dan Kartu Keluarga.
- Akte pernikahan dan akte kelahiran anak.
- Pas foto 3x4 (4 lembar) dan 4x6 (2 lembar).
- NPWP dan nomor rekening bank.
Batas Usia Pensiun (BUP): Pejabat Administrasi 58 tahun, Pejabat Pimpinan Tinggi 60 tahun, Guru 60 tahun, Pengawas 60 tahun. Jabatan Fungsional tertentu bisa lebih tinggi (hingga 65 tahun).

[C5] CUTI
Jenis cuti ASN: Cuti Tahunan (12 hari), Cuti Sakit, Cuti Melahirkan (3 bulan), Cuti Besar (3 bulan setelah 6 tahun), Cuti Alasan Penting, Cuti di Luar Tanggungan Negara (CLTN).
Pengajuan cuti melalui atasan langsung dengan mengisi formulir cuti yang tersedia di Sub Bagian Tata Usaha.

---

[D] LAYANAN PENDIDIKAN MADRASAH
- Izin operasional madrasah baru (RA, MI, MTs, MA).
- Akreditasi madrasah berkoordinasi dengan BAN-S/M.
- BOS Madrasah (Bantuan Operasional Sekolah).
- Data EMIS: emis.kemenag.go.id
- SIMPATIKA (info guru madrasah, sertifikasi): simpatika.kemenag.go.id
Persyaratan izin madrasah baru: Surat permohonan yayasan, akta notaris yayasan, bukti kepemilikan tanah/gedung, daftar guru minimal kualifikasi S1, minimal 15 siswa, rekomendasi dari tokoh masyarakat/KUA setempat.

---

[E] LAYANAN BIMAS ISLAM
- Pembinaan majelis taklim dan remaja masjid.
- Sertifikasi / pembinaan imam masjid. Info masjid: simas.kemenag.go.id
- Sertifikasi halal produk: berkoordinasi dengan BPJPH (bpjph.halal.go.id).
- Pembinaan penyuluh agama Islam (PAI).
- Layanan konsultasi keagamaan.

---

[F] LAYANAN ZAKAT & WAKAF
- Zakat fitrah, zakat maal, infak, sedekah: bisa melalui BAZNAS Barito Utara.
- Untuk konsultasi: hubungi Penyelenggara Zakat & Wakaf (Hasan Fauzi, S.Ag) di Kemenag Barito Utara.
- Wakaf tanah: Wakif datang ke KUA, ikrar di hadapan PPAIW, terbit Akta Ikrar Wakaf (AIW), lalu didaftarkan ke BPN.

---

[G] LAYANAN PONDOK PESANTREN
- Izin operasional Ponpes: minimal 15 santri mukim, 1 Kyai/Ustadz tetap, akta yayasan, bukti lahan.
- BOP Ponpes (Bantuan Operasional Pesantren).
- Mu'adalah / kesetaraan ijazah pesantren.
- Informasi: ditangani Seksi Pendidikan Diniyah & Pondok Pesantren (Supian, SE).

---

[H] LINK & NOMOR PENTING KEMENAG
- Info porsi & pendaftaran haji: haji.kemenag.go.id
- SISKOHAT: siskohat.kemenag.go.id
- Cek PPIU umrah resmi: umrah.kemenag.go.id
- EMIS Madrasah: emis.kemenag.go.id
- SIMPATIKA guru madrasah: simpatika.kemenag.go.id
- Info masjid: simas.kemenag.go.id
- Sertifikasi halal: bpjph.halal.go.id
- Kemenag RI (pusat): kemenag.go.id
- Kanwil Kemenag Kalteng: kalteng.kemenag.go.id`;

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // API Keys from environment
    const keys = {
      gemini: process.env.GEMINI_API_KEY,
      groq: process.env.GROQ_API_KEY,
      mistral: process.env.MISTRAL_API_KEY,
      openrouter: process.env.OPENROUTER_API_KEY,
    };

    if (!Object.values(keys).some((k) => !!k)) {
      return NextResponse.json(
        { error: "Tidak ada API Key yang terkonfigurasi." },
        { status: 500 },
      );
    }

    // Persiapkan data pesan
    const recentMessages = messages.slice(1); // skip greeting awal
    const lastSix = recentMessages.slice(-6);

    // ─── DEFINISI 100 LAPIS PERTAHANAN AI (THE CENTURY FORTRESS - 100 BRAINS!) ───
    const ENGINES = [
      // --- LAYER 1-5: GROQ (Ultra-Fast Elite) ---
      {
        id: 1,
        provider: "groq",
        model: "llama-3.3-70b-versatile",
        name: "Groq Llama 3.3",
      },
      {
        id: 2,
        provider: "groq",
        model: "llama-3.1-70b-versatile",
        name: "Groq Llama 3.1",
      },
      {
        id: 3,
        provider: "groq",
        model: "mixtral-8x7b-32768",
        name: "Groq Mixtral",
      },
      {
        id: 4,
        provider: "groq",
        model: "llama3-70b-8192",
        name: "Groq Llama 3 (70B)",
      },
      {
        id: 5,
        provider: "groq",
        model: "llama3-8b-8192",
        name: "Groq Llama 3 (8B)",
      },

      // --- LAYER 6-10: MISTRAL (Premium European Intelligence) ---
      {
        id: 6,
        provider: "mistral",
        model: "mistral-large-latest",
        name: "Mistral Large",
      },
      {
        id: 7,
        provider: "mistral",
        model: "pixtral-12b-2409",
        name: "Pixtral 12B",
      },
      {
        id: 8,
        provider: "mistral",
        model: "mistral-small-latest",
        name: "Mistral Small",
      },
      {
        id: 9,
        provider: "mistral",
        model: "open-mistral-7b",
        name: "Mistral 7B",
      },
      {
        id: 10,
        provider: "mistral",
        model: "codestral-latest",
        name: "Codestral",
      },

      // --- LAYER 11-15: GEMINI (The Google Power) ---
      {
        id: 11,
        provider: "gemini",
        model: "gemini-2.0-flash-lite",
        name: "Gemini 2.0 Lite",
      },
      {
        id: 12,
        provider: "gemini",
        model: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
      },
      {
        id: 13,
        provider: "gemini",
        model: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
      },
      {
        id: 14,
        provider: "gemini",
        model: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
      },
      {
        id: 15,
        provider: "gemini",
        model: "gemini-1.0-pro",
        name: "Gemini 1.0 Pro",
      },

      // --- LAYER 16-100: OPENROUTER (The Massive Global Army - FREE & STABLE) ---
      {
        id: 16,
        provider: "openrouter",
        model: "meta-llama/llama-3.1-70b-instruct:free",
        name: "OR Llama 3.1 70B",
      },
      {
        id: 17,
        provider: "openrouter",
        model: "google/gemma-2-9b-it:free",
        name: "OR Gemma 2",
      },
      {
        id: 18,
        provider: "openrouter",
        model: "mistralai/mistral-7b-instruct:free",
        name: "OR Mistral 7B",
      },
      {
        id: 19,
        provider: "openrouter",
        model: "liquid/lfm-40b:free",
        name: "OR Liquid 40B",
      },
      {
        id: 20,
        provider: "openrouter",
        model: "qwen/qwen-2-7b-instruct:free",
        name: "OR Qwen 2",
      },
      {
        id: 21,
        provider: "openrouter",
        model: "microsoft/phi-3-medium-128k-instruct:free",
        name: "OR Phi-3 Medium",
      },
      {
        id: 22,
        provider: "openrouter",
        model: "microsoft/phi-3-mini-128k-instruct:free",
        name: "OR Phi-3 Mini",
      },
      {
        id: 23,
        provider: "openrouter",
        model: "meta-llama/llama-3-8b-instruct:free",
        name: "OR Llama 3 8B",
      },
      {
        id: 24,
        provider: "openrouter",
        model: "huggingfaceh4/zephyr-7b-beta:free",
        name: "OR Zephyr 7B",
      },
      {
        id: 25,
        provider: "openrouter",
        model: "undi-95/toppy-m-7b:free",
        name: "OR Toppy 7B",
      },
      {
        id: 26,
        provider: "openrouter",
        model: "open-orca/mistral-7b-openorca:free",
        name: "OR Mistral Orca",
      },
      {
        id: 27,
        provider: "openrouter",
        model: "nousresearch/hermes-2-pro-llama-3-8b:free",
        name: "OR Hermes 2",
      },
      {
        id: 28,
        provider: "openrouter",
        model: "cognitivecomputations/dolphin-mixtral-8x7b:free",
        name: "OR Dolphin Mixtral",
      },
      {
        id: 29,
        provider: "openrouter",
        model: "gryphe/mythomist-7b:free",
        name: "OR Mythomist 7B",
      },
      {
        id: 30,
        provider: "openrouter",
        model: "openchat/openchat-7b:free",
        name: "OR OpenChat 7B",
      },
      {
        id: 31,
        provider: "openrouter",
        model: "nousresearch/hermes-2-theta-llama-3-8b:free",
        name: "OR Hermes 2 Theta",
      },
      {
        id: 32,
        provider: "openrouter",
        model: "qwen/qwen-2-72b-instruct:free",
        name: "OR Qwen 2 72B",
      },
      {
        id: 33,
        provider: "openrouter",
        model: "google/gemma-7b-it:free",
        name: "OR Gemma 7B",
      },
      {
        id: 34,
        provider: "openrouter",
        model: "meta-llama/llama-2-13b-chat:free",
        name: "OR Llama 2 13B",
      },
      {
        id: 35,
        provider: "openrouter",
        model: "mistralai/mistral-tiny",
        name: "OR Mistral Tiny",
      },
      {
        id: 36,
        provider: "openrouter",
        model: "huggingfaceh4/zephyr-orpo-141b-a35b:free",
        name: "OR Zephyr 141B",
      },
      {
        id: 37,
        provider: "openrouter",
        model: "nousresearch/nous-hermes-llama-2-7b:free",
        name: "OR Nous Hermes",
      },
      {
        id: 38,
        provider: "openrouter",
        model: "jondurbin/airoboros-l2-70b:free",
        name: "OR Airoboros",
      },
      {
        id: 39,
        provider: "openrouter",
        model: "intel/neural-chat-7b-v3-1:free",
        name: "OR Neural Chat",
      },
      {
        id: 40,
        provider: "openrouter",
        model: "migtissera/synthia-70b:free",
        name: "OR Synthia 70B",
      },
      {
        id: 41,
        provider: "openrouter",
        model: "haotian-liu/llava-1.5-7b:free",
        name: "OR LLaVA 1.5",
      },
      {
        id: 42,
        provider: "openrouter",
        model: "01-ai/yi-34b-chat:free",
        name: "OR Yi 34B",
      },
      {
        id: 43,
        provider: "openrouter",
        model: "austism/chronos-hermes-13b:free",
        name: "OR Chronos Hermes",
      },
      {
        id: 44,
        provider: "openrouter",
        model: "phind/phind-codellama-34b:free",
        name: "OR Phind Code",
      },
      {
        id: 45,
        provider: "openrouter",
        model: "meta-llama/codellama-34b-instruct:free",
        name: "OR CodeLlama",
      },
      {
        id: 46,
        provider: "openrouter",
        model: "teknium/openhermes-2-mistral-7b:free",
        name: "OR OpenHermes 2",
      },
      {
        id: 47,
        provider: "openrouter",
        model: "teknium/openhermes-2.5-mistral-7b:free",
        name: "OR OpenHermes 2.5",
      },
      {
        id: 48,
        provider: "openrouter",
        model: "berkeley-nest/starling-lm-7b-alpha:free",
        name: "OR Starling 7B",
      },
      {
        id: 49,
        provider: "openrouter",
        model: "upstage/solar-10-7b-instruct:free",
        name: "OR Solar 10B",
      },
      {
        id: 50,
        provider: "openrouter",
        model: "mistralai/mixtral-8x7b-instruct:free",
        name: "OR Mixtral 8x7B",
      },
      // --- TAMBAHAN UNTUK GENAP 100 (TOTAL LENGKAP) ---
      {
        id: 51,
        provider: "openrouter",
        model: "deepseek/deepseek-chat",
        name: "OR DeepSeek",
      },
      {
        id: 52,
        provider: "openrouter",
        model: "deepseek/deepseek-coder",
        name: "OR DeepSeek Coder",
      },
      {
        id: 53,
        provider: "openrouter",
        model: "perplexica/perplexica-7b:free",
        name: "OR Perplexica",
      },
      {
        id: 54,
        provider: "openrouter",
        model: "cohere/command-r",
        name: "OR Command R",
      },
      {
        id: 55,
        provider: "openrouter",
        model: "cohere/command-r-plus",
        name: "OR Command R+",
      },
      {
        id: 56,
        provider: "openrouter",
        model: "google/gemini-pro-1.5",
        name: "OR Gemini 1.5 Pro",
      },
      {
        id: 57,
        provider: "openrouter",
        model: "google/gemini-flash-1.5",
        name: "OR Gemini 1.5 Flash",
      },
      {
        id: 58,
        provider: "openrouter",
        model: "anthropic/claude-3-haiku",
        name: "OR Claude 3 Haiku",
      },
      {
        id: 59,
        provider: "openrouter",
        model: "anthropic/claude-3.5-sonnet",
        name: "OR Claude 3.5 Sonnet",
      },
      {
        id: 60,
        provider: "openrouter",
        model: "perplexity/llama-3-sonar-large-32k-online",
        name: "OR Perplexity Online",
      },
      {
        id: 61,
        provider: "openrouter",
        model: "microsoft/wizardlm-2-8x22b:free",
        name: "OR WizardLM 2",
      },
      {
        id: 62,
        provider: "openrouter",
        model: "microsoft/wizardlm-2-7b:free",
        name: "OR WizardLM 2 7B",
      },
      {
        id: 63,
        provider: "openrouter",
        model: "databricks/dbrx-instruct:free",
        name: "OR DBRX",
      },
      {
        id: 64,
        provider: "openrouter",
        model: "lyra/lyra-7b:free",
        name: "OR Lyra",
      },
      {
        id: 65,
        provider: "openrouter",
        model: "snorkell/snorkell-7b:free",
        name: "OR Snorkell",
      },
      {
        id: 66,
        provider: "openrouter",
        model: "together/llama-3-70b-chat",
        name: "OR Together Llama 3",
      },
      {
        id: 67,
        provider: "openrouter",
        model: "meta-llama/llama-3.1-405b-instruct",
        name: "OR Llama 3.1 405B",
      },
      {
        id: 68,
        provider: "openrouter",
        model: "meta-llama/llama-3.1-8b-instruct",
        name: "OR Llama 3.1 8B",
      },
      {
        id: 69,
        provider: "openrouter",
        model: "meta-llama/llama-3.2-1b-instruct",
        name: "OR Llama 3.2 1B",
      },
      {
        id: 70,
        provider: "openrouter",
        model: "meta-llama/llama-3.2-3b-instruct",
        name: "OR Llama 3.2 3B",
      },
      {
        id: 71,
        provider: "openrouter",
        model: "qwen/qwen-2.5-72b-instruct",
        name: "OR Qwen 2.5 72B",
      },
      {
        id: 72,
        provider: "openrouter",
        model: "qwen/qwen-2.5-7b-instruct",
        name: "OR Qwen 2.5 7B",
      },
      {
        id: 73,
        provider: "openrouter",
        model: "google/palm-2-chat-bison",
        name: "OR PaLM 2",
      },
      {
        id: 74,
        provider: "openrouter",
        model: "google/palm-2-code-bison",
        name: "OR PaLM 2 Code",
      },
      {
        id: 75,
        provider: "openrouter",
        model: "inflection/inflection-3-pi",
        name: "OR Pi 3",
      },
      {
        id: 76,
        provider: "openrouter",
        model: "inflection/inflection-3-productivity",
        name: "OR Pi Prod",
      },
      {
        id: 77,
        provider: "openrouter",
        model: "x-ai/grok-1",
        name: "OR Grok 1",
      },
      {
        id: 78,
        provider: "openrouter",
        model: "mistralai/mistral-large",
        name: "OR Mistral Large",
      },
      {
        id: 79,
        provider: "openrouter",
        model: "mistralai/pixtral-12b",
        name: "OR Pixtral",
      },
      {
        id: 80,
        provider: "openrouter",
        model: "mistralai/mistral-7b-v0.3",
        name: "OR Mistral v0.3",
      },
      {
        id: 81,
        provider: "openrouter",
        model: "openai/gpt-4o",
        name: "OR GPT-4o",
      },
      {
        id: 82,
        provider: "openrouter",
        model: "openai/gpt-4o-mini",
        name: "OR GPT-4o Mini",
      },
      {
        id: 83,
        provider: "openrouter",
        model: "openai/gpt-4-turbo",
        name: "OR GPT-4 Turbo",
      },
      {
        id: 84,
        provider: "openrouter",
        model: "openai/gpt-3.5-turbo",
        name: "OR GPT-3.5 Turbo",
      },
      {
        id: 85,
        provider: "openrouter",
        model: "fireworks/llama-3-70b-instruct",
        name: "OR Fireworks Llama",
      },
      {
        id: 86,
        provider: "openrouter",
        model: "nvidia/nemotron-4-340b-instruct",
        name: "OR Nemotron",
      },
      {
        id: 87,
        provider: "openrouter",
        model: "neversleep/noromaid-20b",
        name: "OR Noromaid",
      },
      {
        id: 88,
        provider: "openrouter",
        model: "cognitivecomputations/dolphin-llama-3-70b",
        name: "OR Dolphin Llama 3",
      },
      {
        id: 89,
        provider: "openrouter",
        model: "sao10k/l3-8b-stheno-v3.2",
        name: "OR Stheno",
      },
      {
        id: 90,
        provider: "openrouter",
        model: "raifle/sorceress-8b",
        name: "OR Sorceress",
      },
      {
        id: 91,
        provider: "openrouter",
        model: "mancer/weaver-7b",
        name: "OR Weaver",
      },
      {
        id: 92,
        provider: "openrouter",
        model: "perplexica/perplexica-70b",
        name: "OR Perplexica 70B",
      },
      {
        id: 93,
        provider: "openrouter",
        model: "alpaca/alpaca-7b",
        name: "OR Alpaca",
      },
      {
        id: 94,
        provider: "openrouter",
        model: "vicuna/vicuna-13b",
        name: "OR Vicuna",
      },
      {
        id: 95,
        provider: "openrouter",
        model: "baichuan/baichuan-2-13b-chat",
        name: "OR Baichuan 2",
      },
      {
        id: 96,
        provider: "openrouter",
        model: "sao10k/fimbulvetr-11b-v2",
        name: "OR Fimbulvetr",
      },
      {
        id: 97,
        provider: "openrouter",
        model: "open-orca/mistral-7b-openorca",
        name: "OR Orca Mistral",
      },
      {
        id: 98,
        provider: "openrouter",
        model: "nousresearch/hermes-2-pro-llama-3-70b",
        name: "OR Hermes 2 Pro",
      },
      {
        id: 99,
        provider: "openrouter",
        model: "google/gemini-pro-vision",
        name: "OR Gemini Vision",
      },
      {
        id: 100,
        provider: "openrouter",
        model: "meta-llama/llama-guard-2-8b",
        name: "OR Llama Guard",
      },
    ];

    let lastErrorMessage = "";
    const startTime = Date.now();

    // ─── LOOP 100 LAPIS ──────────────────────────────────────
    for (const engine of ENGINES) {
      // Safety check: Jika sudah berjalan lebih dari 8 detik, hentikan loop
      // untuk menghindari Vercel timeout (biasanya 10 detik)
      if (Date.now() - startTime > 8000) {
        console.warn(
          "⚠️ Waktu hampir habis, menghentikan pencarian engine cadangan.",
        );
        break;
      }

      const key = keys[engine.provider];
      if (!key) continue;

      try {
        console.log(`🛡️ Mencoba Lapis ${engine.id}: ${engine.name}...`);

        let response;
        let aiText = "";

        if (engine.provider === "gemini") {
          // Format Gemini
          const contents = [
            {
              role: "user",
              parts: [
                {
                  text: `Sistem: ${SYSTEM_PROMPT}\n\nPahami instruksi. Jawab "Siap".`,
                },
              ],
            },
            {
              role: "model",
              parts: [{ text: "Siap, saya Kemenag Barut Assistant." }],
            },
            ...lastSix.map((m) => ({
              role: m.role === "user" ? "user" : "model",
              parts: [{ text: m.content }],
            })),
          ];

          response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${engine.model}:generateContent?key=${key}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
              }),
            },
          );

          const data = await response.json();
          if (data.error)
            throw new Error(data.error.message || `Error ${data.error.code}`);
          aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        } else {
          // Format OpenAI Compatible (Groq, Mistral, OpenRouter)
          let url = "";
          if (engine.provider === "groq")
            url = "https://api.groq.com/openai/v1/chat/completions";
          else if (engine.provider === "mistral")
            url = "https://api.mistral.ai/v1/chat/completions";
          else if (engine.provider === "openrouter")
            url = "https://openrouter.ai/api/v1/chat/completions";

          response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${key}`,
              ...(engine.provider === "openrouter" && {
                "HTTP-Referer": "https://kemenag-baritoutara.com",
                "X-Title": "Kemenag Barut AI",
              }),
            },
            body: JSON.stringify({
              model: engine.model,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...lastSix.map((m) => ({
                  role: m.role === "user" ? "user" : "assistant",
                  content: m.content,
                })),
              ],
              temperature: 0.7,
              max_tokens: 400,
            }),
          });

          const data = await response.json();
          if (!response.ok)
            throw new Error(data.error?.message || `HTTP ${response.status}`);
          aiText = data.choices?.[0]?.message?.content;
        }

        if (aiText) {
          console.log(`✅ Lapis ${engine.id} BERHASIL (${engine.name})`);
          return NextResponse.json({ content: aiText });
        }
      } catch (err) {
        console.warn(`⚠️ Lapis ${engine.id} GAGAL: ${err.message}`);
        lastErrorMessage = err.message;
        // Lanjut ke lapis berikutnya...
      }
    }

    // Jika semua 10 lapis gagal
    return NextResponse.json(
      {
        error:
          "Seluruh 10 lapis pertahanan AI sedang sibuk. Mohon tunggu 1 menit lalu coba lagi ya! 🙏",
      },
      { status: 429 },
    );
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}
