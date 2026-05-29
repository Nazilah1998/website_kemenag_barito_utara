export class ValidationError extends Error {
  status: number;
  errors: Array<{ field: string; message: string }>;
  code: string;

  constructor(
    message: string,
    { status = 400, errors = [], code = "VALIDATION_ERROR" }: {
      status?: number;
      errors?: Array<{ field: string; message: string }>;
      code?: string;
    } = {},
  ) {
    super(message);
    this.name = "ValidationError";
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

export function cleanString(value: unknown, max = 5000): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().replace(/\u0000/g, "").replace(/\s+/g, " ");
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

export function cleanHtml(value: unknown, max = 50_000): string {
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

export function toBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(normalized);
  }

  return false;
}

export function toSafeNumber(
  value: unknown,
  {
    field = "nilai",
    required = false,
    min = null,
    max = null,
    integer = false,
  }: {
    field?: string;
    required?: boolean;
    min?: number | null;
    max?: number | null;
    integer?: boolean;
  } = {},
): number | null {
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
  value: unknown,
  { required = false, field = "tahun" }: { required?: boolean; field?: string } = {},
): number | null {
  return toSafeNumber(value, {
    field,
    required,
    min: 2000,
    max: 2100,
    integer: true,
  });
}

export function toDateISO(
  value: unknown,
  { required = false, field = "tanggal" }: { required?: boolean; field?: string } = {},
): string | null {
  const raw = typeof value === "string" ? value.trim() : value;

  if (!raw) {
    if (required) {
      throw new ValidationError("Validasi gagal.", {
        errors: [{ field, message: `${field} wajib diisi.` }],
      });
    }
    return null;
  }

  const parsed = new Date(raw as string);

  if (Number.isNaN(parsed.getTime())) {
    throw new ValidationError("Validasi gagal.", {
      errors: [{ field, message: `${field} tidak valid.` }],
    });
  }

  return parsed.toISOString();
}

interface FieldDef {
  field: string;
  value: unknown;
  label?: string;
  min?: number;
  max?: number;
  type?: "string";
}

export function requireFields(_obj: unknown, fields: FieldDef[]): void {
  const errors: Array<{ field: string; message: string }> = [];

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

export function oneOf(
  value: unknown,
  allowed: string[],
  { field = "nilai", label }: { field?: string; label?: string } = {},
): string | null {
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

export function isHttpsUrl(
  value: unknown,
  { allowedHosts = [] }: { allowedHosts?: string[] } = {},
): boolean {
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

interface FileLike {
  type?: string;
  name?: string;
}

export function isPdfFile(file: unknown): boolean {
  if (!file) return false;

  const f = file as FileLike;
  const type = String(f?.type || "").toLowerCase();
  const name = String(f?.name || "").toLowerCase();

  return type === "application/pdf" || name.endsWith(".pdf");
}

export function validationErrorResponse(error: ValidationError): {
  body: { message: string; code: string; errors: Array<{ field: string; message: string }> };
  status: number;
} {
  return {
    body: {
      message: error?.message || "Validasi gagal.",
      code: error?.code || "VALIDATION_ERROR",
      errors: error?.errors || [],
    },
    status: error?.status || 400,
  };
}
