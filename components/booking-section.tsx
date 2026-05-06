export function BookingSection() {
  return (
    <section
      id="booking"
      className="scroll-mt-24 relative overflow-hidden bg-[#1c1918] px-6 py-28 text-center md:px-10 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(196,128,106,0.07), transparent 70%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl">
        <h2 className="font-display mb-5 text-[clamp(2.75rem,8vw,5.5rem)] leading-tight font-normal text-[#F5F0EE] italic">
          Book Haifa Live
        </h2>
        <p className="mb-14 text-[10px] tracking-[0.35em] text-[rgba(245,240,238,0.45)] uppercase">
          Premium private events · Corporate · Festivals · International
        </p>
        <p className="mx-auto mb-10 max-w-2xl text-[14px] leading-[1.9] text-[rgba(245,240,238,0.66)]">
          Whether you&apos;re planning a wedding, corporate event, private celebration or
          destination experience, let&apos;s create something unforgettable together.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/book"
            className="inline-block bg-gradient-to-br from-[#C4806A] to-[#A0604A] px-11 py-4 text-[9px] font-bold tracking-[0.35em] text-[#080808] uppercase transition-transform hover:scale-[1.02]"
          >
            Enquire now
          </a>
          <a
            href="/book"
            className="inline-block border border-[rgba(196,128,106,0.45)] px-11 py-4 text-[9px] font-medium tracking-[0.35em] text-[#D4A090] uppercase transition-all hover:border-[#C4806A] hover:bg-[rgba(196,128,106,0.05)]"
          >
            Book Haifa
          </a>
        </div>
      </div>
    </section>
  );
}
