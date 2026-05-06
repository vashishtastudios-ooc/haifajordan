import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

const eventTypes = [
  "Wedding",
  "Corporate event",
  "Private celebration",
  "Destination experience",
  "Festival / venue night",
  "Other",
] as const;

export default function BookPage() {
  return (
    <div className="grain-overlay min-h-dvh text-[#F5F0EE]">
      <SiteNav />
      <main className="relative z-30 px-6 pt-32 pb-24 md:px-10 md:pt-36">
        <section className="mx-auto max-w-3xl">
          <p className="mb-4 text-[9px] font-semibold tracking-[0.35em] text-[#C4806A] uppercase">
            Enquire
          </p>
          <h1 className="font-display mb-6 text-[clamp(2.4rem,7vw,4.8rem)] leading-tight text-[#F5F0EE] italic">
            Book Haifa
          </h1>
          <p className="mb-12 max-w-2xl text-[15px] leading-[1.95] text-[rgba(245,240,238,0.72)]">
            Whether you&apos;re planning a wedding, corporate event, private celebration
            or destination experience, let&apos;s create something unforgettable
            together.
          </p>

          <form
            className="rounded-sm border border-[rgba(196,128,106,0.22)] bg-[#080808]/55 p-6 md:p-8"
            action="mailto:info@haifalive.com"
            method="post"
            encType="text/plain"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C4806A] uppercase">
                  Full name
                </span>
                <input
                  required
                  name="name"
                  type="text"
                  className="h-11 border border-[rgba(196,128,106,0.26)] bg-[#12100f] px-3 text-[14px] text-[#F5F0EE] outline-none placeholder:text-[rgba(245,240,238,0.36)] focus:border-[#C4806A]"
                  placeholder="Your name"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C4806A] uppercase">
                  Email
                </span>
                <input
                  required
                  name="email"
                  type="email"
                  className="h-11 border border-[rgba(196,128,106,0.26)] bg-[#12100f] px-3 text-[14px] text-[#F5F0EE] outline-none placeholder:text-[rgba(245,240,238,0.36)] focus:border-[#C4806A]"
                  placeholder="you@email.com"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C4806A] uppercase">
                  Event type
                </span>
                <select
                  required
                  name="event_type"
                  defaultValue=""
                  className="h-11 border border-[rgba(196,128,106,0.26)] bg-[#12100f] px-3 text-[14px] text-[#F5F0EE] outline-none focus:border-[#C4806A]"
                >
                  <option value="" disabled>
                    Select event type
                  </option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C4806A] uppercase">
                  Event date
                </span>
                <input
                  name="event_date"
                  type="text"
                  className="h-11 border border-[rgba(196,128,106,0.26)] bg-[#12100f] px-3 text-[14px] text-[#F5F0EE] outline-none placeholder:text-[rgba(245,240,238,0.36)] focus:border-[#C4806A]"
                  placeholder="DD/MM/YYYY (if known)"
                />
              </label>
            </div>

            <label className="mt-5 flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C4806A] uppercase">
                Message
              </span>
              <textarea
                required
                name="message"
                rows={6}
                className="resize-y border border-[rgba(196,128,106,0.26)] bg-[#12100f] px-3 py-2.5 text-[14px] leading-relaxed text-[#F5F0EE] outline-none placeholder:text-[rgba(245,240,238,0.36)] focus:border-[#C4806A]"
                placeholder="Tell us about your event, location, and what kind of set you have in mind."
              />
            </label>

            <p className="mt-5 text-[12px] text-[rgba(245,240,238,0.52)]">
              Pricing is handled one-to-one after enquiry, based on your event details.
            </p>

            <button
              type="submit"
              className="mt-7 inline-flex items-center justify-center bg-gradient-to-br from-[#C4806A] to-[#A0604A] px-8 py-3.5 text-[9px] font-bold tracking-[0.28em] text-[#080808] uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Send enquiry
            </button>
          </form>
        </section>
      </main>
      <SiteFooter className="relative z-30" />
    </div>
  );
}
