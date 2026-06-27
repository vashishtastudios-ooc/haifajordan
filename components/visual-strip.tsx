"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MediaImage } from "@/components/media-image";
import { SITE_MEDIA, type HaifaReel } from "@/lib/site-media";

type Slide =
  | { type: "video"; key: string; caption: string; alt: string; reel: HaifaReel }
  | {
      type: "image";
      key: string;
      caption: string;
      candidates: readonly string[];
      alt: string;
    };

function PlaceholderTile({ caption }: { caption: string }) {
  return (
    <div className="flex h-full w-full flex-col justify-end bg-[linear-gradient(160deg,#1e1210,#0a0806)] p-5">
      <p className="font-display text-lg text-[#E8C4B8]/80 italic">{caption}</p>
      <p className="mt-2 text-[9px] leading-relaxed tracking-[0.12em] text-[rgba(245,240,238,0.35)] uppercase">
        Add media to public folder
      </p>
    </div>
  );
}

export function VisualStrip() {
  const slides = useMemo<Slide[]>(() => {
    const reels: Slide[] = SITE_MEDIA.reels.map((reel) => ({
      type: "video",
      key: reel.mp4,
      caption: reel.caption,
      alt: reel.alt,
      reel,
    }));
    const images: Slide[] = SITE_MEDIA.gallery.map((item) => ({
      type: "image",
      key: item.candidates[0],
      caption: item.caption,
      candidates: item.candidates,
      alt: item.alt,
    }));
    return [...reels, ...images];
  }, []);

  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startScroll: 0,
  });
  const [dragging, setDragging] = useState(false);

  const recomputeActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let min = Infinity;
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(elCenter - center);
      if (dist < min) {
        min = dist;
        nearest = i;
      }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(recomputeActive);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    recomputeActive();
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
    };
  }, [recomputeActive]);

  const scrollToIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, slideRefs.current.length - 1));
    const el = slideRefs.current[clamped];
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startScroll: track.scrollLeft,
    };
    setDragging(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag.active || !track) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 4) drag.moved = true;
    track.scrollLeft = drag.startScroll - dx;
  }, []);

  const endDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    setDragging(false);
    const track = trackRef.current;
    if (track && drag.moved) {
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let min = Infinity;
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const elCenter = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(elCenter - center);
        if (dist < min) {
          min = dist;
          nearest = i;
        }
      });
      scrollToIndex(nearest);
    }
  }, [scrollToIndex]);

  const onDragStartCapture = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (dragRef.current.active) e.preventDefault();
    },
    [],
  );

  return (
    <section
      id="visuals"
      className="scroll-mt-24 overflow-hidden border-y border-[rgba(196,128,106,0.12)] bg-[#080808] py-20 md:py-24"
    >
      <div className="mb-10 flex items-end justify-between gap-6 px-6 md:px-10">
        <div>
          <p className="section-label mb-3 text-[9px] font-semibold tracking-[0.35em] text-[#C4806A] uppercase">
            Film strip
          </p>
          <h2 className="font-display max-w-xl text-2xl font-normal text-[#F5F0EE] italic md:text-3xl">
            Haifa on stage and behind the scenes.
          </h2>
        </div>

        <div className="hidden shrink-0 items-center gap-2.5 md:flex">
          <CarouselButton
            direction="prev"
            disabled={active === 0}
            onClick={() => scrollToIndex(active - 1)}
          />
          <CarouselButton
            direction="next"
            disabled={active === slides.length - 1}
            onClick={() => scrollToIndex(active + 1)}
          />
        </div>
      </div>

      <div
        ref={trackRef}
        className={`flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(1.5rem,calc(50vw-150px))] pb-4 md:gap-6 md:px-[max(2.5rem,calc(50vw-170px))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing select-none [scroll-behavior:auto]" : "scroll-smooth md:cursor-grab"
        }`}
        style={{ WebkitOverflowScrolling: "touch" }}
        role="group"
        aria-roledescription="carousel"
        aria-label="Haifa visuals"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onDragStartCapture={onDragStartCapture}
      >
        {slides.map((slide, i) => {
          const isActive = i === active;
          return (
            <div
              key={slide.key}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="group relative w-[78vw] max-w-[300px] shrink-0 snap-center transition-[transform,opacity,filter] duration-500 ease-out md:w-[340px]"
              style={{
                transform: isActive ? "scale(1)" : "scale(0.9)",
                opacity: isActive ? 1 : 0.45,
                filter: isActive ? "none" : "saturate(0.85)",
              }}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length} — ${slide.alt}`}
            >
              <div
                className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border bg-[#0d0c0b] transition-[border-color,box-shadow] duration-500"
                style={{
                  borderColor: isActive
                    ? "rgba(196,128,106,0.55)"
                    : "rgba(196,128,106,0.18)",
                  boxShadow: isActive
                    ? "0 24px 60px -28px rgba(196,128,106,0.6)"
                    : "none",
                }}
              >
                {slide.type === "video" ? (
                  <ReelVideo reel={slide.reel} play={isActive} label={slide.alt} />
                ) : (
                  <MediaImage
                    candidates={slide.candidates}
                    alt={slide.alt}
                    fill
                    sizes="(min-width: 768px) 340px, 78vw"
                    className="h-full w-full"
                    imgClassName="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    fallback={<PlaceholderTile caption={slide.caption} />}
                  />
                )}

                {slide.type === "video" ? (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent p-5 pt-12">
                    <span className="mb-1 block text-[8px] font-semibold tracking-[0.28em] text-[#C4806A] uppercase">
                      Reel
                    </span>
                    <p className="font-display text-lg text-[#F5F0EE] italic">
                      {slide.caption}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-7 flex items-center justify-center gap-2 px-6">
        {slides.map((slide, i) => {
          const isActive = i === active;
          return (
            <button
              key={slide.key}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${slide.alt}`}
              aria-current={isActive}
              className="group flex h-6 items-center"
            >
              <span
                className="block h-[3px] rounded-full transition-all duration-300"
                style={{
                  width: isActive ? 28 : 10,
                  backgroundColor: isActive
                    ? "#C4806A"
                    : "rgba(245,240,238,0.25)",
                }}
              />
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-[9px] tracking-[0.28em] text-[rgba(245,240,238,0.35)] uppercase md:hidden">
        Swipe to explore
      </p>
    </section>
  );
}

function CarouselButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(196,128,106,0.35)] text-[#E8C4B8] transition-all hover:border-[#C4806A] hover:bg-[rgba(196,128,106,0.1)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        {direction === "prev" ? (
          <path
            fill="currentColor"
            d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
          />
        ) : (
          <path
            fill="currentColor"
            d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"
          />
        )}
      </svg>
    </button>
  );
}

function ReelVideo({
  reel,
  play,
  label,
}: {
  reel: HaifaReel;
  play: boolean;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || useFallback) return;

    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.playsInline = true;

    if (play) {
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [play, reel.mp4, useFallback]);

  if (useFallback) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <p className="font-display text-sm text-[#E8C4B8]/90 italic">Reel slot</p>
        <p className="mt-2 max-w-[14ch] break-all text-[8px] tracking-[0.15em] text-[rgba(245,240,238,0.35)] uppercase">
          {reel.mp4}
        </p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className="h-full w-full object-cover"
      muted
      loop
      playsInline
      preload="metadata"
      poster={reel.poster}
      disablePictureInPicture
      onError={() => setUseFallback(true)}
      aria-label={label}
    >
      {reel.webm ? <source src={reel.webm} type="video/webm" /> : null}
      <source src={reel.mp4} type="video/mp4" />
    </video>
  );
}
