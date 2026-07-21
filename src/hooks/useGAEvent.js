/**
 * useGAEvent — hook untuk mengirim GA4 custom events.
 *
 * Penggunaan:
 *   const { trackEvent, trackDownload, trackContact, trackSearch } = useGAEvent();
 *   trackEvent("klik_tombol", { label: "Download Laporan 2025" });
 *   trackDownload("laporan-kinerja-2025.pdf", "laporan");
 *
 * Semua event otomatis di-no-op jika GA belum dimuat (dev mode, bot, dll).
 */

/**
 * Kirim event GA4 secara aman.
 * @param {string} eventName - nama event GA4
 * @param {Record<string, any>} params - parameter tambahan
 */
function sendGAEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

/**
 * Hook utama — return fungsi-fungsi tracking siap pakai.
 */
export function useGAEvent() {
  /**
   * Event generik (bebas dipakai di mana saja)
   * @param {string} eventName
   * @param {Record<string, any>} params
   */
  function trackEvent(eventName, params = {}) {
    sendGAEvent(eventName, params);
  }

  /**
   * Tracking download file (laporan PDF, dokumen, dsb)
   * @param {string} fileName - nama file yang didownload
   * @param {string} fileCategory - kategori: "laporan" | "dokumen" | "galeri"
   */
  function trackDownload(fileName, fileCategory = "dokumen") {
    sendGAEvent("file_download", {
      event_category: "engagement",
      event_label: fileName,
      file_name: fileName,
      file_category: fileCategory,
    });
  }

  /**
   * Tracking submit form kontak
   * @param {string} subject - subjek pesan
   */
  function trackContact(subject = "") {
    sendGAEvent("generate_lead", {
      event_category: "kontak",
      event_label: subject || "form_kontak",
      method: "web_form",
    });
  }

  /**
   * Tracking pencarian
   * @param {string} query - kata kunci yang dicari
   * @param {number} resultCount - jumlah hasil
   */
  function trackSearch(query, resultCount = 0) {
    sendGAEvent("search", {
      search_term: query,
      event_category: "pencarian",
      result_count: resultCount,
    });
  }

  /**
   * Tracking klik tombol layanan PTSP
   * @param {string} serviceName - nama layanan
   */
  function trackServiceClick(serviceName) {
    sendGAEvent("select_content", {
      event_category: "layanan",
      content_type: "layanan_ptsp",
      item_id: serviceName,
      event_label: serviceName,
    });
  }

  /**
   * Tracking klik share berita
   * @param {string} method - "whatsapp" | "copy_link" | "facebook"
   * @param {string} contentTitle - judul berita
   */
  function trackShare(method, contentTitle) {
    sendGAEvent("share", {
      method,
      content_type: "berita",
      item_id: contentTitle,
      event_category: "engagement",
    });
  }

  /**
   * Tracking scroll depth halaman berita
   * @param {number} percent - persentase 25 | 50 | 75 | 90 | 100
   * @param {string} slug - slug berita
   */
  function trackScrollDepth(percent, slug) {
    sendGAEvent("scroll_depth", {
      event_category: "engagement",
      event_label: slug,
      scroll_percent: percent,
      non_interaction: true,
    });
  }

  /**
   * Tracking klik link eksternal (telp, email, WhatsApp, dll)
   * @param {string} url - URL tujuan
   * @param {string} linkText - teks link
   */
  function trackOutboundLink(url, linkText = "") {
    sendGAEvent("click", {
      event_category: "outbound",
      event_label: linkText || url,
      transport_url: url,
    });
  }

  return {
    trackEvent,
    trackDownload,
    trackContact,
    trackSearch,
    trackServiceClick,
    trackShare,
    trackScrollDepth,
    trackOutboundLink,
  };
}
