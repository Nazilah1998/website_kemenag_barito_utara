import prisma from "@/lib/prisma";
import { serializePrisma } from "@/lib/prisma-helpers";

export const AUDIT_ACTIONS = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  PUBLISH: "publish",
  UNPUBLISH: "unpublish",
  LOGIN: "login",
  LOGOUT: "logout",
  ROLE_CHANGE: "role_change",
};

export const AUDIT_ENTITIES = {
  BERITA: "berita",
  HALAMAN: "halaman",
  GALERI: "galeri",
  LAPORAN_DOKUMEN: "laporan_dokumen",
  KONTAK: "kontak",
  USER: "user",
  SETTINGS: "settings",
};

function redact(value) {
  if (value == null) return null;
  if (typeof value !== "object") return value;
  const clone = {};
  for (const [k, v] of Object.entries(value)) {
    if (
      /password|token|secret|service_role|otp|mfa_code/i.test(k) ||
      (typeof v === "string" && v.startsWith("data:") && v.length > 400)
    ) {
      clone[k] = "[redacted]";
    } else {
      clone[k] = v;
    }
  }
  return clone;
}

function extractIp(request) {
  if (!request?.headers) return null;
  const forwarded = request.headers.get?.("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get?.("x-real-ip") || null;
}

export async function recordAudit({
  session,
  action,
  entity,
  entityId = null,
  summary = null,
  before = null,
  after = null,
  request = null,
  metadata = null,
}) {
  try {
    const actorId = session?.profile?.id || session?.user?.id || null;
    const actorEmail = session?.profile?.email || session?.user?.email || null;
    const actorRole = session?.role || null;

    const record = {
      actor_id: actorId,
      actor_email: actorEmail,
      actor_role: actorRole,
      action,
      entity,
      entity_id: entityId ? String(entityId) : null,
      summary: summary ? String(summary).slice(0, 500) : null,
      before: serializePrisma(redact(before)),
      after: serializePrisma(redact(after)),
      metadata: serializePrisma(metadata) || null,
      ip_address: extractIp(request),
      user_agent: request?.headers?.get?.("user-agent") || null,
    };

    await prisma.admin_audit_log.create({
      data: record,
    });
  } catch (error) {
    console.warn("[audit] exception:", error?.message);
  }
}

export async function listAudit({
  limit = 50,
  entity = null,
  action = null,
} = {}) {
  try {
    const items = await prisma.admin_audit_log.findMany({
      where: {
        ...(entity && { entity }),
        ...(action && { action }),
      },
      select: {
        id: true,
        actor_email: true,
        actor_role: true,
        action: true,
        entity: true,
        entity_id: true,
        summary: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
      take: Math.min(Math.max(limit, 1), 200),
    });

    return { ok: true, items: items || [] };
  } catch (error) {
    return { ok: false, error: error?.message, items: [] };
  }
}

export async function deleteAudit(id) {
  try {
    if (!id) throw new Error("ID log wajib diisi.");

    await prisma.admin_audit_log.delete({
      where: { id: String(id) },
    });

    return { ok: true, message: "Log berhasil dihapus secara permanen." };
  } catch (error) {
    return { ok: false, error: error?.message || "Gagal menghapus log." };
  }
}

export async function clearAllAudit() {
  try {
    await prisma.admin_audit_log.deleteMany();
    return { ok: true, message: "Seluruh riwayat log berhasil dibersihkan." };
  } catch (error) {
    return { ok: false, error: error?.message || "Gagal membersihkan log." };
  }
}
