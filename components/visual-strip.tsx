"use client";

import { useEffect, useRef, useState } from "react";
import { MediaImage } from "@/components/media-image";
import { SITE_MEDIA, type HaifaReel } from "@/lib/site-media";

function PlaceholderTile({ caption }: { caption: string }) {
  return (
    <div className="flex h-full min-h-[200px] w-[min(72vw,280px)] shrink-0 flex-col justify-end border border-[rgba(196,128,106,0.2)] bg-[linear-gradient(160deg,#1e1210,#0a0806)] p-5 md:min-h-[240px] md:w-[300px]">
      <p className="font-display text-lg text-[#E8C4B8]/80 italic">{caption}</p>
      <p className="mt-2 text-[9px] leading-relaxed tracking-[0.12em] text-[rgba(245,240,238,0.35)] uppercase">
        Add image to public folder
      </p>
    </div>
  );
}

export function VisualStrip() {
  return (
    <section
      id="visuals"
      className="scroll-mt-24 border-y border-[rgba(196,128,106,0.12)] bg-[#080808] py-20 md:py-24"
    >
      <div className="mb-10 px-6 md:px-10">
        <p className="section-label mb-3 text-[9px] font-semibold tracking-[0.35em] text-[#C4806A] uppercase">
          Film strip
        </p>
        <h2 className="font-display max-w-xl text-2xl font-normal text-[#F5F0EE] italic md:text-3xl">
          Haifa on stage and behind the scenes.
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto px-6 pb-2 [scrollbar-color:rgba(196,128,106,0.4)_transparent] md:gap-5 md:px-10">
        {SITE_MEDIA.reels.map((reel) => (
          <div
            key={reel.mp4}
            className="relative aspect-[9/16] w-[min(72vw,200px)] shrink-0 overflow-hidden border border-[rgba(196,128,106,0.25)] bg-[#0d0c0b] md:w-[220px]"
          >
            <ReelVideo reel={reel} />
          </div>
        ))}

        {SITE_MEDIA.gallery.map((item) => (
          <MediaImage
            key={item.candidates[0]}
            candidates={item.candidates}
            alt={item.caption}
            fill
            sizes="300px"
            className="relative aspect-[3/4] w-[min(72vw,280px)] shrink-0 overflow-hidden md:w-[300px]"
            imgClassName="object-cover transition-transform duration-500 hover:scale-[1.03]"
            fallback={<PlaceholderTile caption={item.caption} />}
          />
        ))}
      </div>
    </section>
  );
}

function ReelVideo({ reel }: { reel: HaifaReel }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || useFallback) return;

    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.playsInline = true;

    const kick = () => {
      void v.play().catch(() => {});
    };

    kick();
    v.addEventListener("loadeddata", kick);
    v.addEventListener("canplay", kick);
    return () => {
      v.removeEventListener("loadeddata", kick);
      v.removeEventListener("canplay", kick);
    };
  }, [reel.mp4, useFallback]);

  if (useFallback) {
    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center p-4 text-center md:min-h-[240px]">
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
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={reel.poster}
      disablePictureInPicture
      onError={() => setUseFallback(true)}
      aria-label="Reel preview (silent loop)"
    >
      {reel.webm ? <source src={reel.webm} type="video/webm" /> : null}
      <source src={reel.mp4} type="video/mp4" />
    </video>
  );
}
