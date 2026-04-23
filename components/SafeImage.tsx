"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

/** Renders an <img> that silently disappears if the URL is broken. */
export default function SafeImage({ src, alt = "", width, height, style }: Props) {
  const [dead, setDead] = useState(false);
  if (dead) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
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
