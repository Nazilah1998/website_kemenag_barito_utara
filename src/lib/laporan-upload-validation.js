const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["application/pdf"];
const ALLOWED_EXTENSIONS = [".pdf"];

export function sanitizeBaseFilename(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function hasAllowedPdfExtension(filename = "") {
  const lower = String(filename).toLowerCase().trim();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function validatePdfFile(file) {
  if (!file) {
    return { ok: false, message: "File PDF wajib dipilih." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, message: "Ukuran file melebihi batas 10 MB." };
  }

  if (!hasAllowedPdfExtension(file.name)) {
    return {
      ok: false,
      message: "Ekstensi file tidak valid. Hanya PDF yang diizinkan.",
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      ok: false,
      message: "Tipe file tidak valid. Hanya PDF yang diizinkan.",
    };
  }

  return { ok: true };
}

export function buildSafePdfFilename(originalName = "", prefix = "laporan") {
  const safeBase =
    sanitizeBaseFilename(originalName.replace(/\.pdf$/i, "")) || prefix;

  const unique =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `${prefix}-${safeBase}-${unique}.pdf`;
}

export function validateDocumentPayload(
  payload = {},
  { requireTitle = true } = {},
) {
  const title = String(payload.title || "").trim();
  const description = String(payload.description || "").trim();
  const yearRaw = String(payload.year || "").trim();

  if (requireTitle && !title) {
    return { ok: false, message: "Judul dokumen wajib diisi." };
  }

  if (title.length > 180) {
    return { ok: false, message: "Judul dokumen terlalu panjang." };
  }

  if (description.length > 2000) {
    return { ok: false, message: "Deskripsi dokumen terlalu panjang." };
  }

  if (yearRaw) {
    const year = Number(yearRaw);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return { ok: false, message: "Tahun dokumen tidak valid." };
    }
  }

  return {
    ok: true,
    data: {
      title,
      description,
      year: yearRaw || null,
      is_published: Boolean(payload.is_published),
    },
  };
}
