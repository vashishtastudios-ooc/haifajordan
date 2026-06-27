"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { MediaImage } from "@/components/media-image";
import { SITE_MEDIA } from "@/lib/site-media";
import { THE_MOOD_TRACKS } from "@/lib/the-mood-audio";
import { getMoodStreamOutlets } from "@/lib/the-mood-stream-links";

/**
 * Genre EQ presets — like a car-stereo equalizer. Each preset sets real
 * BiquadFilter gains (dB) + a makeup gain multiplier, plus the visual layers.
 */
const moods = [
  {
    id: "flat",
    label: "Flat",
    blurb: "Studio-honest — no colour, just the master as it was mixed.",
    bass: 0,
    mid: 0,
    treble: 0,
    gain: 1,
    glow: "rgba(196,128,106,0.35)",
    barGradient: "linear-gradient(to top, #A0604A, #E8C4B8)",
    intensity: 0.78,
    sectionBg:
      "radial-gradient(ellipse 72% 55% at 50% 0%, rgba(196,128,106,0.12), transparent 70%)",
    coverTint:
      "radial-gradient(circle at 50% 42%, rgba(232,196,184,0.22), transparent 70%)",
  },
  {
    id: "rock",
    label: "Rock",
    blurb: "Mid-forward and crunchy — guitars bite, vocals push to the front.",
    bass: 5,
    mid: 3,
    treble: 5,
    gain: 1.1,
    glow: "rgba(196,128,106,0.5)",
    barGradient: "linear-gradient(to top, #A0604A, #C4806A, #F5D9CC)",
    intensity: 0.95,
    sectionBg:
      "radial-gradient(ellipse 82% 58% at 50% 0%, rgba(196,128,106,0.18), transparent 72%)",
    coverTint:
      "radial-gradient(circle at 50% 45%, rgba(196,128,106,0.32), transparent 68%)",
  },
  {
    id: "beats",
    label: "Beats",
    blurb: "Sub-heavy — the low end you feel in your chest before you hear it.",
    bass: 9,
    mid: -2,
    treble: 2,
    gain: 1.15,
    glow: "rgba(160,96,74,0.55)",
    barGradient: "linear-gradient(to top, #784A8A, #A0604A, #E8C4B8)",
    intensity: 1.05,
    sectionBg:
      "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120,74,138,0.2), transparent 72%)",
    coverTint:
      "linear-gradient(135deg, rgba(120,74,138,0.3), rgba(160,96,74,0.3))",
  },
  {
    id: "party",
    label: "Party",
    blurb: "Smile curve — boosted lows and highs, built for a loud room.",
    bass: 6,
    mid: 1,
    treble: 6,
    gain: 1.2,
    glow: "rgba(232,196,184,0.55)",
    barGradient: "linear-gradient(to top, #C4806A, #E8C4B8, #FFFFFF)",
    intensity: 1.12,
    sectionBg:
      "radial-gradient(ellipse 88% 62% at 50% 0%, rgba(232,196,184,0.22), transparent 72%)",
    coverTint:
      "radial-gradient(circle at 50% 45%, rgba(245,217,204,0.4), transparent 66%)",
  },
  {
    id: "chaos",
    label: "Out of Control",
    blurb: "Everything maxed — slammed bass and treble, pinned to the edge.",
    bass: 11,
    mid: 0,
    treble: 9,
    gain: 1.35,
    glow: "rgba(196,128,106,0.7)",
    barGradient: "linear-gradient(to top, #784A8A, #C4806A, #F5D9CC)",
    intensity: 1.25,
    sectionBg:
      "radial-gradient(ellipse 95% 65% at 50% 0%, rgba(196,128,106,0.26), transparent 74%)",
    coverTint:
      "linear-gradient(135deg, rgba(196,128,106,0.42), rgba(120,74,138,0.32))",
  },
] as const;

const BAR_COUNT = 24;
const USABLE_BINS = 48;

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

