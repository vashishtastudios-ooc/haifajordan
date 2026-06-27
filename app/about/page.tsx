import type { Metadata } from "next";
import { AboutHero } from "@/components/about-hero";
import { MediaImage } from "@/components/media-image";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SpotlightCard, SpotlightGroup } from "@/components/ui/spotlight-card";
import { SITE_MEDIA } from "@/lib/site-media";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Haifa Jordan — London soul & house vocalist with 25+ years on stage, from UK garage and Pop Idol to Ministry of Sound, Eurovision and The X Factor. Book for weddings, corporate and private events.",
  alternates: {
    canonical: "/about",
  },
};

const pillars = [
  {
    title: "The voice",
    desc: "A smoky, room-stilling tone that needs no embellishment — soul, house and club classics delivered with three decades of instinct.",
  },
  {
    title: "The writer",
    desc: "As much songwriter as performer — bilingual originals in English and Arabic, and a new release written from the ground up.",
  },
  {
    title: "The host",
    desc: "From welcome to last call, performance and presence woven into one seamless arc so a room never clock-watches.",
  },
  {
    title: "The reach",
    desc: "UK, Dubai, Ibiza and beyond — at home wherever the rider is serious and the crowd is hungry for a real moment.",
  },
];

function PortraitFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(160deg,#1e1210,#0a0806)]">
      <span className="font-display text-2xl text-[#E8C4B8]/50 italic">Haifa</span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="grain-overlay min-h-dvh text-[#F5F0EE]">
      <SiteNav />
      <main className="relative z-30">
        <AboutHero />

        <section className="section-scroll px-6 py-24 md:px-10 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="section-label mb-14 flex items-center gap-5 text-[9px] font-semibold tracking-[0.35em] text-[#C4806A] uppercase">
              <span className="h-px flex-1 bg-[rgba(196,128,106,0.25)]" />
              Who she is
              <span className="h-px flex-1 bg-[rgba(196,128,106,0.25)]" />
            </p>

            <div className="lg:grid lg:grid-cols-12 lg:gap-14 lg:gap-x-16">
              <div className="lg:col-span-7">
                <p className="font-display mb-14 border-l-2 border-[#C4806A] pl-7 text-[clamp(1.35rem,4vw,2.2rem)] leading-snug font-normal text-[#F5F0EE] italic">
                  Some artists chase a signature sound. Haifa walked out of the clubs
                  already holding hers.
                </p>
                <p className="mb-7 text-[15px] leading-[2] text-[rgba(245,240,238,0.72)]">
                  Born of suburban London and raised on the capital&apos;s sharpest UK
                  house and garage circuit, Haifa learned the stage the only way that
                  sticks — live, in front of a crowd that decides in the first bar
                  whether to stay. By fifteen she was freestyling in the booth; by
                  eighteen she was signed to{" "}
                  <strong className="font-medium text-[#F5F0EE]">
                    Public Demand Records
                  </strong>
                  , label home of Craig David and Artful Dodger.
                </p>
                <p className="mb-7 text-[15px] leading-[2] text-[rgba(245,240,238,0.72)]">
                  National screens followed:{" "}
                  <strong className="font-medium text-[#F5F0EE]">Pop Idol</strong>{" "}
                  Final 10 with Simon Cowell&apos;s backing,{" "}
                  <strong className="font-medium text-[#F5F0EE]">
                    Ministry of Sound
                  </strong>{" "}
                  and a #2 UK dance hit, BBC primetime for{" "}
                  <strong className="font-medium text-[#F5F0EE]">Eurovision</strong>{" "}
                  selection, and a{" "}
                  <strong className="font-medium text-[#F5F0EE]">
                    The X Factor
                  </strong>{" "}
                  Final Seven run that earned the line still quoted on tape — a
                  &quot;great smoky voice you could never put on.&quot;
                </p>
                <p className="mb-7 text-[15px] leading-[2] text-[rgba(245,240,238,0.72)]">
                  Between the cameras came the rooms that shaped her: among the first UK
                  artists with Westwood on BBC Radio 1 in Dubai, EMI chasing her
                  bilingual original{" "}
                  <strong className="font-medium text-[#F5F0EE]">L O V E</strong>, and a
                  defining night warming up for house legend Adeva at Privilege, Ibiza —
                  the moment soulful house became home.
                </p>
                <p className="text-[15px] leading-[2] text-[rgba(245,240,238,0.72)]">
                  Today that thread runs straight into{" "}
                  <strong className="font-medium text-[#F5F0EE]">
                    &quot;The Mood&quot;
                  </strong>{" "}
                  on DJ Spen&apos;s Quantize Recordings, and into{" "}
                  <strong className="font-medium text-[#F5F0EE]">
                    Sing It Entertainment
                  </strong>{" "}
                  — the boutique agency she founded on 25+ years of relationships,
                  delivering full-service live events from first brief to last cab.
                </p>
              </div>

              <aside className="relative mt-14 lg:col-span-5 lg:mt-0">
                <div className="lg:sticky lg:top-28">
                  <div className="relative aspect-[3/4] w-full overflow-hidden border border-[rgba(196,128,106,0.2)]">
                    <MediaImage
                      candidates={SITE_MEDIA.storyImages[0].candidates}
                      alt={SITE_MEDIA.storyImages[0].alt}
                      fill
                      sizes="(min-width: 1024px) 420px, 100vw"
                      className="h-full w-full"
                      imgClassName="object-cover"
                      fallback={<PortraitFallback />}
                    />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-y border-[rgba(196,128,106,0.12)] bg-[#1c1918] px-6 py-24 md:px-10 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="section-label mb-14 text-[9px] font-semibold tracking-[0.35em] text-[#C4806A] uppercase">
              What defines her
            </p>
            <SpotlightGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {pillars.map((p) => (
                <SpotlightCard
                  key={p.title}
                  className="border border-[rgba(196,128,106,0.18)]"
                >
                  <div className="p-8">
                    <h3 className="font-display mb-3.5 text-[clamp(15px,2.2vw,19px)] font-normal text-[#E8C4B8] italic">
                      {p.title}
                    </h3>
                    <p className="text-[14px] leading-[1.75] text-[rgba(245,240,238,0.55)]">
                      {p.desc}
                    </p>
                  </div>
                </SpotlightCard>
              ))}
            </SpotlightGroup>
          </div>
        </section>

        <section className="px-6 py-24 md:px-10 md:py-28">
          <blockquote className="relative mx-auto max-w-3xl text-center">
            <span
              className="font-display pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 text-[150px] leading-none text-[#C4806A]/22"
              aria-hidden
            >
              &ldquo;
            </span>
            <p className="font-display relative z-10 text-[clamp(1.4rem,3.4vw,2.2rem)] leading-[1.35] font-normal text-[#F5F0EE] italic">
              When Haifa steps on stage, the night remembers why it showed up.
            </p>
          </blockquote>
        </section>

        <section className="px-6 pb-28 md:px-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 rounded-sm border border-[rgba(196,128,106,0.2)] bg-[#080808]/50 px-8 py-14 text-center md:py-16">
            <p className="text-[9px] font-semibold tracking-[0.35em] text-[#C4806A] uppercase">
              Let&apos;s make a night of it
            </p>
            <h2 className="font-display text-[clamp(2rem,6vw,3.4rem)] leading-tight text-[#F5F0EE] italic">
              Bring the voltage to your event
            </h2>
            <p className="max-w-xl text-[15px] leading-[1.95] text-[rgba(245,240,238,0.7)]">
              Weddings, corporate stages, private celebrations, destination
              experiences — tell us what you&apos;re building and we&apos;ll shape the
              set around it.
            </p>
            <a
              href="/book"
              className="inline-flex items-center justify-center bg-gradient-to-br from-[#C4806A] to-[#A0604A] px-8 py-3.5 text-[9px] font-bold tracking-[0.28em] text-[#080808] uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Book Now
            </a>
          </div>
        </section>
      </main>
      <SiteFooter className="relative z-30" />
    </div>
  );
}
