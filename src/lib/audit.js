import { db } from "@/lib/drizzle";
import { admin_audit_log } from "@/db/schema";
import { serializeData } from "@/lib/api-helpers";
import { eq, and, desc } from "drizzle-orm";

const auditBuffer = [];
const AUDIT_BATCH_SIZE = 10;
const AUDIT_FLUSH_INTERVAL = 5_000;
let auditFlushTimer = null;
let auditFlushLock = false;

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
  HOMEPAGE_SLIDES: "homepage_slides",
  SEKSI: "seksi",
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

async function flushAuditBuffer() {
  auditFlushTimer = null;

  if (auditBuffer.length === 0 || auditFlushLock) return;

  auditFlushLock = true;

  try {
    const batch = auditBuffer.splice(0, auditBuffer.length);

    if (batch.length === 0) return;

    await db.insert(admin_audit_log).values(batch);
  } catch (error) {
    console.warn("[audit] batch flush error:", error?.message);

    const batch = auditBuffer.splice(0, auditBuffer.length);

    for (const record of batch) {
      try {
        await db.insert(admin_audit_log).values(record);
      } catch (e) {
        console.warn("[audit] single insert error:", e?.message);
      }
    }
  } finally {
    auditFlushLock = false;

    if (auditBuffer.length > 0) scheduleAuditFlush();
  }
}

function scheduleAuditFlush() {
  if (auditFlushTimer) return;
  auditFlushTimer = setTimeout(flushAuditBuffer, AUDIT_FLUSH_INTERVAL);
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
      before: serializeData(redact(before)),
      after: serializeData(redact(after)),
      metadata: serializeData(metadata) || null,
      ip_address: extractIp(request),
      user_agent: request?.headers?.get?.("user-agent") || null,
    };

    auditBuffer.push(record);
    scheduleAuditFlush();

    if (auditBuffer.length >= AUDIT_BATCH_SIZE) {
      await flushAuditBuffer();
    }
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
    const conditions = [];
    if (entity) conditions.push(eq(admin_audit_log.entity, entity));
    if (action) conditions.push(eq(admin_audit_log.action, action));

    const items = await db
      .select({
        id: admin_audit_log.id,
        actor_email: admin_audit_log.actor_email,
        actor_role: admin_audit_log.actor_role,
        action: admin_audit_log.action,
        entity: admin_audit_log.entity,
        entity_id: admin_audit_log.entity_id,
        summary: admin_audit_log.summary,
        created_at: admin_audit_log.created_at,
      })
      .from(admin_audit_log)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(admin_audit_log.created_at))
      .limit(Math.min(Math.max(limit, 1), 200));

    return { ok: true, items: items || [] };
  } catch (error) {
    return { ok: false, error: error?.message, items: [] };
  }
}

export async function deleteAudit(id) {
  try {
    if (!id) throw new Error("ID log wajib diisi.");

    await db.delete(admin_audit_log).where(eq(admin_audit_log.id, String(id)));

    return { ok: true, message: "Log berhasil dihapus secara permanen." };
  } catch (error) {
    return { ok: false, error: error?.message || "Gagal menghapus log." };
  }
}

export async function clearAllAudit() {
  try {
    await db.delete(admin_audit_log);
    return { ok: true, message: "Seluruh riwayat log berhasil dibersihkan." };
  } catch (error) {
    return { ok: false, error: error?.message || "Gagal membersihkan log." };
  }
}
