import { unstable_cache } from "next/cache";
import { db } from "@/lib/drizzle";
import { homepage_slides } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function toBool(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return fallback;
}

export function normalizeHomepageSlide(item = {}) {
  return {
    id: toText(item.id, ""),
    title: toText(item.title, "Slide"),
    caption: toText(item.caption, ""),
    image_url: toText(item.image_url, ""),
    category: toText(item.category, "utama"),
    is_published: toBool(item.is_published, false),
    sort_order: toNumber(item.sort_order, 0),
    created_at: item.created_at || null,
    updated_at: item.updated_at || null,
  };
}

function sortSlides(items = []) {
  return [...items].sort((a, b) => {
    const orderA = toNumber(a?.sort_order, 0);
    const orderB = toNumber(b?.sort_order, 0);
    if (orderA !== orderB) return orderA - orderB;

    const updatedA = String(a?.updated_at || "");
    const updatedB = String(b?.updated_at || "");
    return updatedB.localeCompare(updatedA);
  });
}

const getCachedPublicSlides = unstable_cache(
  async () => {
    try {
      const data = await db
        .select()
        .from(homepage_slides)
        .where(eq(homepage_slides.is_published, true))
        .orderBy(asc(homepage_slides.sort_order), desc(homepage_slides.updated_at));

      return sortSlides((data || []).map(normalizeHomepageSlide));
    } catch (error) {
      console.error("getPublicHomepageSlides error:", error);
      return [];
    }
  },
  ["home-public-slides"],
  {
    revalidate: 300,
    tags: ["home-public-slides"],
  },
);

export async function getPublicHomepageSlides() {
  return getCachedPublicSlides();
}

export async function getAdminHomepageSlides() {
  try {
    const data = await db
      .select()
      .from(homepage_slides)
      .orderBy(asc(homepage_slides.sort_order), desc(homepage_slides.updated_at));

    return sortSlides((data || []).map(normalizeHomepageSlide));
  } catch (error) {
    console.error("getAdminHomepageSlides error:", error);
    return [];
  }
}
