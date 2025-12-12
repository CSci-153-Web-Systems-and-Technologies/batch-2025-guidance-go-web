"use client";

import Image from "next/image";
import { useState } from "react";

// Reusable logo image with PNG -> SVG fallback
// Usage examples:
// <LogoImage width={32} height={32} priority className="rounded" />
// <div className="relative h-8 w-8"><LogoImage fill sizes="32px" className="object-contain" /></div>
export type LogoProps = Omit<React.ComponentProps<typeof Image>, "src" | "alt"> & {
  pngSrc?: string;
  fallbackSrc?: string;
};

export function LogoImage({ pngSrc = "/logo.png", fallbackSrc = "/next.svg", ...imgProps }: LogoProps) {
  const [src, setSrc] = useState<string>(pngSrc);
  return (
    <Image
      {...imgProps}
      src={src}
      alt="GuidanceGo logo"
      onError={() => {
        if (src !== fallbackSrc) setSrc(fallbackSrc);
      }}
    />
  );
}
