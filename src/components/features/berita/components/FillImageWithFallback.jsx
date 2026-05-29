"use client";

import React, { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "/assets/branding/kemenag.svg";

export default function FillImageWithFallback({
  src,
  fallbackSrc = FALLBACK_IMAGE,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
}) {
  const [imgSrc, setImgSrc] = useState(null);
  const isEager = priority;

  return (
    <Image
      src={imgSrc || src || fallbackSrc}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      loading={isEager ? "eager" : undefined}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
