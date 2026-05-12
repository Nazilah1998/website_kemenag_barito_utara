import { createAdminClient } from "@/lib/supabase/admin";

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
    
    console.log(`[RealtimeService] Refresh signal broadcasted for: ${entity}`);
  } catch (error) {
    console.error("[RealtimeService] Failed to broadcast refresh signal:", error);
  }
}
