import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { env } from "@/lib/env";
import { normalizeBerita, BERITA_SELECT_FIELDS } from "./berita";

// Gunakan client standar (non-server version) untuk public cache
// agar tidak memicu error "cookies() inside unstable_cache"
const publicSupabase = createClient(
  env.supabaseUrl,
  env.supabasePublishableKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  },
);

const getCachedLatestBeritaHome = unstable_cache(
  async () => {
    const { data, error } = await publicSupabase
      .from("berita")
      .select(BERITA_SELECT_FIELDS)
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.error("getCachedLatestBeritaHome error:", error);
      return [];
    }

    return (data || []).map(normalizeBerita);
  },
  ["home-latest-berita"],
  {
    revalidate: 300,
    tags: ["home-latest-berita"],
  },
);

export async function getLatestBeritaHome() {
  return getCachedLatestBeritaHome();
}
