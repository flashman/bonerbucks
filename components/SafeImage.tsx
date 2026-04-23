"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

/** Renders an image that silently disappears if the URL is broken.
 *  Uses next/image when dimensions are known, plain <img> otherwise
 *  (external URLs like imgur don't have knowable dimensions). */
export default function SafeImage({ src, alt = "", width, height, style }: Props) {
  const [dead, setDead] = useState(false);
  if (dead) return null;

  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={style}
        onError={() => setDead(true)}
        loading="lazy"
      />
    );
  }

  // No dimensions — use a plain img so Next.js doesn't complain about
  // missing width/height on external URLs we can't introspect at build time.
   
  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setDead(true)}
      loading="lazy"
    />
  );
}
