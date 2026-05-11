"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes, RefObject } from "react";
import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

export type AnimatedBeamProps = {
  className?: string;
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
  dotted?: boolean;
  dotSpacing?: number;
};

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 7,
  delay = 0,
  pathColor = "rgba(196,128,106,0.35)",
  pathWidth = 2,
  pathOpacity = 0.35,
  gradientStartColor = "#E8C4B8",
  gradientStopColor = "#C4806A",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  dotted = false,
  dotSpacing = 6,
}: AnimatedBeamProps) {
  const rawId = useId().replace(/:/g, "");
  const gradId = `beam-grad-${rawId}`;
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathD, setPathD] = useState("");
  const [gradientEnds, setGradientEnds] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    const update = () => {
      const c = containerRef.current;
      const fromEl = fromRef.current;
      const toEl = toRef.current;
      if (!c || !fromEl || !toEl) return;

      const cr = c.getBoundingClientRect();
      const fr = fromEl.getBoundingClientRect();
      const tr = toEl.getBoundingClientRect();

      let x1 = fr.left + fr.width / 2 - cr.left + startXOffset;
      let y1 = fr.top + fr.height / 2 - cr.top + startYOffset;
      let x2 = tr.left + tr.width / 2 - cr.left + endXOffset;
      let y2 = tr.top + tr.height / 2 - cr.top + endYOffset;

      if (reverse) {
        const tx = x1;
        const ty = y1;
        x1 = x2;
        y1 = y2;
        x2 = tx;
        y2 = ty;
      }

      const mx = (x1 + x2) / 2 + curvature;
      const my = (y1 + y2) / 2;
      const d = `M ${x1},${y1} Q ${mx},${my} ${x2},${y2}`;
      setPathD(d);
      setGradientEnds({ x1, y1, x2, y2 });
    };

    update();

    const ro = new ResizeObserver(update);
    const root = containerRef.current;
    if (root) ro.observe(root);

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    const id = window.setInterval(update, 160);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      window.clearInterval(id);
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    reverse,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  useLayoutEffect(() => {
    if (!pathD || !pathRef.current) return;
    setPathLength(pathRef.current.getTotalLength());
  }, [pathD]);

  const dashPattern = dotted ? `${dotSpacing} ${dotSpacing}` : undefined;
  const head = pathLength > 0 ? Math.min(56, pathLength * 0.22) : 24;
  const tailGap = pathLength > 0 ? pathLength : 400;

  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible",
        className,
      )}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1={gradientEnds.x1}
          y1={gradientEnds.y1}
          x2={gradientEnds.x2}
          y2={gradientEnds.y2}
        >
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="45%" stopColor={gradientStopColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStartColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        ref={pathRef}
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
        strokeDasharray={dashPattern}
        fill="none"
      />

      {pathLength > 0 ? (
        <path
          d={pathD}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={pathWidth + 1.25}
          strokeLinecap="round"
          strokeDasharray={`${head} ${tailGap}`}
          strokeDashoffset={0}
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to={-pathLength}
            dur={`${duration}s`}
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
        </path>
      ) : null}
    </svg>
  );
}

export const Circle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Circle({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[rgba(196,128,106,0.4)] bg-[#080808] text-[#E8C4B8]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export const Icons = {
  logo: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="text-[#E8C4B8]">
      <path
        fill="currentColor"
        d="M12 3 20 7v10l-8 4-8-4V7l8-4Zm0 2.18L6 8.82v8.36l6 3 6-3V8.82l-6-3.64Z"
      />
    </svg>
  ),
  user: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="text-[#C4806A]">
      <path
        fill="currentColor"
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
      />
    </svg>
  ),
};
