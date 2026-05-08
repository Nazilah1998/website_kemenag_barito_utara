import { useState } from "react";

export function useDocumentActions() {
  const [openDocId, setOpenDocId] = useState(null);
  const [failedPreviewById, setFailedPreviewById] = useState({});
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

  const togglePreview = (docId) => {
    if (openDocId === docId) {
      setOpenDocId(null);
    } else {
      setFailedPreviewById((prev) => ({ ...prev, [docId]: false }));
      setOpenDocId(docId);
    }
  };

  const setFailedPreview = (docId, state) => {
    setFailedPreviewById((prev) => ({ ...prev, [docId]: state }));
  };

  return {
    openDocId,
    setOpenDocId,
    failedPreviewById,
    isDownloading,
    handleDownload,
    togglePreview,
    setFailedPreview,
  };
}
