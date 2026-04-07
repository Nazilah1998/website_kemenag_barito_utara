import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentSessionContext();

    return NextResponse.json({
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
    });
  } catch {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        permissions: {
          isAdmin: false,
          isEditor: false,
          role: null,
        },
      },
      { status: 200 }
    );
  }
}