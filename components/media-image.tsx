"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";

type BaseProps = {
  alt: string;
  fallback: ReactNode;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Try these URLs in order until one loads (useful for unknown .jpg vs .png). */
  candidates?: readonly string[];
  src?: string;
};

type MediaImageProps = BaseProps &
  (
    | { fill: true; width?: never; height?: never }
    | { fill?: false; width: number; height: number }
  );

function resolveUrls(src: string | undefined, candidates: readonly string[] | undefined) {
  if (candidates && candidates.length > 0) {
    return [...candidates];
  }
  if (src) {
    return [src];
  }
  return [];
}

export function MediaImage({
  src,
  candidates,
  alt,
  fallback,
  className,
  imgClassName,
  priority,
  fill,
  width,
  height,
}: MediaImageProps) {
  const urls = useMemo(() => resolveUrls(src, candidates), [src, candidates]);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  const current = urls[attempt] ?? null;

  const onError = useCallback(() => {
    setAttempt((i) => {
      if (i + 1 < urls.length) {
        return i + 1;
      }
      setFailed(true);
      return i;
    });
  }, [urls.length]);

  if (urls.length === 0 || failed || !current) {
    if (fill) {
      return (
        <div className={`relative ${className ?? ""}`}>
          <div className="absolute inset-0 overflow-hidden">{fallback}</div>
        </div>
      );
    }
    return <>{fallback}</>;
  }

  const imgProps = {
    src: current,
    alt,
    onError,
    decoding: "async" as const,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    ...(priority ? { fetchPriority: "high" as const } : {}),
  };

  if (fill) {
    return (
      <div className={`relative ${className ?? ""}`}>
        <img
          {...imgProps}
          key={current}
          className={`absolute inset-0 block h-full w-full object-cover ${imgClassName ?? ""}`}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        {...imgProps}
        key={current}
        width={width}
        height={height}
        className={imgClassName}
      />
    </div>
  );
}
