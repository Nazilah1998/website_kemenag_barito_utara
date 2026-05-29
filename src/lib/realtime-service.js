import { createAdminClient } from "@/lib/supabase/admin";
import { logInfo, logError } from "@/lib/logger";

/**
 * Broadcasts a refresh signal to all connected clients.
 * This ensures users see the latest content immediately after an admin update.
 */
export async function broadcastRefresh(entity = "content") {
  try {
    const supabase = createAdminClient();
    const channel = supabase.channel("site-updates");

    await channel.send({
      type: "broadcast",
      event: "refresh-content",
      payload: { 
        entity, 
        timestamp: new Date().toISOString() 
      },
    });
    
    logInfo("realtime_refresh_broadcast", { entity });
  } catch (error) {
    logError("realtime_broadcast_failed", { error: error?.message });
  }
}
