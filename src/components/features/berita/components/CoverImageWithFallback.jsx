"use client";

import React, { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "/assets/branding/kemenag.svg";

export default function CoverImageWithFallback({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  sizes = "100vw",
}) {
  const [imgSrc, setImgSrc] = useState(null);
  const isEager = priority;

  return (
    <Image
      src={imgSrc || src || FALLBACK_IMAGE}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={isEager ? "eager" : undefined}
      className={className}
      sizes={sizes}
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
}
