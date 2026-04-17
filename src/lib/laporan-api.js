export async function fetchCategoryDocuments(slug) {
  const response = await fetch(
    `/api/admin/laporan?slug=${encodeURIComponent(slug)}`,
    { cache: "no-store" },
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Gagal memuat dokumen kategori.");
  }

  const categoryData = Array.isArray(json?.categories)
    ? json.categories.find((item) => item.slug === slug)
    : null;

  return Array.isArray(categoryData?.documents) ? categoryData.documents : [];
}

export async function uploadLaporanDocument({
  file,
  categoryId,
  categorySlug,
  title,
  description,
  year,
  is_published,
}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("categoryId", categoryId || "");
  formData.append("categorySlug", categorySlug || "");
  formData.append("title", title);
  formData.append("description", description);
  formData.append("year", String(year || ""));
  formData.append("is_published", String(Boolean(is_published)));

  const response = await fetch("/api/admin/laporan/upload", {
    method: "POST",
    body: formData,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Upload dokumen gagal.");
  }

  return json;
}

export async function updateLaporanDocument(id, payload) {
  const response = await fetch(`/api/admin/laporan/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Gagal memperbarui dokumen.");
  }

  return json;
}

export async function deleteLaporanDocument(id) {
  const response = await fetch(`/api/admin/laporan/${id}`, {
    method: "DELETE",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Gagal menghapus dokumen.");
  }

  return json;
}
