import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        permissions: {
          isAdmin: false,
          role: null,
        },
      });
    }

    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("full_name, role, is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    const isAdmin = Boolean(adminRow?.is_active);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: adminRow?.full_name ?? null,
      },
      permissions: {
        isAdmin,
        role: adminRow?.role ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        permissions: {
          isAdmin: false,
          role: null,
        },
      },
      { status: 200 }
    );
  }
}