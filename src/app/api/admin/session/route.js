import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";

export const dynamic = "force-dynamic";

function createNoStoreResponse(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

export async function GET() {
  try {
    const session = await getCurrentSessionContext();
    const hasAdminPanelAccess = session.isAdmin || session.isEditor;

    return createNoStoreResponse({
      authenticated: session.isAuthenticated,
      user: session.isAuthenticated
        ? {
            id: session.profile?.id ?? session.user?.id ?? null,
            email: session.profile?.email ?? session.user?.email ?? null,
            full_name: session.profile?.full_name ?? null,
            role: session.profile?.role ?? session.role ?? null,
          }
        : null,
      permissions: {
        isAdmin: session.isAdmin,
        isEditor: session.isEditor,
        hasAdminPanelAccess,
        role: session.role ?? null,
      },
    });
  } catch {
    return createNoStoreResponse({
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
