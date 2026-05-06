import { HeroBackdrop } from "@/components/hero-backdrop";
import LightRays from "@/components/light-rays";
import { MediaImage } from "@/components/media-image";
import { SITE_MEDIA } from "@/lib/site-media";

const creds = [
  { title: "Label", value: "Quantize Recordings" },
  { title: "Television", value: "Pop Idol · X Factor · Eurovision" },
  { title: "Chart", value: "#2 UK Dance Hit" },
  { title: "Radio", value: "Mi-Soul · On rotation" },
];

function LogoFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#1e1210,#0a0806)]">
      <span className="font-display text-3xl text-[#E8C4B8] italic">HJ</span>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-16 text-center md:px-10 md:pt-24">
      <div className="absolute inset-0 z-0">
        <HeroBackdrop />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.07]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, #C4806A, transparent), radial-gradient(ellipse 60% 40% at 100% 100%, #A0604A, transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-16 z-[2] opacity-100 mix-blend-screen md:inset-0 md:opacity-100 [filter:brightness(2.35)_contrast(1.35)_saturate(1.2)] md:[filter:brightness(1.6)_contrast(1.15)_saturate(1)]"
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1.1}
          lightSpread={1}
          rayLength={3.5}
          followMouse
          mouseInfluence={0.15}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1.4}
          saturation={1}
        />
      </div>
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-transparent via-transparent to-[#080808]/90" />

      <div className="relative z-[4] mx-auto max-w-4xl">
        <div
          className="mx-auto mb-10 h-[168px] w-[168px] shrink-0 overflow-hidden animate-rise"
          style={{ animationDelay: "0.15s", opacity: 0 }}
        >
          <MediaImage
            candidates={SITE_MEDIA.logoCandidates}
            alt="HaifaLive logo"
            fill
            sizes="168px"
            priority
            className="h-full w-full"
            imgClassName="!object-contain"
            fallback={<LogoFallback />}
          />
        </div>
        <p
          className="mb-8 text-[9px] font-medium tracking-[0.45em] text-[#C4806A] uppercase animate-rise"
          style={{ animationDelay: "0.35s", opacity: 0 }}
        >
          Vocalist · Songwriter · Stage voltage · 2026
        </p>
        <h1
          className="font-display text-[clamp(3.5rem,14vw,10rem)] leading-[0.88] font-normal tracking-[-0.02em] text-[#F5F0EE] animate-rise"
          style={{ animationDelay: "0.5s", opacity: 0 }}
        >
          Haifa
          <span className="block bg-[linear-gradient(135deg,#E8C4B8,#C4806A,#A0604A)] bg-clip-text font-normal text-transparent italic">
            Live
          </span>
        </h1>
        <div
          className="mx-auto my-10 h-[70px] w-px bg-[linear-gradient(to_bottom,transparent,#C4806A,transparent)] animate-rise"
          style={{ animationDelay: "0.75s", opacity: 0 }}
        />
        <p
          className="font-display mx-auto max-w-xl text-[clamp(1rem,2.2vw,1.35rem)] leading-relaxed font-normal text-[#F5F0EE] italic animate-rise"
          style={{ animationDelay: "0.95s", opacity: 0 }}
        >
          London soul. Global voltage. One microphone — and the whole room leans in.
          <span className="mt-3 block text-[#E8C4B8] not-italic">
            When Haifa steps on stage, the night remembers why it showed up.
          </span>
        </p>
        <div
          className="mt-14 flex flex-wrap justify-center gap-10 md:gap-14 animate-rise"
          style={{ animationDelay: "1.15s", opacity: 0 }}
        >
          {creds.map((c) => (
            <div key={c.title} className="text-center">
              <p className="mb-1.5 text-[8px] font-semibold tracking-[0.22em] text-[#C4806A] uppercase">
                {c.title}
              </p>
              <p className="font-display text-[13px] text-[rgba(245,240,238,0.72)] italic">
                {c.value}
              </p>
            </div>
          ))}
        </div>
        <div
          className="mt-20 flex flex-col items-center gap-2 animate-rise"
          style={{ animationDelay: "1.35s", opacity: 0 }}
        >
          <span className="text-[8px] tracking-[0.35em] text-[#C4806A] uppercase">
            Scroll
          </span>
          <div className="h-11 w-px animate-pulse bg-[#C4806A]" />
        </div>
      </div>
    </section>
  );
}
