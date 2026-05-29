import { apiResponse } from "@/lib/api-helpers";
import { getCurrentSessionContext } from "@/lib/auth";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentSessionContext();
    const hasAdminPanelAccess = session.isAdmin || session.isEditor;

    return apiResponse({
      authenticated: session.isAuthenticated,
      user: session.isAuthenticated
        ? {
            id: session.profile?.id ?? session.user?.id ?? null,
            email: session.profile?.email ?? session.user?.email ?? null,
            full_name: session.profile?.full_name ?? null,
            role: session.profile?.role ?? session.role ?? null,
            avatar_url: session.profile?.avatar_url ?? null,
          }
        : null,
      permissions: {
        isAdmin: session.isAdmin,
        isEditor: session.isEditor,
        hasAdminPanelAccess,
        role: session.role ?? null,
      },
    });
  } catch (error) {
    logError("session_get_error", { error: error?.message });
    return apiResponse({
      authenticated: false,
      user: null,
      permissions: {
        isAdmin: false,
        isEditor: false,
        hasAdminPanelAccess: false,
        role: null,
      },
    });
  }
}
