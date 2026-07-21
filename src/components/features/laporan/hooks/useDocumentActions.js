import { useState } from "react";
import { logError } from "@/lib/logger";
import { useGAEvent } from "@/hooks/useGAEvent";

export function useDocumentActions() {
  const [isDownloading, setIsDownloading] = useState(null);
  const { trackDownload } = useGAEvent();

  const handleDownload = async (url, fileName) => {
    setIsDownloading(url);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // ✅ GA4 event — tracking download laporan berhasil
      trackDownload(link.download, "laporan");
    } catch (error) {
      logError("document_download_error", { error: error?.message });
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = fileName;
      link.click();

      // ✅ GA4 event — tracking download via fallback (tab baru)
      trackDownload(fileName, "laporan");
    } finally {
      setIsDownloading(null);
    }
  };

  return {
    isDownloading,
    handleDownload,
  };
}
