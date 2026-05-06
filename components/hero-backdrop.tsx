"use client";

import { useCallback, useState } from "react";
import { SITE_MEDIA } from "@/lib/site-media";

export function HeroBackdrop() {
  const { poster, videoWebm, videoMp4 } = SITE_MEDIA.hero;
  const [hidden, setHidden] = useState(false);
  const onError = useCallback(() => setHidden(true), []);

  if (hidden) {
    return null;
  }

  return (
    <video
      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.22]"
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      onError={onError}
      aria-hidden
    >
      <source src={videoWebm} type="video/webm" />
      <source src={videoMp4} type="video/mp4" />
    </video>
  );
}
