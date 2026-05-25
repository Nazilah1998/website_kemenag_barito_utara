import { useState } from "react";

export function useDocumentActions() {
  const [isDownloading, setIsDownloading] = useState(null);

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
    } catch (error) {
      console.error("Download failed:", error);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = fileName;
      link.click();
    } finally {
      setIsDownloading(null);
    }
  };

  return {
    isDownloading,
    handleDownload,
  };
}
