import { apiResponse } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { getUserPermissionContext } from "@/lib/user-permissions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await validateAdmin({ allowEditor: true });
    if (!auth.ok) return auth.response;

    const userId = auth.session?.profile?.id || auth.session?.user?.id || null;
    const role = auth.session?.role || null;
    const email = auth.session?.profile?.email || auth.session?.user?.email || null;

    const permissionContext = await getUserPermissionContext({
      userId,
      role,
      email,
    });

    return apiResponse({ permissionContext });
  } catch (error) {
    console.error("GET My Permissions Error:", error);
    return apiResponse({ permissionContext: null }, 500);
  }
}
