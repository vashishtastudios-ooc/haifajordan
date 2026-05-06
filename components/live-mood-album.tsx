"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { MediaImage } from "@/components/media-image";
import { SITE_MEDIA } from "@/lib/site-media";
import { THE_MOOD_TRACKS } from "@/lib/the-mood-audio";
import { getMoodStreamOutlets } from "@/lib/the-mood-stream-links";

const moods = [
  {
    id: "warm",
    label: "Warm-up",
    blurb: "Lights low, bass warming the boards — the room leans in before the drop.",
    glow: "rgba(232,196,184,0.35)",
  },
  {
    id: "peak",
    label: "Peak floor",
    blurb: "Hands up, kick forward — this is the pocket where the night earns its name.",
    glow: "rgba(196,128,106,0.55)",
  },
  {
    id: "after",
    label: "Afterglow",
    blurb: "Smoke in the vocal, ride on the hats — the kind of finish that follows you home.",
    glow: "rgba(160,96,74,0.45)",
  },
] as const;

function scaleRgbaAlpha(rgba: string, factor: number) {
  const m = rgba.match(
    /^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i,
  );
  if (!m) return rgba;
  const nextA = Math.max(0, Math.min(1, Number(m[4]) * factor));
  return `rgba(${m[1]},${m[2]},${m[3]},${nextA})`;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function useCountdown(target: Date) {
  /** `null` until after mount — avoids SSR/client `Date.now()` mismatch (hydration). */
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  if (now === null) {
    return { pending: true as const, d: 0, h: 0, m: 0, s: 0, past: false };
  }

  const diff = Math.max(0, target.getTime() - now);
  const s = Math.floor(diff / 1000) % 60;
  const m = Math.floor(diff / 60000) % 60;
  const h = Math.floor(diff / 3600000) % 24;
  const d = Math.floor(diff / 86400000);
  return { pending: false as const, d, h, m, s, past: diff === 0 };
}

export function LiveMoodAlbum() {
  const fullRelease = new Date("2026-05-21T23:59:59+01:00");
  const cd = useCountdown(fullRelease);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const dockProgressRef = useRef<HTMLDivElement | null>(null);
  const resumeAfterTrackChangeRef = useRef(false);

  const [moodIndex, setMoodIndex] = useState(1);
  const [roomCount, setRoomCount] = useState(1842);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loadError, setLoadError] = useState(false);
  /** After first successful play, sticky dock stays for the session. */
  const [dockEngaged, setDockEngaged] = useState(false);

  const mood = moods[moodIndex];
  const track = THE_MOOD_TRACKS[activeTrack];

  const togglePlay = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      setLoadError(false);
      try {
        await a.play();
      } catch {
        setToast("Playback blocked — tap play again or check the file.");
        window.setTimeout(() => setToast(null), 4000);
      }
    } else {
      a.pause();
    }
  }, []);

  const selectTrack = useCallback(
    (index: number) => {
      if (index === activeTrack) return;
      resumeAfterTrackChangeRef.current = isPlaying;
      setActiveTrack(index);
      setLoadError(false);
      setCurrentTime(0);
      setDuration(0);
    },
    [activeTrack, isPlaying],
  );

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
  }, [volume, activeTrack]);

  useEffect(() => {
    if (!dockEngaged || loadError) {
      document.documentElement.style.paddingBottom = "";
      return;
    }
    document.documentElement.style.paddingBottom = "5.75rem";
    return () => {
      document.documentElement.style.paddingBottom = "";
    };
  }, [dockEngaged, loadError]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!resumeAfterTrackChangeRef.current) {
      return;
    }
    resumeAfterTrackChangeRef.current = false;
    void a.play().catch(() => {
      setLoadError(true);
      setIsPlaying(false);
    });
  }, [activeTrack]);

  const cycleMood = useCallback(() => {
    setMoodIndex((i) => (i + 1) % moods.length);
  }, []);

  const joinRoom = useCallback(() => {
    setRoomCount((c) => c + 7 + Math.floor(Math.random() * 19));
    setToast("You're in the queue — thanks for vibing.");
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const seekFromProgressBar = useCallback((clientX: number, bar: HTMLDivElement | null) => {
    const a = audioRef.current;
    if (!bar || !a || !Number.isFinite(a.duration) || a.duration <= 0) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    a.currentTime = pct * a.duration;
    setCurrentTime(a.currentTime);
  }, []);

  const progressPct =
    duration > 0 && Number.isFinite(duration)
      ? Math.min(100, (currentTime / duration) * 100)
      : 0;

  /** Sync visual pulse to playback clock (proxy beat when track is running). */
  const musicPulse = useMemo(() => {
    if (!isPlaying) return 0;
    return (Math.sin(currentTime * Math.PI * 2 * 1.9) + 1) / 2;
  }, [currentTime, isPlaying]);

  const deckShadow = useMemo(() => {
    const spread = Math.round(80 + musicPulse * 34);
    const lift = Math.round(-20 - musicPulse * 8);
    const glow = scaleRgbaAlpha(mood.glow, 1 + musicPulse * 0.75);
    return `0 0 ${spread}px ${lift}px ${glow}`;
  }, [mood.glow, musicPulse]);

  return (
    <section
      id="music"
      className="scroll-mt-24 border-t border-[rgba(196,128,106,0.12)] bg-[#1c1918] px-6 py-24 md:px-10 md:py-28"
    >
      <audio
        key={activeTrack}
        ref={audioRef}
        className="hidden"
        playsInline
        preload="metadata"
        onPlay={() => {
          setIsPlaying(true);
          setLoadError(false);
          setDockEngaged(true);
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          setDuration(Number.isFinite(d) ? d : 0);
          setLoadError(false);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setLoadError(true);
          setIsPlaying(false);
        }}
      >
        {track.sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </audio>

      <div className="mx-auto max-w-[820px]">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(196,128,106,0.35)] bg-[#080808]/80 px-3 py-1 text-[8px] font-bold tracking-[0.25em] text-[#E8C4B8] uppercase">
              <span className="relative flex h-2 w-2">
                {isPlaying ? (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C4806A] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C4806A]" />
                  </>
                ) : (
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#666]" />
                )}
              </span>
              On rotation · Mi-Soul
            </p>
            <h2 className="font-display text-4xl font-normal text-[#F5F0EE] italic md:text-5xl">
              The Mood — live desk
            </h2>
            <p className="mt-2 text-[10px] tracking-[0.3em] text-[#C4806A] uppercase">
              Ronnie Herel ft. Haifa · Deck preview
            </p>
          </div>
          <button
            type="button"
            onClick={() => void togglePlay()}
            className={`flex items-center gap-3 rounded-full border px-5 py-2.5 text-[9px] font-bold tracking-[0.2em] uppercase transition-all ${
              isPlaying
                ? "live-ring border-[#C4806A] bg-[rgba(196,128,106,0.12)] text-[#F5F0EE]"
                : "border-[rgba(196,128,106,0.25)] text-[rgba(245,240,238,0.45)] hover:border-[#C4806A]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${isPlaying ? "bg-[#4ade80]" : "bg-[#666]"}`}
            />
            {isPlaying ? "On air" : "Standby"}
          </button>
        </div>

        <div
          className="grid gap-12 rounded-sm border border-[rgba(196,128,106,0.2)] bg-[#080808]/40 p-8 md:grid-cols-2 md:gap-16 md:p-10"
          style={{
            boxShadow: deckShadow,
            transition: "box-shadow 150ms linear",
          }}
        >
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => void togglePlay()}
              className="group relative aspect-square w-full max-w-[320px] cursor-pointer overflow-hidden rounded-full border border-[rgba(196,128,106,0.25)] bg-gradient-to-br from-[#1e1210] to-[#0a0806] shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4806A]"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <div className="absolute inset-0 z-0">
                <MediaImage
                  candidates={SITE_MEDIA.albumCoverCandidates}
                  alt="The Mood — single artwork"
                  fill
                  sizes="320px"
                  className="h-full w-full"
                  imgClassName="object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                  fallback={
                    <div className="h-full w-full bg-gradient-to-br from-[#1e1210] to-[#0a0806]" />
                  }
                />
              </div>
              <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_40%_40%,rgba(196,128,106,0.12),transparent_55%)]" />
              <div
                className={`absolute inset-[18%] z-[2] rounded-full border border-[rgba(196,128,106,0.2)] bg-[#0d0a09]/75 backdrop-blur-[2px] ${isPlaying ? "vinyl-spinning" : ""}`}
              />
              <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center px-6">
                <span className="font-display bg-gradient-to-br from-[#E8C4B8] to-[#C4806A] bg-clip-text text-3xl text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] italic md:text-4xl">
                  {isPlaying ? "Playing" : "Play"}
                </span>
                <span className="mt-1 text-[10px] tracking-[0.2em] text-[rgba(245,240,238,0.55)] uppercase drop-shadow-sm">
                  Quantize · 2026
                </span>
              </div>
              <span className="absolute bottom-8 left-1/2 z-[4] -translate-x-1/2 rounded-full border border-[rgba(196,128,106,0.45)] bg-[rgba(8,8,8,0.82)] px-3 py-1.5 text-[9px] font-semibold tracking-[0.2em] text-[#F5F0EE] uppercase shadow-[0_0_18px_rgba(0,0,0,0.45)]">
                Click to play
              </span>
            </button>

            <div
              className={`mt-8 flex h-14 w-full max-w-[280px] items-end justify-center gap-1.5 px-4 ${isPlaying ? "" : "eq-paused"}`}
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <span
                  key={i}
                  className="eq-bar w-1.5 rounded-full bg-gradient-to-t from-[#A0604A] to-[#E8C4B8]"
                  style={{ height: `${28 + ((i * 17) % 44)}px` }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="font-display mb-4 text-3xl font-normal text-[#F5F0EE] italic md:text-[44px] md:leading-tight">
              The Mood
            </p>
            <p className="mb-6 text-[10px] tracking-[0.28em] text-[#C4806A] uppercase">
              Ronnie Herel ft. Haifa
            </p>
            <p className="mb-6 text-[14px] leading-[1.85] text-[rgba(245,240,238,0.62)]">
              Written by Haifa Jordan — a soulful house cut where session-player polish
              meets a vocal that walks the razor&apos;s edge between silk and sweat.
              Pack includes the{" "}
              <span className="text-[#E8C4B8]">DJ Spen &amp; MicFreak remix</span> for
              when the floor demands more runway.
            </p>

            {loadError && (
              <div className="mb-6 border border-[rgba(196,128,106,0.35)] bg-[rgba(196,128,106,0.08)] px-4 py-3 text-[12px] leading-relaxed text-[#E8C4B8]">
                No playable audio found for this track. Add at least one file under{" "}
                <span className="font-mono text-[11px] text-[#F5F0EE]">public/haifa/</span>
                :{" "}
                <span className="font-mono text-[11px] text-[#F5F0EE]">
                  the-mood-vocal.mp3
                </span>{" "}
                and{" "}
                <span className="font-mono text-[11px] text-[#F5F0EE]">
                  the-mood-remix.mp3
                </span>{" "}
                (or .m4a / .ogg / .wav — see{" "}
                <span className="font-mono text-[11px]">lib/the-mood-audio.ts</span>).
              </div>
            )}

            <div className="mb-6 space-y-2">
              <div
                ref={progressRef}
                role="slider"
                tabIndex={0}
                aria-valuenow={Math.round(progressPct)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Seek"
                className="group relative h-2 w-full cursor-pointer rounded-full bg-[rgba(245,240,238,0.08)]"
                onClick={(e) => seekFromProgressBar(e.clientX, progressRef.current)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const a = audioRef.current;
                    if (!a || !Number.isFinite(a.duration)) return;
                    const delta = e.key === "ArrowRight" ? 5 : -5;
                    a.currentTime = Math.min(
                      a.duration,
                      Math.max(0, a.currentTime + delta),
                    );
                    setCurrentTime(a.currentTime);
                  }
                }}
              >
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#A0604A] to-[#C4806A] transition-[width] duration-150"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[11px] text-[rgba(245,240,238,0.45)]">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <span className="text-[8px] font-semibold tracking-[0.2em] text-[#C4806A] uppercase">
                Level
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-1 flex-1 max-w-[200px] cursor-pointer accent-[#C4806A]"
                aria-label="Volume"
              />
            </div>

            <div className="mb-8 rounded border border-[rgba(196,128,106,0.15)] bg-[#0d0c0b] p-4">
              <p className="mb-2 text-[8px] font-semibold tracking-[0.25em] text-[#C4806A] uppercase">
                Full release countdown
              </p>
              {cd.pending ? (
                <p
                  className="font-mono text-lg tracking-widest text-[rgba(245,240,238,0.22)]"
                  aria-busy="true"
                >
                  —d —h —m —s
                </p>
              ) : cd.past ? (
                <p className="font-display text-xl text-[#E8C4B8] italic">Out now</p>
              ) : (
                <p className="font-mono text-lg tracking-widest text-[#F5F0EE]">
                  {String(cd.d).padStart(2, "0")}d {String(cd.h).padStart(2, "0")}h{" "}
                  {String(cd.m).padStart(2, "0")}m {String(cd.s).padStart(2, "0")}s
                </p>
              )}
              <p className="mt-1 text-[11px] text-[rgba(245,240,238,0.4)]">
                Target: 21 May 2026 (UK)
              </p>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-[8px] font-semibold tracking-[0.25em] text-[#C4806A] uppercase">
                Set the room
              </p>
              <div className="flex flex-wrap gap-2">
                {moods.map((m, i) => {
                  const isActive = moodIndex === i;
                  const tone =
                    m.id === "warm"
                      ? isActive
                        ? "border-[#E8C4B8] bg-[rgba(232,196,184,0.2)] text-[#F5F0EE] shadow-[0_0_22px_rgba(232,196,184,0.3)]"
                        : "border-[rgba(232,196,184,0.35)] text-[rgba(245,240,238,0.72)] hover:border-[#E8C4B8] hover:text-[#F5F0EE]"
                      : m.id === "peak"
                        ? isActive
                          ? "border-[#C4806A] bg-[rgba(196,128,106,0.26)] text-[#F5F0EE] shadow-[0_0_26px_rgba(196,128,106,0.45)]"
                          : "border-[rgba(196,128,106,0.35)] text-[rgba(245,240,238,0.7)] hover:border-[#C4806A] hover:text-[#F5F0EE]"
                        : isActive
                          ? "border-[#BA7761] bg-[linear-gradient(135deg,rgba(186,119,97,0.28),rgba(120,74,138,0.22))] text-[#F5F0EE] shadow-[0_0_28px_rgba(186,119,97,0.58)]"
                          : "border-[rgba(186,119,97,0.42)] text-[rgba(244,229,241,0.82)] hover:border-[#BA7761] hover:text-[#F5F0EE]";
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMoodIndex(i)}
                      className={`mood-chip ${m.id} ${isActive ? "is-active" : ""} ${tone} rounded-full border px-4 py-2 text-[9px] font-semibold tracking-[0.15em] uppercase transition-all duration-300`}
                      style={
                        {
                          "--chip-sync": musicPulse.toFixed(3),
                        } as CSSProperties
                      }
                    >
                      <span className="relative z-[1]">{m.label}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={cycleMood}
                  className="rounded-full border border-dashed border-[rgba(196,128,106,0.35)] px-4 py-2 text-[9px] font-medium tracking-[0.12em] text-[#D4A090] uppercase hover:bg-[rgba(196,128,106,0.08)]"
                >
                  Cycle vibe
                </button>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[rgba(245,240,238,0.55)] italic">
                {mood.blurb}
              </p>
            </div>

            <ul className="mb-8 space-y-1">
              {THE_MOOD_TRACKS.map((tr, i) => (
                <li key={tr.id}>
                  <button
                    type="button"
                    onClick={() => selectTrack(i)}
                    className={`flex w-full items-center justify-between gap-4 border-b border-[rgba(196,128,106,0.08)] py-3 text-left transition-colors last:border-0 ${
                      activeTrack === i ? "bg-[rgba(196,128,106,0.06)]" : "hover:bg-[rgba(196,128,106,0.04)]"
                    }`}
                  >
                    <span className="text-[10px] font-mono text-[#C4806A]">{tr.id}</span>
                    <span className="flex-1">
                      <span className="block text-[12px] font-medium tracking-wide text-[#F5F0EE]">
                        {tr.title}
                      </span>
                      <span className="text-[11px] text-[rgba(245,240,238,0.45)]">
                        {tr.sub}
                      </span>
                    </span>
                    <span className="text-[10px] text-[rgba(245,240,238,0.35)]">{tr.meta}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={joinRoom}
                className="inline-flex items-center justify-center bg-gradient-to-br from-[#C4806A] to-[#A0604A] px-8 py-3.5 text-[9px] font-bold tracking-[0.25em] text-[#080808] uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Join the listening room
              </button>
              <p className="text-[11px] text-[rgba(245,240,238,0.4)]">
                <span className="font-mono text-[#E8C4B8]">{roomCount.toLocaleString()}</span>{" "}
                tuned in this session
              </p>
            </div>
            {toast && (
              <p
                className="mt-4 border-l-2 border-[#C4806A] pl-4 text-[12px] text-[#E8C4B8] italic"
                role="status"
              >
                {toast}
              </p>
            )}

            <dl className="mt-10 space-y-0 border-t border-[rgba(196,128,106,0.1)] pt-6">
              {[
                ["Written by", "Haifa Jordan"],
                ["Produced by", "Ronnie Herel & Kevin [TBC]"],
                ["Label", "Quantize Recordings"],
                ["Pre-release", "May 1, 2026"],
                ["Full release", "May 21, 2026"],
                ["Radio", "Mi-Soul DAB — playlisted"],
              ].map(([a, b]) => (
                <div
                  key={a}
                  className="flex gap-4 border-b border-[rgba(196,128,106,0.1)] py-2.5 text-[11px]"
                >
                  <dt className="min-w-[90px] font-medium tracking-[0.15em] text-[#C4806A] uppercase">
                    {a}
                  </dt>
                  <dd className="text-[rgba(245,240,238,0.65)]">{b}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 border-t border-[rgba(196,128,106,0.1)] pt-8">
              <p className="mb-2 text-[8px] font-semibold tracking-[0.28em] text-[#C4806A] uppercase">
                Listen on
              </p>
              <p className="mb-4 text-[12px] leading-relaxed text-[rgba(245,240,238,0.45)]">
                Official store links go in{" "}
                <span className="font-mono text-[11px] text-[#E8C4B8]">
                  lib/the-mood-stream-links.ts
                </span>{" "}
                when the release is live. Until then, these open a search on each
                platform.
              </p>
              <div className="flex flex-wrap gap-3">
                {getMoodStreamOutlets().map((o) => (
                  <a
                    key={o.id}
                    href={o.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center border border-[rgba(196,128,106,0.35)] bg-[rgba(196,128,106,0.06)] px-4 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-[#E8C4B8] uppercase transition-colors hover:border-[#C4806A] hover:bg-[rgba(196,128,106,0.12)]"
                  >
                    {o.label}
                    {o.isOfficial ? (
                      <span className="ml-2 text-[7px] font-normal tracking-normal text-[#4ade80] normal-case">
                        live
                      </span>
                    ) : null}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {dockEngaged && !loadError ? (
        <div
          className="fixed right-0 bottom-0 left-0 z-40 border-t border-[rgba(196,128,106,0.35)] bg-[#080808]/94 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md"
          role="region"
          aria-label="The Mood — now playing"
        >
          <div
            ref={dockProgressRef}
            className="h-1.5 w-full cursor-pointer bg-[rgba(245,240,238,0.08)]"
            onClick={(e) => seekFromProgressBar(e.clientX, dockProgressRef.current)}
            role="presentation"
          >
            <div
              className="h-full bg-gradient-to-r from-[#A0604A] to-[#C4806A] transition-[width] duration-150"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mx-auto flex max-w-[820px] items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => void togglePlay()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(196,128,106,0.45)] bg-[rgba(196,128,106,0.12)] text-[#F5F0EE] transition-colors hover:border-[#C4806A]"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="ml-0.5">
                  <path fill="currentColor" d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[14px] italic text-[#F5F0EE]">{track.title}</p>
              <p className="truncate text-[11px] text-[#C4806A]">{track.sub}</p>
            </div>
            <a
              href="#music"
              className="shrink-0 rounded-full border border-[rgba(196,128,106,0.35)] px-3 py-2.5 text-[9px] font-semibold tracking-[0.2em] text-[#E8C4B8] uppercase transition-colors hover:border-[#C4806A]"
            >
              Deck
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
