import { beritaList } from "../data/berita";

export function getAllBerita() {
  return [...beritaList].sort(
    (a, b) => new Date(b.isoDate || b.date) - new Date(a.isoDate || a.date)
  );
}

export function getLatestBerita(limit = 3) {
  return getAllBerita().slice(0, limit);
}

export function getBeritaBySlug(slug) {
  return beritaList.find((item) => item.slug === slug);
}