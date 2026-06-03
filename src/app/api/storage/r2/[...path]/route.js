import { CMS_MEDIA_BUCKET } from "@/lib/storage-media";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const pathParts = resolvedParams.path || [];
    const path = pathParts.join("/");

    // URL Supabase dari env (.env.local)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (!supabaseUrl) {
       return new Response("Supabase URL tidak dikonfigurasi.", { status: 500 });
    }
    
    const bucketName = CMS_MEDIA_BUCKET;
    
    // Format Public URL Supabase Storage
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${path}`;
    
    // Redirect 301 Moved Permanently ke Supabase
    return Response.redirect(publicUrl, 301);
  } catch (error) {
    logError("r2_redirect_error", {
      message: error.message,
    });
    return new Response(`Gagal mengarahkan file storage: ${error.message}`, { status: 500 });
  }
}
