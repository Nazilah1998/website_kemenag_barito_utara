// src/lib/laporan-api.js

const BASE = "/api/admin/laporan";

async function parseResponse(response) {
  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json?.message || `HTTP ${response.status}`);
  }

  return json;
}

export async function fetchCategoryDocuments(slug, page = 1, limit = 10, year = "") {
  let url = `${BASE}?slug=${encodeURIComponent(slug)}&page=${page}&limit=${limit}`;
  if (year) {
    url += `&year=${encodeURIComponent(year)}`;
  }
  
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  const json = await parseResponse(response);
  return json;
}

export async function uploadLaporanDocument({
  files,
  categoryId,
  categorySlug,
  title,
  description,
  year,
  is_published,
}) {
  const formData = new FormData();
  
  if (Array.isArray(files)) {
    files.forEach(f => formData.append("files", f));
  } else if (files) {
    formData.append("files", files);
  }

  formData.append("categoryId", String(categoryId || ""));
  formData.append("categorySlug", String(categorySlug || ""));
  formData.append("title", String(title || "").trim());
  formData.append("description", String(description || "").trim());
  formData.append("year", String(year || ""));
  formData.append("is_published", String(Boolean(is_published)));

  const response = await fetch(`${BASE}/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  return parseResponse(response);
}

export async function updateLaporanDocument(id, payload) {
  const response = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      title: String(payload?.title || "").trim(),
      description: String(payload?.description || "").trim(),
      year: String(payload?.year || ""),
      is_published: Boolean(payload?.is_published),
    }),
  });

  return parseResponse(response);
}

export async function updateLaporanDocumentWithFile(id, payload) {
  const formData = new FormData();
  formData.append("title", String(payload?.title || "").trim());
  formData.append("description", String(payload?.description || "").trim());
  formData.append("year", String(payload?.year || ""));
  formData.append("is_published", String(Boolean(payload?.is_published)));

  if (payload?.file) {
    formData.append("file", payload.file);
  }

  const response = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });

  return parseResponse(response);
}

export async function deleteLaporanDocument(id) {
  const response = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return parseResponse(response);
}
