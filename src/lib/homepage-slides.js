import { createAdminClient } from "@/lib/supabase/admin";

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
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("homepage_slides")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return sortSlides((data || []).map(normalizeHomepageSlide));
  } catch {
    return [];
  }
}

export async function getAdminHomepageSlides() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("homepage_slides")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return sortSlides((data || []).map(normalizeHomepageSlide));
  } catch {
    return [];
  }
}
