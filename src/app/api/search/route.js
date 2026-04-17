import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function createReadClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function escapeLike(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
}

async function searchTable(supabase, { table, columns, limit = 10, q }) {
  const needle = `%${escapeLike(q)}%`;
  const orClause = columns.map((c) => `${c}.ilike.${needle}`).join(",");

  // Kolom select minimal yang umum. Ditambah filter is_published kalau tabel punya.
  const select = `
    id, slug, title,
    excerpt:excerpt,
    description:description,
    content:content,
    is_published,
    published_at,
    updated_at,
    created_at
  `;

  let query = supabase
    .from(table)
    .select(
      // gunakan nama kolom yang ada saja. Kita akan pakai select umum dan ignore error.
      "id, slug, title, excerpt, description, content, is_published, published_at, updated_at",
      { count: "exact" },
    )
    .or(orClause)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (table !== "agenda") {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error) {
    // Biarkan silent, mungkin kolom tidak ada di tabel tersebut
    return [];
  }

  return (data || []).map((row) => ({
    table,
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || row.description || null,
    updated_at: row.updated_at,
  }));
}

export async function GET(request) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit({
      key: `search:${ip}`,
      limit: 30,
      windowMs: 60_000,
    });
    if (!limit.ok) {
      return NextResponse.json(
        { items: [], message: "Terlalu banyak permintaan." },
        { status: 429, headers: { "Cache-Control": "no-store" } },
      );
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const pageLimit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10", 10) || 10, 1),
      30,
    );

    if (!q || q.length < 2) {
      return NextResponse.json({ items: [], q });
    }

    const supabase = createReadClient();
    if (!supabase) {
      return NextResponse.json({ items: [], q, note: "supabase-unavailable" });
    }

    const tables = [
      {
        table: "berita",
        columns: ["title", "excerpt", "content"],
        section: "Berita",
        hrefBase: "/berita",
      },
      {
        table: "static_pages",
        columns: ["title", "description", "content"],
        section: "Halaman",
        hrefBase: "/halaman",
      },
    ];

    const results = await Promise.all(
      tables.map((t) =>
        searchTable(supabase, {
          table: t.table,
          columns: t.columns,
          q,
          limit: pageLimit,
        })
          .then((rows) =>
            rows.map((r) => ({
              id: `${t.table}-${r.id}`,
              section: t.section,
              title: r.title,
              description: r.excerpt
                ? String(r.excerpt)
                    .replace(/<[^>]+>/g, "")
                    .slice(0, 260)
                : null,
              href: r.slug ? `${t.hrefBase}/${r.slug}` : t.hrefBase,
              updated_at: r.updated_at,
            })),
          )
          .catch(() => []),
      ),
    );

    const items = results
      .flat()
      .sort((a, b) =>
        String(b.updated_at || "").localeCompare(String(a.updated_at || "")),
      );

    return NextResponse.json({ items, q });
  } catch (error) {
    return NextResponse.json(
      { items: [], error: error?.message || "search-failed" },
      { status: 200 },
    );
  }
}
