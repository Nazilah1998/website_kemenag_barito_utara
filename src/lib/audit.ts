import { db } from "@/lib/drizzle";
import { pgSchema, uuid, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { serializeData } from "@/lib/api-helpers";
import { logWarn } from "@/lib/logger";

const pusdatin = pgSchema("kemenag_pusdatin");
const pusdatinAuditLogs = pusdatin.table("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  action: varchar("action", { length: 20 }).notNull(),
  target: varchar("target", { length: 255 }).notNull(),
  targetSchema: varchar("target_schema", { length: 100 }),
  performedBy: varchar("performed_by", { length: 255 }).notNull(),
  beforeState: jsonb("before_state"),
  afterState: jsonb("after_state"),
  ip: varchar("ip", { length: 50 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

interface AuditRecord {
  action: string;
  target: string;
  targetSchema: string;
  performedBy: string;
  beforeState: unknown;
  afterState: unknown;
  ip: string | null;
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
const AUDIT_MAX_BUFFER_SIZE = 200; // Batas maksimum buffer
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

  const batch = auditBuffer.splice(0, auditBuffer.length);

  if (batch.length === 0) {
    auditFlushLock = false;
    return;
  }

  try {
    await db.insert(pusdatinAuditLogs).values(batch);
  } catch (error: unknown) {
    logWarn("audit_batch_flush_error", { error: error as Error });
    if (auditBuffer.length + batch.length <= AUDIT_MAX_BUFFER_SIZE) {
      auditBuffer.unshift(...batch);
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
    const actorEmail = session?.profile?.email || session?.user?.email || "system";
    
    // Construct target string like "berita:123" or just "berita"
    let targetStr = entity;
    if (entityId) targetStr += `:${entityId}`;
    
    const record: AuditRecord = {
      action: String(action).slice(0, 20),
      target: String(targetStr).slice(0, 255),
      targetSchema: "kemenag_website", // As requested to identify source
      performedBy: String(actorEmail).slice(0, 255),
      beforeState: serializeData(redact(before)),
      afterState: serializeData(redact(after)),
      ip: extractIp(request),
    };

    if (auditBuffer.length >= AUDIT_MAX_BUFFER_SIZE) {
      auditBuffer.shift(); 
      logWarn("audit_buffer_overflow", { dropped: 1, bufferSize: auditBuffer.length });
    }

    auditBuffer.push(record);
    scheduleAuditFlush();

    if (auditBuffer.length >= AUDIT_BATCH_SIZE) {
      await flushAuditBuffer();
    }
  } catch (error: unknown) {
    logWarn("audit_record_exception", { error: error as Error });
  }
}
