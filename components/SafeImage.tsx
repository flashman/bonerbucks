"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt?: string;
  width?: number ;
  height?: number ;
  style?: React.CSSProperties;
}

/** Renders an <img> that silently disappears if the URL is broken. */
export default function SafeImage({ src, alt = "", width, height, style }: Props) {
  const [dead, setDead] = useState(false);
  if (dead) return null;
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
