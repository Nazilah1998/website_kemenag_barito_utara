import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";

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
  currentId = null
) {
  const baseSlug =
    slugify(rawSlug) ||
    slugify(fallbackTitle) ||
    `${table}-${Date.now()}`;

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

export async function validateAdmin() {
  const session = await getCurrentSessionContext();

  if (!session?.isAuthenticated) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      ),
    };
  }

  if (!session?.isAdmin) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "Forbidden." },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    session,
  };
}