import { MediaImage } from "@/components/media-image";
import { SITE_MEDIA } from "@/lib/site-media";

function StorySlotFallback({ filename }: { filename: string }) {
  return (
    <div className="relative flex h-full min-h-[220px] w-full min-w-0 items-center justify-center border border-[rgba(196,128,106,0.15)] bg-[linear-gradient(160deg,#1e1210,#0a0806)]">
      <p className="font-display px-4 text-center text-base text-[#E8C4B8]/50 italic">
        Story frame
      </p>
      <p className="absolute right-0 bottom-3 left-0 text-center text-[8px] tracking-[0.18em] text-[rgba(245,240,238,0.25)] uppercase">
        public/haifa/{filename}
      </p>
    </div>
  );
}

export function StorySection() {
  return (
    <section id="story" className="section-scroll px-6 py-24 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="section-label mb-14 flex items-center gap-5 text-[9px] font-semibold tracking-[0.35em] text-[#C4806A] uppercase">
          <span className="h-px flex-1 bg-[rgba(196,128,106,0.25)]" />
          The story
          <span className="h-px flex-1 bg-[rgba(196,128,106,0.25)]" />
        </p>

        <div className="lg:grid lg:grid-cols-12 lg:gap-14 lg:gap-x-16">
          <div className="lg:col-span-7">
            <p className="font-display mb-14 border-l-2 border-[#C4806A] pl-7 text-[clamp(1.35rem,4vw,2.2rem)] leading-snug font-normal text-[#F5F0EE] italic">
              Some artists search for a signature sound. Haifa carried hers out of the
              clubs before the industry even had her name on a call sheet.
            </p>
            <p className="mb-7 text-[15px] leading-[2] text-[rgba(245,240,238,0.72)]">
              Suburban London, fifteen years old: she did not discover UK house and
              garage from the sidelines — she stepped straight into the booth. Freestyle
              vocals on the capital&apos;s sharpest circuit forged a reputation for raw,
              instinctive presence and a voice that could hush a packed floor mid-sentence.
            </p>
            <p className="mb-7 text-[15px] leading-[2] text-[rgba(245,240,238,0.72)]">
              The industry moved fast. At eighteen,{" "}
              <strong className="font-medium text-[#F5F0EE]">Public Demand Records</strong>{" "}
              — home to Craig David and Artful Dodger — put pen to paper after seeing her
              live. Her debut single, remixed by{" "}
              <strong className="font-medium text-[#F5F0EE]">Artful Dodger</strong>, landed
              on major compilations at the white-hot centre of UK garage.
            </p>
            <p className="mb-7 text-[15px] leading-[2] text-[rgba(245,240,238,0.72)]">
              In 2001, <strong className="font-medium text-[#F5F0EE]">Pop Idol UK</strong>{" "}
              — <strong className="font-medium text-[#F5F0EE]">Final 10</strong>, Simon
              Cowell&apos;s backing, national screens. That wave opened{" "}
              <strong className="font-medium text-[#F5F0EE]">
                Ministry of Sound / Incentive
              </strong>{" "}
              with <strong className="font-medium text-[#F5F0EE]">Nick Hawkes</strong>:
              &quot;Unbreak My Heart&quot; became a{" "}
              <strong className="font-medium text-[#F5F0EE]">#2 UK dance hit</strong>,
              Topshop TV rotation, and stages across borders.
            </p>
            <p className="mb-7 text-[15px] leading-[2] text-[rgba(245,240,238,0.72)]">
              Among the first UK artists on{" "}
              <strong className="font-medium text-[#F5F0EE]">Westwood (BBC Radio 1)</strong>{" "}
              in Dubai;{" "}
              <strong className="font-medium text-[#F5F0EE]">EMI</strong> chasing her
              bilingual original{" "}
              <strong className="font-medium text-[#F5F0EE]">L O V E</strong> — English and
              Arabic — proof she was always as much writer as vocalist.
            </p>
            <p className="text-[15px] leading-[2] text-[rgba(245,240,238,0.72)]">
              A defining night at{" "}
              <strong className="font-medium text-[#F5F0EE]">Privilege, Ibiza</strong> —
              warming up for house legend{" "}
              <strong className="font-medium text-[#F5F0EE]">Adeva</strong> — locked in a
              lifelong bond with soulful house. That thread runs straight into everything
              she records and every room she opens with a single note.
            </p>
          </div>

          <aside className="relative mt-14 lg:col-span-5 lg:mt-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:sticky lg:top-28">
              {SITE_MEDIA.storyImages.map((item) => {
                const fileHint = item.candidates[0].replace(/^\/haifa\//, "");
                return (
                  <div
                    key={item.candidates[0]}
                    className="relative aspect-[3/4] w-full overflow-hidden border border-[rgba(196,128,106,0.2)]"
                  >
                    <MediaImage
                      candidates={item.candidates}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 380px, 100vw"
                      className="h-full w-full"
                      imgClassName="object-cover"
                      fallback={<StorySlotFallback filename={fileHint} />}
                    />
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
