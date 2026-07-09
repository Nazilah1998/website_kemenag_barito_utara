import { NextResponse } from "next/server";
import { validateAdmin } from "@/lib/cms-utils";
import { db } from "@/lib/drizzle";
import { berita, ai_knowledge_base } from "@/db/schema";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { logInfo, logError } from "@/lib/logger";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const adminCheck = await validateAdmin(req);
    if (!adminCheck.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    const google = createGoogleGenerativeAI({ apiKey });
    const embeddingModel = google.textEmbeddingModel("text-embedding-004");

    // Fetch the latest 50 published news
    const newsItems = await db
      .select()
      .from(berita)
      .where(eq(berita.is_published, true))
      .limit(50);

    let syncedCount = 0;

    for (const item of newsItems) {
      const sourceUrl = `/berita/${item.slug}`;
      
      // Check if this news is already in the knowledge base
      const existing = await db
        .select({ id: ai_knowledge_base.id })
        .from(ai_knowledge_base)
        .where(eq(ai_knowledge_base.source_url, sourceUrl))
        .limit(1);

      if (existing.length === 0) {
        // Strip HTML tags for clean text embedding
        const cleanContent = (item.content || "").replace(/<[^>]*>?/gm, '');
        const textToEmbed = `Judul: ${item.title}\nKategori: ${item.category}\nIsi: ${cleanContent.substring(0, 800)}...`;
        
        try {
          const { embedding } = await embeddingModel.doEmbed({ values: [textToEmbed] });

          await db.insert(ai_knowledge_base).values({
            title: item.title,
            content_summary: textToEmbed.substring(0, 300) + '...',
            source_type: "berita",
            source_url: sourceUrl,
            embedding: embedding[0],
          });
          
          syncedCount++;
        } catch (embedError) {
          logError("embedding_error", { slug: item.slug, error: embedError.message });
        }
      }
    }

    logInfo("ai_knowledge_synced", { syncedCount });

    return NextResponse.json({
      success: true,
      message: `Berhasil mensinkronisasi ${syncedCount} berita baru ke sistem AI.`,
    });

  } catch (error) {
    logError("sync_ai_error", { error: error.message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
