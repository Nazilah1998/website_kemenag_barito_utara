import { apiResponse } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await validateAdmin({ allowEditor: true });
    if (!auth.ok) return auth.response;

    return apiResponse({
      ok: true,
      user: {
        id: auth.session.user?.id || null,
        email: auth.session.profile?.email || auth.session.user?.email || null,
        full_name: auth.session.profile?.full_name || null,
        role: auth.session.role ?? null,
      },
      permissions: {
        isAdmin: Boolean(auth.session.isAdmin),
        isEditor: Boolean(auth.session.isEditor),
      },
    });
  } catch (error) {
    console.error("GET Admin Base Error:", error);
    return apiResponse(
      {
        ok: false,
        message: error?.message || "Gagal membaca session admin.",
        user: null,
        permissions: {
          isAdmin: false,
          isEditor: false,
        },
      },
      500,
    );
  }
}
