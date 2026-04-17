export class ValidationError extends Error {
  constructor(
    message,
    { status = 400, errors = [], code = "VALIDATION_ERROR" } = {},
  ) {
    super(message);
    this.name = "ValidationError";
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

export function cleanString(value, max = 5000) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().replace(/\u0000/g, "");
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

export function cleanHtml(value, max = 50_000) {
  if (typeof value !== "string") return "";

  let html = value.trim().replace(/\u0000/g, "");

  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  html = html.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  html = html.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  html = html.replace(/javascript\s*:/gi, "");

  return html.length > max ? html.slice(0, max) : html;
}

export function toBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(normalized);
  }

  return false;
}

export function toSafeNumber(
  value,
  {
    field = "nilai",
    required = false,
    min = null,
    max = null,
    integer = false,
  } = {},
) {
  if (value === undefined || value === null || value === "") {
    if (required) {
      throw new ValidationError("Validasi gagal.", {
        errors: [{ field, message: `${field} wajib diisi.` }],
      });
    }
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new ValidationError("Validasi gagal.", {
      errors: [{ field, message: `${field} harus berupa angka yang valid.` }],
    });
  }

  if (integer && !Number.isInteger(parsed)) {
    throw new ValidationError("Validasi gagal.", {
      errors: [{ field, message: `${field} harus berupa bilangan bulat.` }],
    });
  }

  if (min !== null && parsed < min) {
    throw new ValidationError("Validasi gagal.", {
      errors: [{ field, message: `${field} minimal ${min}.` }],
    });
  }

  if (max !== null && parsed > max) {
    throw new ValidationError("Validasi gagal.", {
      errors: [{ field, message: `${field} maksimal ${max}.` }],
    });
  }

  return parsed;
}

export function toDocumentYear(
  value,
  { required = false, field = "tahun" } = {},
) {
  return toSafeNumber(value, {
    field,
    required,
    min: 2000,
    max: 2100,
    integer: true,
  });
}

export function toDateISO(value, { required = false, field = "tanggal" } = {}) {
  const raw = typeof value === "string" ? value.trim() : value;

  if (!raw) {
    if (required) {
      throw new ValidationError("Validasi gagal.", {
        errors: [{ field, message: `${field} wajib diisi.` }],
      });
    }
    return null;
  }

  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) {
    throw new ValidationError("Validasi gagal.", {
      errors: [{ field, message: `${field} tidak valid.` }],
    });
  }

  return parsed.toISOString();
}

export function requireFields(_obj, fields) {
  const errors = [];

  for (const item of fields) {
    const { field, value, label, min, max, type = "string" } = item;

    const displayLabel = label || field;

    if (value === undefined || value === null || value === "") {
      errors.push({
        field,
        message: `${displayLabel} wajib diisi.`,
      });
      continue;
    }

    if (type === "string" && typeof value === "string") {
      if (min && value.length < min) {
        errors.push({
          field,
          message: `${displayLabel} minimal ${min} karakter.`,
        });
      }

      if (max && value.length > max) {
        errors.push({
          field,
          message: `${displayLabel} maksimal ${max} karakter.`,
        });
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError("Validasi gagal.", { errors });
  }
}

export function oneOf(value, allowed, { field = "nilai", label } = {}) {
  if (value === undefined || value === null || value === "") return null;

  const normalized = String(value).trim();

  if (!allowed.includes(normalized)) {
    throw new ValidationError("Validasi gagal.", {
      errors: [
        {
          field,
          message: `${label || field} harus salah satu dari: ${allowed.join(", ")}.`,
        },
      ],
    });
  }

  return normalized;
}

export function isHttpsUrl(value, { allowedHosts = [] } = {}) {
  try {
    const url = new URL(String(value || "").trim());

    if (url.protocol !== "https:") return false;

    if (allowedHosts.length > 0 && !allowedHosts.includes(url.hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function isPdfFile(file) {
  if (!file) return false;

  const type = String(file?.type || "").toLowerCase();
  const name = String(file?.name || "").toLowerCase();

  return type === "application/pdf" || name.endsWith(".pdf");
}

export function validationErrorResponse(error) {
  return {
    body: {
      message: error?.message || "Validasi gagal.",
      code: error?.code || "VALIDATION_ERROR",
      errors: error?.errors || [],
    },
    status: error?.status || 400,
  };
}
