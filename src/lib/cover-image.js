function extractGoogleDriveFileId(value = "") {
  const input = String(value || "").trim();
  if (!input) return "";

  const directIdMatch = input.match(/^[a-zA-Z0-9_-]{20,}$/);
  if (directIdMatch) return directIdMatch[0];

  try {
    const url = new URL(input);

    const idFromQuery = url.searchParams.get("id");
    if (idFromQuery) return idFromQuery;

    const fileMatch = url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch?.[1]) return fileMatch[1];

    const docMatch = url.pathname.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docMatch?.[1]) return docMatch[1];

    const sheetMatch = url.pathname.match(
      /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/,
    );
    if (sheetMatch?.[1]) return sheetMatch[1];

    const presentationMatch = url.pathname.match(
      /\/presentation\/d\/([a-zA-Z0-9_-]+)/,
    );
    if (presentationMatch?.[1]) return presentationMatch[1];
  } catch {
    return "";
  }

  return "";
}

function normalizeGoogleDriveUrl(value = "") {
  const fileId = extractGoogleDriveFileId(value);
  if (!fileId) return String(value || "").trim();

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export function normalizeCoverImageUrl(value = "") {
  const input = String(value || "").trim();
  if (!input) return "";

  if (input.startsWith("/")) return input;

  if (/^https?:\/\//i.test(input)) {
    try {
      const url = new URL(input);

      if (
        url.hostname === "drive.google.com" ||
        url.hostname === "docs.google.com"
      ) {
        return normalizeGoogleDriveUrl(input);
      }

      return input;
    } catch {
      return "";
    }
  }

  const googleDriveId = extractGoogleDriveFileId(input);
  if (googleDriveId) {
    return normalizeGoogleDriveUrl(googleDriveId);
  }

  return input;
}

export function toCoverPreviewUrl(value = "") {
  const normalized = normalizeCoverImageUrl(value);
  if (!normalized) return "";

  if (normalized.startsWith("/")) return normalized;
  if (!/^https?:\/\//i.test(normalized)) return normalized;

  return `/api/image-proxy?url=${encodeURIComponent(normalized)}`;
}
