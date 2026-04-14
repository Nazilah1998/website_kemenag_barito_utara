export function normalizeCoverImageUrl(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";

  if (raw.startsWith("/")) {
    return raw;
  }

  const driveId = extractGoogleDriveId(raw);
  if (driveId) {
    return `https://drive.google.com/uc?export=view&id=${driveId}`;
  }

  try {
    const url = new URL(raw);
    return url.toString();
  } catch {
    return raw;
  }
}

export function toCoverPreviewUrl(value = "") {
  const normalized = normalizeCoverImageUrl(value);
  if (!normalized) return "";

  if (normalized.startsWith("/")) {
    return normalized;
  }

  try {
    const url = new URL(normalized);

    if (isSupabasePublicUrl(url)) {
      return normalized;
    }

    if (
      typeof window !== "undefined" &&
      url.origin === window.location.origin
    ) {
      return normalized;
    }

    if (
      url.hostname === "drive.google.com" ||
      url.hostname === "docs.google.com"
    ) {
      return `/api/image-proxy?url=${encodeURIComponent(normalized)}`;
    }

    return normalized;
  } catch {
    return normalized;
  }
}

function isSupabasePublicUrl(url) {
  return url.pathname.includes("/storage/v1/object/public/");
}

function extractGoogleDriveId(value = "") {
  const raw = String(value || "");

  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/,
    /docs\.google\.com\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return "";
}
