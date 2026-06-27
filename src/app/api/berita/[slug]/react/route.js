import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { berita } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { apiResponse } from "@/lib/api-helpers";

export async function POST(req, { params }) {
  try {
    const { slug } = await params;
    
    // Rate Limiting: Allow up to 20 requests per IP per day to allow changing minds/switching
    const ip = getClientIp(req);
    const rl = await rateLimit({
      key: `react_berita_${ip}_${slug}`,
      limit: 20,
      windowMs: 1000 * 60 * 60 * 24 // 1 hari
    });
    
    if (!rl.ok) {
      return NextResponse.json({ error: "Anda sudah memberikan reaksi pada berita ini." }, { status: 429 });
    }

    const body = await req.json();
    const { type, action = "add", previousType } = body;

    const allowedTypes = ['bermanfaat', 'inspiratif', 'informatif'];
    if (!allowedTypes.includes(type) || (previousType && !allowedTypes.includes(previousType))) {
      return NextResponse.json({ error: "Tipe reaksi tidak valid." }, { status: 400 });
    }

    let updateQuery = {};
    if (action === "remove") {
      const col = type === 'bermanfaat' ? 'reaction_bermanfaat' : type === 'inspiratif' ? 'reaction_inspiratif' : 'reaction_informatif';
      updateQuery = { [col]: sql`GREATEST(0, ${berita[col]} - 1)` };
    } else if (action === "switch" && previousType) {
      const colNew = type === 'bermanfaat' ? 'reaction_bermanfaat' : type === 'inspiratif' ? 'reaction_inspiratif' : 'reaction_informatif';
      const colOld = previousType === 'bermanfaat' ? 'reaction_bermanfaat' : previousType === 'inspiratif' ? 'reaction_inspiratif' : 'reaction_informatif';
      updateQuery = { 
        [colNew]: sql`${berita[colNew]} + 1`,
        [colOld]: sql`GREATEST(0, ${berita[colOld]} - 1)` 
      };
    } else {
      const col = type === 'bermanfaat' ? 'reaction_bermanfaat' : type === 'inspiratif' ? 'reaction_inspiratif' : 'reaction_informatif';
      updateQuery = { [col]: sql`${berita[col]} + 1` };
    }

    const [updated] = await db.update(berita)
      .set(updateQuery)
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

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    
    const data = await db.query.berita.findFirst({
      where: eq(berita.slug, slug),
      columns: {
        reaction_bermanfaat: true,
        reaction_inspiratif: true,
        reaction_informatif: true
      }
    });
    
    if (!data) {
      return NextResponse.json({ error: "Berita tidak ditemukan." }, { status: 404 });
    }
    
    return apiResponse(data);
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem." }, { status: 500 });
  }
}
