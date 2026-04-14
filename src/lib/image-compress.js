export async function compressImageToBase64(
  file,
  {
    targetSizeKB = 150,
    maxWidth = 1600,
    maxHeight = 1600,
    initialQuality = 0.9,
    minQuality = 0.45,
    qualityStep = 0.07,
    maxResizeAttempts = 6,
    outputType = "image/webp",
  } = {},
) {
  if (!(file instanceof File)) {
    throw new Error("File gambar tidak valid.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  const originalSizeKB = Math.round(file.size / 1024);
  const targetBytes = targetSizeKB * 1024;

  const image = await loadImageFromFile(file);

  let width = image.naturalWidth || image.width;
  let height = image.naturalHeight || image.height;

  const ratio = Math.min(1, maxWidth / width, maxHeight / height);
  width = Math.max(1, Math.round(width * ratio));
  height = Math.max(1, Math.round(height * ratio));

  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Browser tidak mendukung canvas untuk kompresi gambar.");
  }

  let resizeAttempt = 0;
  let bestBlob = null;
  let bestWidth = width;
  let bestHeight = height;

  while (resizeAttempt < maxResizeAttempts) {
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    let quality = initialQuality;
    let blob = null;

    while (quality >= minQuality) {
      blob = await canvasToBlob(canvas, outputType, quality);

      if (!blob) {
        throw new Error("Gagal membuat blob hasil kompresi.");
      }

      bestBlob = blob;
      bestWidth = width;
      bestHeight = height;

      if (blob.size <= targetBytes) {
        const base64 = await blobToDataUrl(blob);

        return {
          base64,
          mimeType: outputType,
          sizeBytes: blob.size,
          sizeKB: Math.round(blob.size / 1024),
          originalSizeKB,
          width,
          height,
          fileName: replaceFileExtension(file.name, "webp"),
        };
      }

      quality -= qualityStep;
    }

    width = Math.max(720, Math.round(width * 0.85));
    height = Math.max(720, Math.round(height * 0.85));
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
    fileName: replaceFileExtension(file.name, "webp"),
  };
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
