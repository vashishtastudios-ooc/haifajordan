"use client";

export function HeroBackdrop() {
  return (
    <img
      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.22]"
      src="/haifa/haifajordanherobannerimg.jfif"
      alt=""
      decoding="async"
      loading="eager"
      aria-hidden
    />
  );
}
