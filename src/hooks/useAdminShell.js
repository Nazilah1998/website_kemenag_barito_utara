import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export function useAdminShell() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [permissionContext, setPermissionContext] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function loadSession() {
      try {
        const [sessionRes, permRes] = await Promise.all([
          fetch("/api/admin/session", { cache: "no-store", signal: controller.signal }),
          fetch("/api/admin/my-permissions", { cache: "no-store", signal: controller.signal }),
        ]);

        const session = await sessionRes.json().catch(() => null);
        const perm = await permRes.json().catch(() => null);

        const hasAdminPanelAccess =
          session?.permissions?.isAdmin || session?.permissions?.isEditor;

        if (!sessionRes.ok || !hasAdminPanelAccess) {
          setSessionData(null);
          setPermissionContext(null);
          return;
        }

        setSessionData(session);
        setPermissionContext(perm?.permissionContext || null);
      } catch (err) {
        if (err?.name === "AbortError") return;
      } finally {
        setLoading(false);
      }
    }
    loadSession();
    return () => controller.abort();
  }, [router]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const compactName = useMemo(() => {
    const name = String(sessionData?.user?.full_name || "").trim();
    if (name) return name;
    const email = String(sessionData?.user?.email || "").trim();
    return email ? email.split("@")[0] : "Admin";
  }, [sessionData?.user]);

  return {
    sidebarOpen,
    setSidebarOpen,
    sessionData,
    permissionContext,
    loading,
    compactName,
    profile: sessionData?.user || null,
    role: sessionData?.permissions?.role || null,
  };
}