export function LiveMoodAlbum() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const dockProgressRef = useRef<HTMLDivElement | null>(null);
  const resumeAfterTrackChangeRef = useRef(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const sourcedElRef = useRef<HTMLAudioElement | null>(null);
  const freqDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const bassRef = useRef<BiquadFilterNode | null>(null);
  const midRef = useRef<BiquadFilterNode | null>(null);
  const trebleRef = useRef<BiquadFilterNode | null>(null);
  const makeupRef = useRef<GainNode | null>(null);
  const eqHeadRef = useRef<AudioNode | null>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const intensityRef = useRef(1);
  const [analyserReady, setAnalyserReady] = useState(false);
  const [level, setLevel] = useState(0);

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

  const ensureGraph = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (!audioCtxRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();

        const bass = ctx.createBiquadFilter();
        bass.type = "lowshelf";
        bass.frequency.value = 120;

        const mid = ctx.createBiquadFilter();
        mid.type = "peaking";
        mid.frequency.value = 1000;
        mid.Q.value = 0.9;

        const treble = ctx.createBiquadFilter();
        treble.type = "highshelf";
        treble.frequency.value = 5000;

        const makeup = ctx.createGain();
        makeup.gain.value = 1;

        // Safety limiter so big EQ boosts stay loud without harsh clipping.
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -10;
        comp.knee.value = 8;
        comp.ratio.value = 4;
        comp.attack.value = 0.003;
        comp.release.value = 0.25;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;

        // source -> bass -> mid -> treble -> makeup -> compressor -> analyser -> out
        bass.connect(mid);
        mid.connect(treble);
        treble.connect(makeup);
        makeup.connect(comp);
        comp.connect(analyser);
        analyser.connect(ctx.destination);

        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        bassRef.current = bass;
        midRef.current = mid;
        trebleRef.current = treble;
        makeupRef.current = makeup;
        eqHeadRef.current = bass;
        freqDataRef.current = new Uint8Array(
          new ArrayBuffer(analyser.frequencyBinCount),
        );
      }
      const ctx = audioCtxRef.current;
      const head = eqHeadRef.current;
      if (!ctx || !head) return;

      if (sourcedElRef.current !== a) {
        try {
          sourceRef.current?.disconnect();
        } catch {
          /* ignore */
        }
        const src = ctx.createMediaElementSource(a);
        src.connect(head);
        sourceRef.current = src;
        sourcedElRef.current = a;
      }
      void ctx.resume();
      setAnalyserReady(true);
    } catch {
      setAnalyserReady(false);
    }
  }, []);

  const applyEq = useCallback(
    (preset: (typeof moods)[number]) => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;
      const tc = 0.08;
      bassRef.current?.gain.setTargetAtTime(preset.bass, now, tc);
      midRef.current?.gain.setTargetAtTime(preset.mid, now, tc);
      trebleRef.current?.gain.setTargetAtTime(preset.treble, now, tc);
      makeupRef.current?.gain.setTargetAtTime(preset.gain, now, tc);
    },
    [],
  );

  useEffect(() => {
    if (!analyserReady) return;
    applyEq(mood);
  }, [analyserReady, mood, applyEq]);

  const togglePlay = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      setLoadError(false);
      ensureGraph();
      try {
        await a.play();
      } catch {
        setToast("Playback blocked — tap play again or check the file.");
        window.setTimeout(() => setToast(null), 4000);
      }
    } else {
      a.pause();
    }
  }, [ensureGraph]);

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
    ensureGraph();
    void a.play().catch(() => {
      setLoadError(true);
      setIsPlaying(false);
    });
  }, [activeTrack, ensureGraph]);

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

  useEffect(() => {
    intensityRef.current = mood.intensity;
  }, [mood.intensity]);

  const live = analyserReady && isPlaying;

  /** Drive bars from real frequency data while the analyser is live. */
  useEffect(() => {
    const bars = barRefs.current;
    if (!live) {
      bars.forEach((el) => {
        if (el) el.style.transform = "";
      });
      setLevel(0);
      return;
    }

    let raf = 0;
    let lastState = 0;
    const loop = (t: number) => {
      const analyser = analyserRef.current;
      const data = freqDataRef.current;
      if (analyser && data) {
        analyser.getByteFrequencyData(data);
        const intensity = intensityRef.current;
        let sum = 0;
        for (let i = 0; i < BAR_COUNT; i++) {
          const bin = Math.floor((i / BAR_COUNT) * USABLE_BINS);
          const v = data[bin] / 255;
          sum += v;
          const el = bars[i];
          if (el) {
            const h = Math.max(0.06, Math.min(1, v * intensity * 1.25));
            el.style.transform = `scaleY(${h})`;
          }
        }
        if (t - lastState > 90) {
          lastState = t;
          setLevel(sum / BAR_COUNT);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [live]);

  useEffect(() => {
    return () => {
      try {
        sourceRef.current?.disconnect();
        bassRef.current?.disconnect();
        midRef.current?.disconnect();
        trebleRef.current?.disconnect();
        makeupRef.current?.disconnect();
        analyserRef.current?.disconnect();
        void audioCtxRef.current?.close();
      } catch {
        /* ignore */
      }
    };
  }, []);

  /** Proxy beat from the playback clock — fallback when Web Audio is unavailable. */
  const musicPulse = useMemo(() => {
    if (!isPlaying) return 0;
    return (Math.sin(currentTime * Math.PI * 2 * 1.9) + 1) / 2;
  }, [currentTime, isPlaying]);

  const effectivePulse = live ? level : musicPulse;

  const deckShadow = useMemo(() => {
    const spread = Math.round(80 + effectivePulse * 60);
    const lift = Math.round(-20 - effectivePulse * 14);
    const glow = scaleRgbaAlpha(mood.glow, 1 + effectivePulse * 1.1);
    return `0 0 ${spread}px ${lift}px ${glow}`;
  }, [mood.glow, effectivePulse]);

  return (
    <section
      id="music"
      className="relative scroll-mt-24 overflow-hidden border-t border-[rgba(196,128,106,0.12)] bg-[#1c1918] px-6 py-24 md:px-10 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-[background] duration-700 ease-out"
        style={{ background: mood.sectionBg }}
        aria-hidden
      />
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

      <div className="relative z-10 mx-auto max-w-[820px]">
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
                  alt={SITE_MEDIA.albumCoverAlt}
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
                className="absolute inset-0 z-[1] mix-blend-overlay transition-[background,opacity] duration-700 ease-out"
                style={{ background: mood.coverTint, opacity: 0.85 + effectivePulse * 0.15 }}
                aria-hidden
              />
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

            <div className="mt-8 w-full max-w-[280px]">
              <div className="flex h-16 items-end justify-center gap-[3px]">
                {Array.from({ length: BAR_COUNT }).map((_, i) => {
                  const barClass = live
                    ? ""
                    : isPlaying
                      ? "is-css"
                      : "is-idle";
                  return (
                    <span
                      key={i}
                      ref={(el) => {
                        barRefs.current[i] = el;
                      }}
                      className={`eq-bar2 h-full flex-1 rounded-full ${barClass}`}
                      style={{
                        background: mood.barGradient,
                        animationDelay: live ? undefined : `${(i * 47) % 620}ms`,
                      }}
                    />
                  );
                })}
              </div>
              <p
                className="mt-3 text-center text-[8px] tracking-[0.28em] text-[rgba(245,240,238,0.4)] uppercase transition-opacity duration-300"
                style={{ opacity: isPlaying ? 0 : 1 }}
                aria-hidden={isPlaying}
              >
                Press play to feel it
              </p>
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
                Release status
              </p>
              <p className="font-display text-xl text-[#E8C4B8] italic">Out now</p>
              <p className="mt-1 text-[11px] text-[rgba(245,240,238,0.4)]">
                Quantize Recordings · Mi-Soul playlist
              </p>
            </div>

            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[8px] font-semibold tracking-[0.25em] text-[#C4806A] uppercase">
                  Tune the room — EQ
                </p>
                <span className="text-[8px] tracking-[0.2em] text-[rgba(245,240,238,0.35)] uppercase">
                  {analyserReady ? "Live EQ" : "Press play"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {moods.map((m, i) => {
                  const isActive = moodIndex === i;
                  const tone = isActive
                    ? "border-[#C4806A] bg-[rgba(196,128,106,0.24)] text-[#F5F0EE] shadow-[0_0_26px_rgba(196,128,106,0.45)]"
                    : "border-[rgba(196,128,106,0.3)] text-[rgba(245,240,238,0.62)] hover:border-[#C4806A] hover:text-[#F5F0EE]";
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMoodIndex(i)}
                      className={`mood-chip ${m.id} ${isActive ? "is-active" : ""} ${tone} rounded-full border px-4 py-2 text-[9px] font-semibold tracking-[0.15em] uppercase transition-all duration-300`}
                      style={
                        {
                          "--chip-sync": effectivePulse.toFixed(3),
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
                  Next preset
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {(
                  [
                    ["Bass", mood.bass],
                    ["Mid", mood.mid],
                    ["Treble", mood.treble],
                  ] as const
                ).map(([band, db]) => (
                  <div
                    key={band}
                    className="rounded border border-[rgba(196,128,106,0.15)] bg-[#0d0c0b] px-3 py-2"
                  >
                    <p className="mb-1.5 text-[7px] font-semibold tracking-[0.22em] text-[#C4806A] uppercase">
                      {band}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-[#F5F0EE]">
                        {db > 0 ? `+${db}` : db} dB
                      </span>
                      <span className="relative h-1 w-10 overflow-hidden rounded-full bg-[rgba(245,240,238,0.1)]">
                        <span
                          className="absolute top-0 left-1/2 h-full -translate-x-1/2 rounded-full bg-gradient-to-r from-[#A0604A] to-[#E8C4B8] transition-[width] duration-500"
                          style={{ width: `${Math.min(100, Math.abs(db) * 8)}%` }}
                        />
                      </span>
                    </div>
                  </div>
                ))}
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
                ["Released", "May 2026"],
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
