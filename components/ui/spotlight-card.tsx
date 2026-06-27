"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type SpotlightGroupProps = {
  children: ReactNode;
  className?: string;
  /** Distance in px over which a card fades in as the cursor approaches. */
  proximity?: number;
};

/**
 * Wraps a set of SpotlightCards and tracks the pointer once for all of them,
 * writing per-card CSS vars (--spot-x/--spot-y/--prox) so each card lights up
 * by proximity — even before the cursor is directly over it.
 */
export function SpotlightGroup({
  children,
  className,
  proximity = 260,
}: SpotlightGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let raf = 0;
    const apply = (clientX: number, clientY: number) => {
      const cards = root.querySelectorAll<HTMLElement>("[data-spotlight-card]");
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", `${clientX - r.left}px`);
        card.style.setProperty("--spot-y", `${clientY - r.top}px`);
        const dx = Math.max(r.left - clientX, 0, clientX - r.right);
        const dy = Math.max(r.top - clientY, 0, clientY - r.bottom);
        const dist = Math.hypot(dx, dy);
        const prox = Math.max(0, 1 - dist / proximity);
        card.style.setProperty("--prox", prox.toFixed(3));
      });
    };

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => apply(e.clientX, e.clientY));
    };
    const reset = () => {
      root
        .querySelectorAll<HTMLElement>("[data-spotlight-card]")
        .forEach((c) => c.style.setProperty("--prox", "0"));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", reset);
      document.removeEventListener("pointerleave", reset);
    };
  }, [proximity]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Radial fill colour that follows the cursor inside the card. */
  spotlightColor?: string;
  /** Radial colour that glows along the border near the cursor. */
  borderColor?: string;
};

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(196,128,106,0.22)",
  borderColor = "rgba(232,196,184,0.55)",
}: SpotlightCardProps) {
  return (
    <div
      data-spotlight-card
      style={
        {
          "--prox": 0,
          "--spot-x": "50%",
          "--spot-y": "50%",
        } as CSSProperties
      }
      className={cn(
        "relative overflow-hidden rounded-xl p-px transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={
          {
            opacity: "var(--prox)",
            background: `radial-gradient(240px circle at var(--spot-x) var(--spot-y), ${borderColor}, transparent 65%)`,
          } as CSSProperties
        }
        aria-hidden
      />
      <div className="relative h-full rounded-[11px] bg-[#161312]">
        <div
          className="pointer-events-none absolute inset-0 rounded-[11px]"
          style={
            {
              opacity: "var(--prox)",
              background: `radial-gradient(320px circle at var(--spot-x) var(--spot-y), ${spotlightColor}, transparent 60%)`,
            } as CSSProperties
          }
          aria-hidden
        />
        <div className="relative z-[1] h-full">{children}</div>
      </div>
    </div>
  );
}
