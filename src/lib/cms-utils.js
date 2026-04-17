import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";

export function cleanString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function slugify(value) {
  return cleanString(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function ensureUniqueSlug(
  supabase,
  table,
  rawSlug,
  fallbackTitle,
  currentId = null,
) {
  const baseSlug =
    slugify(rawSlug) || slugify(fallbackTitle) || `${table}-${Date.now()}`;

  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase.from(table).select("id").eq("slug", candidate);

    if (currentId) {
      query = query.neq("id", currentId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function validateAdmin(options = {}) {
  const { requireMfa = true, permission = null, allowEditor = false } = options;

  const session = await getCurrentSessionContext();

  if (!session?.isAuthenticated) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          message: "Unauthorized.",
          code: "AUTH_REQUIRED",
        },
        { status: 401 },
      ),
    };
  }

  const isEditorAllowed = allowEditor && session?.isEditor;

  if (!session?.isAdmin && !isEditorAllowed) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          message: "Forbidden.",
          code: "ADMIN_REQUIRED",
        },
        { status: 403 },
      ),
    };
  }

  if (permission && !hasPermission(session?.role, permission)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          message: "Anda tidak memiliki izin untuk tindakan ini.",
          code: "PERMISSION_DENIED",
          required: permission,
        },
        { status: 403 },
      ),
    };
  }

  if (requireMfa && session?.isAdmin && !session?.isMfaVerified) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          message:
            "MFA admin wajib diselesaikan sebelum mengakses endpoint ini.",
          code: "MFA_REQUIRED",
          mfa: {
            currentLevel: session?.aal ?? null,
            nextLevel: session?.nextAal ?? null,
            isVerified: false,
          },
        },
        { status: 403 },
      ),
    };
  }

  return {
    ok: true,
    session,
  };
}
