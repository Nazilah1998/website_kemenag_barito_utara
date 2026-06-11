import { db } from "@/lib/drizzle";
import { admin_audit_log } from "@/db/schema";
import { serializeData } from "@/lib/api-helpers";
import { eq, and, desc, type SQL } from "drizzle-orm";
import { logWarn } from "@/lib/logger";

interface AuditRecord {
  actor_id: string | null;
  actor_email: string | null;
  actor_role: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  summary: string | null;
  before: unknown;
  after: unknown;
  metadata: unknown;
  ip_address: string | null;
  user_agent: string | null;
}

interface SessionLike {
  profile?: { id?: string; email?: string };
  user?: { id?: string; email?: string };
  role?: string;
}

interface RequestLike {
  headers?: {
    get?: (name: string) => string | null;
  };
}

const auditBuffer: AuditRecord[] = [];
const AUDIT_BATCH_SIZE = 10;
const AUDIT_MAX_BUFFER_SIZE = 200; // Batas maksimum buffer — cegah memory leak saat DB down
const AUDIT_FLUSH_INTERVAL = 5_000;
let auditFlushTimer: ReturnType<typeof setTimeout> | null = null;
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
} as const;

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
} as const;

function redact(value: unknown): unknown {
  if (value == null) return null;
  if (typeof value !== "object") return value;
  const clone: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
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

function extractIp(request: RequestLike | null): string | null {
  if (!request?.headers) return null;
  const forwarded = request.headers.get?.("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get?.("x-real-ip") || null;
}

async function flushAuditBuffer(): Promise<void> {
  auditFlushTimer = null;

  if (auditBuffer.length === 0 || auditFlushLock) return;

  auditFlushLock = true;

  // Ambil semua record yang ada sekarang
  const batch = auditBuffer.splice(0, auditBuffer.length);

  if (batch.length === 0) {
    auditFlushLock = false;
    return;
  }

  try {
    await db.insert(admin_audit_log).values(batch);
  } catch (error: unknown) {
    logWarn("audit_batch_flush_error", { error: error as Error });

    // Fallback: coba satu per satu — batch yang sudah di-splice tidak dimasukkan kembali
    for (const record of batch) {
      try {
        await db.insert(admin_audit_log).values(record);
      } catch (e: unknown) {
        logWarn("audit_single_insert_error", { error: e as Error });
        // Record yang benar-benar gagal dibuang — lebih baik hilang 1 log
        // daripada memory leak tak terbatas
      }
    }
  } finally {
    auditFlushLock = false;

    if (auditBuffer.length > 0) scheduleAuditFlush();
  }
}

function scheduleAuditFlush(): void {
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
}: {
  session: SessionLike | null;
  action: string;
  entity: string;
  entityId?: string | null;
  summary?: string | null;
  before?: unknown;
  after?: unknown;
  request?: RequestLike | null;
  metadata?: unknown;
}): Promise<void> {
  try {
    const actorId = session?.profile?.id || session?.user?.id || null;
    const actorEmail = session?.profile?.email || session?.user?.email || null;
    const actorRole = session?.role || null;

    const record: AuditRecord = {
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

    // Cegah memory leak: jika buffer sudah penuh (DB down lama), buang record terlama
    if (auditBuffer.length >= AUDIT_MAX_BUFFER_SIZE) {
      auditBuffer.shift(); // hapus yang paling lama
      logWarn("audit_buffer_overflow", { dropped: 1, bufferSize: auditBuffer.length });
    }

    auditBuffer.push(record);
    scheduleAuditFlush();

    // Flush segera jika buffer mencapai ukuran batch
    if (auditBuffer.length >= AUDIT_BATCH_SIZE) {
      await flushAuditBuffer();
    }
  } catch (error: unknown) {
    logWarn("audit_record_exception", { error: error as Error });
  }
}

export async function listAudit({
  limit = 50,
  entity = null,
  action = null,
}: {
  limit?: number;
  entity?: string | null;
  action?: string | null;
} = {}): Promise<{ ok: true; items: unknown[] } | { ok: false; error: string; items: [] }> {
  try {
    const conditions: SQL[] = [];
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
  } catch (error: unknown) {
    return { ok: false, error: (error as Error)?.message || "Unknown error", items: [] };
  }
}

export async function deleteAudit(id: string): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  try {
    if (!id) throw new Error("ID log wajib diisi.");

    await db.delete(admin_audit_log).where(eq(admin_audit_log.id, String(id)));

    return { ok: true, message: "Log berhasil dihapus secara permanen." };
  } catch (error: unknown) {
    return { ok: false, error: (error as Error)?.message || "Gagal menghapus log." };
  }
}

export async function clearAllAudit(): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  try {
    await db.delete(admin_audit_log);
    return { ok: true, message: "Seluruh riwayat log berhasil dibersihkan." };
  } catch (error: unknown) {
    return { ok: false, error: (error as Error)?.message || "Gagal membersihkan log." };
  }
}
