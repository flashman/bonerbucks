"use client";

import { createPortal } from "react-dom";
import { useState } from "react";

interface Props {
  src: string;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] cursor-pointer"
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Boner sighting"
        onLoad={() => setLoaded(true)}
        className={`max-w-full max-h-full border-[10px] border-white transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0 absolute"}`}
      />
    </div>,
    document.body
  );
}
