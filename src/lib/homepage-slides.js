import prisma from "@/lib/prisma";

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

export async function getPublicHomepageSlides() {
  try {
    const data = await prisma.homepage_slides.findMany({
      where: { is_published: true },
      orderBy: [
        { sort_order: 'asc' },
        { updated_at: 'desc' }
      ]
    });

    return sortSlides((data || []).map(normalizeHomepageSlide));
  } catch (error) {
    console.error("getPublicHomepageSlides error:", error);
    return [];
  }
}

export async function getAdminHomepageSlides() {
  try {
    const data = await prisma.homepage_slides.findMany({
      orderBy: [
        { sort_order: 'asc' },
        { updated_at: 'desc' }
      ]
    });

    return sortSlides((data || []).map(normalizeHomepageSlide));
  } catch (error) {
    console.error("getAdminHomepageSlides error:", error);
    return [];
  }
}
