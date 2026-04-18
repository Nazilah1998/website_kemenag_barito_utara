import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";
import { getUserPermissionContext } from "@/lib/user-permissions";

export const dynamic = "force-dynamic";

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET() {
  try {
    const session = await getCurrentSessionContext();

    if (!session?.isAuthenticated) {
      return json({ permissionContext: null }, 401);
    }

    const userId = session?.profile?.id || session?.user?.id || null;
    const role = session?.role || null;
    const email = session?.profile?.email || session?.user?.email || null;

    const permissionContext = await getUserPermissionContext({
      userId,
      role,
      email,
    });

    return json({ permissionContext });
  } catch {
    return json({ permissionContext: null }, 500);
  }
}
