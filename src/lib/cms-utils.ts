import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";
import {
  getUserPermissionContext,
  hasUserPermission,
} from "@/lib/user-permissions";
import { cleanString } from "@/lib/validation";
import { db } from "@/lib/drizzle";
import * as schema from "@/db/schema";
import { eq, ne, and } from "drizzle-orm";

export function slugify(value: string): string {
  return cleanString(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface SessionContext {
  isAuthenticated?: boolean;
  role?: string;
  isEditor?: boolean;
  isAdmin?: boolean;
  profile?: { id?: string; email?: string };
  user?: { id?: string; email?: string };
}

interface PermissionContext {
  isSuperAdmin?: boolean;
  isAdmin?: boolean;
  isEditor?: boolean;
  approved?: boolean;
  isActive?: boolean;
}

type ValidateAdminResult =
  | {
      ok: true;
      session: SessionContext;
      permissionContext: PermissionContext;
    }
  | {
      ok: false;
      response: Response;
    };

export async function ensureUniqueSlug(
  table: string,
  rawSlug: string,
  fallbackTitle: string,
  currentId: string | null = null,
): Promise<string> {
  const baseSlug: string =
    slugify(rawSlug) || slugify(fallbackTitle) || `${table}-${Date.now()}`;

  let candidate = baseSlug;
  let counter = 1;
  const MAX_ITERATIONS = 100;

  const camelTable = table.replace(/_([a-z])/g, (_g: string, c: string) =>
    c.toUpperCase(),
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schemaTable: any = (schema as any)[camelTable] || (schema as any)[table];

  if (!schemaTable) {
    throw new Error(`Tabel ${table} tidak ditemukan di schema`);
  }

  while (counter <= MAX_ITERATIONS) {
    const conditions = [eq(schemaTable.slug, candidate)];
    if (currentId) {
      conditions.push(ne(schemaTable.id, currentId));
    }

    const [existing] = await db
      .select({ id: schemaTable.id })
      .from(schemaTable)
      .where(and(...conditions))
      .limit(1);

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function validateAdmin(
  options: { permission?: string | null; allowEditor?: boolean } = {},
): Promise<ValidateAdminResult> {
  const { permission = null, allowEditor = true } = options;

  const session: SessionContext = await getCurrentSessionContext();

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

  const role = session?.role || null;
  const isEditor = session?.isEditor === true;
  const isAdmin = session?.isAdmin === true;
  const isSuperAdmin = role === "super_admin";

  if (isSuperAdmin) {
    return {
      ok: true,
      session,
      permissionContext: {
        isSuperAdmin: true,
        isAdmin: true,
        isEditor: true,
        approved: true,
        isActive: true,
      },
    };
  }

  if ((isEditor || isAdmin) && allowEditor) {
    const userId = session?.profile?.id || session?.user?.id || null;
    const email = session?.profile?.email || session?.user?.email || null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const permissionContext: PermissionContext = await getUserPermissionContext({
      userId,
      role,
      email,
    } as any);

    if (!permissionContext.approved || !permissionContext.isActive) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            message: "Akun editor belum aktif atau belum disetujui.",
            code: "EDITOR_INACTIVE",
          },
          { status: 403 },
        ),
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (permission && !hasUserPermission(permissionContext as any, permission)) {
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

    return {
      ok: true,
      session,
      permissionContext,
    };
  }

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
