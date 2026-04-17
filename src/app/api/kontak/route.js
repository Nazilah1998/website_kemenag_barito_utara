import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_NAMA = 120;
const MAX_EMAIL = 180;
const MAX_SUBJEK = 160;
const MAX_PESAN = 4000;
const MIN_PESAN = 10;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function cleanString(value, max = 1000) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.slice(0, max);
}

function isValidEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email);
}

function jsonResponse(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

async function saveToSupabase(payload) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("kontak_pesan").insert(payload);

    if (error) {
      console.error("Gagal menyimpan pesan kontak:", error);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    // Supabase belum dikonfigurasi atau tabel belum ada.
    console.error("Supabase admin tidak tersedia:", error?.message);
    return { ok: false, error: error?.message };
  }
}

export async function POST(request) {
  const ip = getClientIp(request);
  const limit = await rateLimit({
    key: `kontak:${ip}`,
    limit: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!limit.ok) {
    return jsonResponse(
      {
        message:
          "Terlalu banyak permintaan. Silakan coba kembali beberapa saat lagi.",
        code: "RATE_LIMITED",
      },
      429,
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { message: "Body request tidak valid.", code: "INVALID_BODY" },
      400,
    );
  }

  // Honeypot: jika diisi berarti bot.
  if (cleanString(body?.website, 200)) {
    return jsonResponse({ message: "Pesan berhasil dikirim." }, 200);
  }

  const nama = cleanString(body?.nama, MAX_NAMA);
  const email = cleanString(body?.email, MAX_EMAIL).toLowerCase();
  const subjek = cleanString(body?.subjek, MAX_SUBJEK);
  const pesan = cleanString(body?.pesan, MAX_PESAN);

  const errors = [];

  if (!nama) errors.push({ field: "nama", message: "Nama wajib diisi." });
  if (nama && nama.length < 3)
    errors.push({ field: "nama", message: "Nama minimal 3 karakter." });

  if (!email) errors.push({ field: "email", message: "Email wajib diisi." });
  if (email && !isValidEmail(email))
    errors.push({ field: "email", message: "Format email tidak valid." });

  if (!pesan) errors.push({ field: "pesan", message: "Pesan wajib diisi." });
  if (pesan && pesan.length < MIN_PESAN)
    errors.push({
      field: "pesan",
      message: `Pesan minimal ${MIN_PESAN} karakter.`,
    });

  if (errors.length > 0) {
    return jsonResponse(
      {
        message: "Mohon periksa kembali data yang dikirim.",
        code: "VALIDATION_ERROR",
        errors,
      },
      400,
    );
  }

  const record = {
    nama,
    email,
    subjek: subjek || null,
    pesan,
    ip_address: ip,
    user_agent: request.headers.get("user-agent") || null,
    status: "baru",
  };

  const saved = await saveToSupabase(record);

  if (!saved.ok) {
    // Supabase gagal (mis. tabel belum ada). Log lokal agar pesan tidak hilang.
    console.info("[kontak] pesan diterima (fallback log):", record);
  }

  return jsonResponse({
    message:
      "Pesan berhasil dikirim. Tim kami akan menindaklanjuti pada jam layanan.",
    code: "OK",
  });
}

export async function GET() {
  return jsonResponse(
    { message: "Method not allowed.", code: "METHOD_NOT_ALLOWED" },
    405,
  );
}
