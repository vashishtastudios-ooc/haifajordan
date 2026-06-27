"use client";

import { SITE_MEDIA } from "@/lib/site-media";

export function HeroBackdrop() {
  return (
    <img
      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.22]"
      src={SITE_MEDIA.hero.bannerSrc}
      alt={SITE_MEDIA.hero.bannerAlt}
      decoding="async"
      loading="eager"
      aria-hidden
    />
  );
}
