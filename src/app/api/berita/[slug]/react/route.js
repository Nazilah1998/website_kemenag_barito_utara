import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { berita } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { apiResponse } from "@/lib/api-helpers";

export async function POST(req, { params }) {
  try {
    const { slug } = await params;
    
    // Rate Limiting: 10 requests per 60 seconds per IP to prevent spamming
    const ip = getClientIp(req);
    const rl = await rateLimit({
      key: `react_berita_${ip}_${slug}`,
      limit: 10,
      windowMs: 60000
    });
    
    if (!rl.ok) {
      return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan tunggu sebentar." }, { status: 429 });
    }

    const body = await req.json();
    const { type } = body;

    const allowedTypes = ['bermanfaat', 'inspiratif', 'informatif'];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: "Tipe reaksi tidak valid." }, { status: 400 });
    }

    // Increment reaction count safely using SQL
    let updateColumn;
    if (type === 'bermanfaat') updateColumn = berita.reaction_bermanfaat;
    if (type === 'inspiratif') updateColumn = berita.reaction_inspiratif;
    if (type === 'informatif') updateColumn = berita.reaction_informatif;

    const [updated] = await db.update(berita)
      .set({
        [type === 'bermanfaat' ? 'reaction_bermanfaat' : type === 'inspiratif' ? 'reaction_inspiratif' : 'reaction_informatif']: sql`${updateColumn} + 1`
      })
      .where(eq(berita.slug, slug))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Berita tidak ditemukan." }, { status: 404 });
    }

    return apiResponse(updated);
  } catch (error) {
    console.error("Error saving reaction:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem." }, { status: 500 });
  }
}
