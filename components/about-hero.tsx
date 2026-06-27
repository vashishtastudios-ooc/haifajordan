import { HeroBackdrop } from "@/components/hero-backdrop";
import LightRays from "@/components/light-rays";

const facts = [
  { title: "Origin", value: "London soul" },
  { title: "Range", value: "Soul · House · Garage" },
  { title: "Stages", value: "UK · Dubai · Ibiza" },
  { title: "Now", value: "The Mood · 2026" },
];

export function AboutHero() {
  return (
    <section className="relative flex min-h-[88dvh] flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20 text-center md:px-10 md:pt-32">
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-16 z-[2] opacity-100 mix-blend-screen md:inset-0 [filter:brightness(2.35)_contrast(1.35)_saturate(1.2)] md:[filter:brightness(1.6)_contrast(1.15)_saturate(1)]">
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
        <p
          className="mb-8 text-[9px] font-medium tracking-[0.45em] text-[#C4806A] uppercase animate-rise"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          The story behind the voice
        </p>
        <h1
          className="font-display text-[clamp(2.8rem,11vw,7.5rem)] leading-[0.9] font-normal tracking-[-0.02em] text-[#F5F0EE] animate-rise"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          About
          <span className="block bg-[linear-gradient(135deg,#E8C4B8,#C4806A,#A0604A)] bg-clip-text font-normal text-transparent italic">
            Haifa
          </span>
        </h1>
        <div
          className="mx-auto my-10 h-[70px] w-px bg-[linear-gradient(to_bottom,transparent,#C4806A,transparent)] animate-rise"
          style={{ animationDelay: "0.65s", opacity: 0 }}
        />
        <p
          className="font-display mx-auto max-w-2xl text-[clamp(1rem,2.2vw,1.35rem)] leading-relaxed font-normal text-[#F5F0EE] italic animate-rise"
          style={{ animationDelay: "0.85s", opacity: 0 }}
        >
          A vocalist forged in London&apos;s clubs, sharpened on national stages, and
          carried across the world by one undeniable instrument.
          <span className="mt-3 block text-[#E8C4B8] not-italic">
            Three decades behind the mic — and the room still leans in.
          </span>
        </p>
        <div
          className="mt-14 flex flex-wrap justify-center gap-10 md:gap-14 animate-rise"
          style={{ animationDelay: "1.05s", opacity: 0 }}
        >
          {facts.map((f) => (
            <div key={f.title} className="text-center">
              <p className="mb-1.5 text-[8px] font-semibold tracking-[0.22em] text-[#C4806A] uppercase">
                {f.title}
              </p>
              <p className="font-display text-[13px] text-[rgba(245,240,238,0.72)] italic">
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
