export const BERITA_CATEGORIES = [
  "Umum",
  "Kegiatan",
  "Madrasah",
  "Pelayanan",
  "Pendidikan",
  "Keagamaan",
];

export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getYearKey(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return String(date.getFullYear());
}

export function getMonthKey(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getMonthLabelFromKey(key) {
  if (!key) return "Semua bulan";
  const [year, month] = key.split("-").map(Number);
  if (!year || !month) return key;

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

export function toDateTimeLocal(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);
  return localDate.toISOString().slice(0, 16);
}

export function slugPreview(title = "") {
  return String(title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function stripHtml(html = "") {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function escapeHtml(value = "") {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function sanitizeEditorHtml(html = "") {
  if (!html) return "";

  if (typeof window === "undefined" || !window.DOMParser) {
    return String(html || "");
  }

  try {
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(String(html || ""), "text/html");

    const blockedTags = [
      "script",
      "style",
      "meta",
      "link",
      "iframe",
      "object",
      "embed",
    ];

    blockedTags.forEach((selector) => {
      doc.querySelectorAll(selector).forEach((element) => element.remove());
    });

    doc.body.querySelectorAll("*").forEach((element) => {
      [...element.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();

        if (name.startsWith("on")) {
          element.removeAttribute(attr.name);
          return;
        }

        if (name === "style") {
          const styleValue = attr.value.toLowerCase();
          // Hanya izinkan text-align untuk perataan teks
          if (styleValue.includes("text-align")) {
            // Kita bisa membersihkan style lain jika perlu, tapi untuk sekarang
            // kita izinkan jika ada text-align agar fitur editor berfungsi
            return;
          }
          element.removeAttribute("style");
          return;
        }

        if (name === "align") {
          return;
        }

        if (name === "bgcolor" || name === "color" || name === "face") {
          element.removeAttribute(attr.name);
        }
      });

      element.classList.remove("Apple-interchange-newline");
    });

    return doc.body.innerHTML;
  } catch {
    return String(html || "");
  }
}

export function plainTextToEditorHtml(text = "") {
  const normalized = String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
  const lines = normalized.split("\n");

  if (!lines.length) return "";

  return lines
    .map((line) => {
      const safe = escapeHtml(line);
      return safe.trim() ? `<p>${safe}</p>` : "<p><br></p>";
    })
    .join("");
}

export function countWords(value = "") {
  const plain = stripHtml(value);
  return plain ? plain.split(/\s+/).filter(Boolean).length : 0;
}

export function estimateReadingTime(value = "") {
  const totalWords = countWords(value);
  if (totalWords === 0) return 1;
  return Math.max(1, Math.ceil(totalWords / 200));
}

export function buildExcerptFromHtml(html = "", maxLength = 180) {
  const plain = stripHtml(html);
  if (!plain) return "";
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 3).trim()}...`;
}

export function isMeaningfulHtml(html = "") {
  return stripHtml(html).length > 0;
}

export function buildPagination(totalPages, currentPage) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage, "...", totalPages];
}

export async function readJsonSafely(response) {
  const raw = await response.text();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function getItemPublishedState(item) {
  return Boolean(item?.is_published ?? item?.isPublished);
}

export function getItemBaseDate(item) {
  return (
    item?.published_at ||
    item?.publishedAt ||
    item?.created_at ||
    item?.createdAt ||
    ""
  );
}

export function sanitizeSlugInput(value = "") {
  return slugPreview(value);
}

export function getDefaultPublishedAt() {
  return toDateTimeLocal(new Date().toISOString());
}
