import { logError, logInfo } from "@/lib/logger";

const ONESIGNAL_APP_ID = "7dc65184-fec0-4fd4-bb2a-5e274891c8b5";
// Menggunakan environment variable agar rahasia tidak bocor ke GitHub
const REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

/**
 * Mengirim Push Notification ke semua subscriber saat berita di-publish
 * @param {string} title - Judul berita
 * @param {string} slug - Slug berita untuk link
 * @param {string} excerpt - Cuplikan berita (opsional)
 * @param {string} imageUrl - URL gambar cover (opsional)
 */
export async function sendNewsPushNotification(title, slug, excerpt = "", imageUrl = "") {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://baritoutara.kemenag.go.id";
    const postUrl = `${siteUrl}/berita/${slug}`;

    const payload = {
      app_id: ONESIGNAL_APP_ID,
      included_segments: ["Subscribed Users"],
      contents: {
        en: excerpt || "Klik untuk membaca berita selengkapnya di website resmi Kemenag Barito Utara.",
        id: excerpt || "Klik untuk membaca berita selengkapnya di website resmi Kemenag Barito Utara.",
      },
      headings: {
        en: title,
        id: title,
      },
      url: postUrl,
      ...(imageUrl && { big_picture: imageUrl }),
    };

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Basic ${REST_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`OneSignal Error: ${JSON.stringify(data)}`);
    }

    logInfo("onesignal_push_success", { slug, response: data });
    return data;
  } catch (error) {
    // Kita tidak menggunakan throw agar proses simpan berita tidak gagal jika OneSignal error
    logError("onesignal_push_error", { error: error.message, slug });
    console.error("Gagal mengirim Push Notification:", error.message);
  }
}
