// Audit log admin: catat semua aksi CRUD admin ke tabel Supabase.
// Gagal diam-diam agar tidak mengganggu aksi utama.

import { createAdminClient } from "@/lib/supabase/admin";

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
    const supabase = createAdminClient();

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
      before: redact(before),
      after: redact(after),
      metadata: metadata || null,
      ip_address: extractIp(request),
      user_agent: request?.headers?.get?.("user-agent") || null,
    };

    const { error } = await supabase.from("admin_audit_log").insert(record);

    if (error) {
      console.warn("[audit] gagal simpan log:", error.message);
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
    const supabase = createAdminClient();
    let query = supabase
      .from("admin_audit_log")
      .select(
        "id, actor_email, actor_role, action, entity, entity_id, summary, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit, 1), 200));

    if (entity) query = query.eq("entity", entity);
    if (action) query = query.eq("action", action);

    const { data, error } = await query;

    if (error) return { ok: false, error: error.message, items: [] };
    return { ok: true, items: data || [] };
  } catch (error) {
    return { ok: false, error: error?.message, items: [] };
  }
}

export async function deleteAudit(id) {
  try {
    if (!id) throw new Error("ID log wajib diisi.");
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("admin_audit_log")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { ok: true, message: "Log berhasil dihapus secara permanen." };
  } catch (error) {
    return { ok: false, error: error?.message || "Gagal menghapus log." };
  }
}

export async function clearAllAudit() {
  try {
    const supabase = createAdminClient();
    // Gunakan filter yang pasti benar untuk menghapus semua, atau .neq('id', 0)
    const { error } = await supabase
      .from("admin_audit_log")
      .delete()
      .neq("id", 0);
    if (error) throw error;
    return { ok: true, message: "Seluruh riwayat log berhasil dibersihkan." };
  } catch (error) {
    return { ok: false, error: error?.message || "Gagal membersihkan log." };
  }
}
