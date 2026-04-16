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

    return createNoStoreResponse({
      authenticated: session.isAuthenticated,
      user: session.isAuthenticated
        ? {
            id: session.profile?.id ?? session.claims?.sub ?? null,
            email: session.profile?.email ?? null,
            full_name: session.profile?.full_name ?? null,
            role: session.profile?.role ?? null,
          }
        : null,
      permissions: {
        isAdmin: session.isAdmin,
        isEditor: session.isEditor,
        role: session.role ?? null,
      },
      mfa: {
        currentLevel: session.aal ?? null,
        nextLevel: session.nextAal ?? null,
        isVerified: session.isMfaVerified ?? false,
        errorMessage: session.mfaErrorMessage ?? null,
      },
    });
  } catch {
    return createNoStoreResponse({
      authenticated: false,
      user: null,
      permissions: {
        isAdmin: false,
        isEditor: false,
        role: null,
      },
      mfa: {
        currentLevel: null,
        nextLevel: null,
        isVerified: false,
        errorMessage: null,
      },
    });
  }
}
