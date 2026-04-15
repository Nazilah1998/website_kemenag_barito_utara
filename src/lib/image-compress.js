export async function compressImageToBase64(
  file,
  {
    targetSizeKB = 95,
    maxWidth = 1600,
    maxHeight = 1600,
    initialQuality = 0.82,
    minQuality = 0.22,
    qualityStep = 0.06,
    maxResizeAttempts = 10,
    minWidth = 320,
    minHeight = 320,
    outputType = "image/webp",
    backgroundColor = "#ffffff",
  } = {},
) {
  if (!(file instanceof File)) {
    throw new Error("File gambar tidak valid.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  const originalSizeKB = Math.round(file.size / 1024);
  const targetBytes = Math.max(1, Math.round(targetSizeKB * 1024));

  const image = await loadImageFromFile(file);

  let width = image.naturalWidth || image.width;
  let height = image.naturalHeight || image.height;

  const initialRatio = Math.min(1, maxWidth / width, maxHeight / height);
  width = Math.max(1, Math.round(width * initialRatio));
  height = Math.max(1, Math.round(height * initialRatio));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Browser tidak mendukung canvas untuk kompresi gambar.");
  }

  let resizeAttempt = 0;
  let bestBlob = null;
  let bestWidth = width;
  let bestHeight = height;
  let bestQuality = initialQuality;

  while (resizeAttempt < maxResizeAttempts) {
    drawImageToCanvas({
      canvas,
      ctx,
      image,
      width,
      height,
      backgroundColor,
    });

    const attemptResult = await findBestBlobForCanvas(canvas, outputType, {
      initialQuality,
      minQuality,
      qualityStep,
      targetBytes,
    });

    if (attemptResult?.blob) {
      if (!bestBlob || attemptResult.blob.size < bestBlob.size) {
        bestBlob = attemptResult.blob;
        bestWidth = width;
        bestHeight = height;
        bestQuality = attemptResult.quality;
      }

      if (attemptResult.blob.size <= targetBytes) {
        const base64 = await blobToDataUrl(attemptResult.blob);

        return {
          base64,
          mimeType: outputType,
          sizeBytes: attemptResult.blob.size,
          sizeKB: Math.round(attemptResult.blob.size / 1024),
          originalSizeKB,
          width,
          height,
          quality: attemptResult.quality,
          fileName: replaceFileExtension(file.name, "webp"),
        };
      }
    }

    if (width <= minWidth && height <= minHeight) {
      break;
    }

    const currentSize = attemptResult?.blob?.size || Number.MAX_SAFE_INTEGER;
    const nextScale = getNextScaleFactor(currentSize, targetBytes);

    const nextWidth = Math.max(minWidth, Math.round(width * nextScale));
    const nextHeight = Math.max(minHeight, Math.round(height * nextScale));

    if (nextWidth === width && nextHeight === height) {
      break;
    }

    width = nextWidth;
    height = nextHeight;
    resizeAttempt += 1;
  }

  if (!bestBlob) {
    throw new Error("Kompresi gambar gagal.");
  }

  const fallbackBase64 = await blobToDataUrl(bestBlob);

  return {
    base64: fallbackBase64,
    mimeType: outputType,
    sizeBytes: bestBlob.size,
    sizeKB: Math.round(bestBlob.size / 1024),
    originalSizeKB,
    width: bestWidth,
    height: bestHeight,
    quality: bestQuality,
    fileName: replaceFileExtension(file.name, "webp"),
  };
}

function drawImageToCanvas({
  canvas,
  ctx,
  image,
  width,
  height,
  backgroundColor,
}) {
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
}

async function findBestBlobForCanvas(
  canvas,
  outputType,
  { initialQuality, minQuality, qualityStep, targetBytes },
) {
  let quality = normalizeQuality(initialQuality);
  const minQ = normalizeQuality(minQuality);
  const step = Math.max(0.01, qualityStep);

  let bestBlob = null;
  let bestQuality = quality;
  const triedQualities = new Set();

  while (quality >= minQ) {
    const normalizedQ = normalizeQuality(quality);

    if (triedQualities.has(normalizedQ)) {
      break;
    }

    triedQualities.add(normalizedQ);

    const blob = await canvasToBlob(canvas, outputType, normalizedQ);

    if (!blob) {
      throw new Error("Gagal membuat blob hasil kompresi.");
    }

    if (!bestBlob || blob.size < bestBlob.size) {
      bestBlob = blob;
      bestQuality = normalizedQ;
    }

    if (blob.size <= targetBytes) {
      return {
        blob,
        quality: normalizedQ,
      };
    }

    quality = normalizeQuality(quality - step);
  }

  if (bestBlob) {
    return {
      blob: bestBlob,
      quality: bestQuality,
    };
  }

  return null;
}

function getNextScaleFactor(currentBytes, targetBytes) {
  if (!Number.isFinite(currentBytes) || currentBytes <= 0 || targetBytes <= 0) {
    return 0.82;
  }

  const ratio = currentBytes / targetBytes;

  if (ratio >= 3.5) return 0.62;
  if (ratio >= 2.5) return 0.68;
  if (ratio >= 1.8) return 0.74;
  if (ratio >= 1.35) return 0.8;
  if (ratio >= 1.15) return 0.86;

  return 0.9;
}

function normalizeQuality(value) {
  return Math.max(0.05, Math.min(0.95, Number(value.toFixed(2))));
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Gagal membaca file gambar."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Gagal mengubah blob menjadi base64."));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => reject(new Error("Gagal membaca blob."));
    reader.readAsDataURL(blob);
  });
}

function replaceFileExtension(fileName, nextExt) {
  const safeName = String(fileName || "image")
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeName || "image"}.${nextExt}`;
}
