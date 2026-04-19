import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentSessionContext();

    if (!session?.isAuthenticated) {
      return NextResponse.json(
        {
          ok: false,
          message: "Belum login.",
          user: null,
          permissions: {
            isAdmin: false,
            isEditor: false,
          },
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: session.claims?.sub ?? session.user?.id ?? null,
        email: session.profile?.email || session.user?.email || null,
        full_name: session.profile?.full_name || null,
        role: session.role ?? null,
      },
      permissions: {
        isAdmin: Boolean(session.isAdmin),
        isEditor: Boolean(session.isEditor),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Gagal membaca session admin.",
        user: null,
        permissions: {
          isAdmin: false,
          isEditor: false,
        },
      },
      { status: 500 },
    );
  }
}
