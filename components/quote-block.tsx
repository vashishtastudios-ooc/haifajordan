export function QuoteBlock() {
  const testimonials = [
    {
      quote:
        "You’ve got a great smoky voice, which is so natural — you could never put that on. You’ve got a really great tone to your voice.",
      credit: "Sharon Osbourne — The X Factor, 2005",
    },
    {
      quote:
        "Great looking girl. Very commercial, very likeable. I think you have something very, very good about you.",
      credit: "Simon Cowell — The X Factor, 2005",
    },
  ] as const;

  return (
    <div className="border-y border-[rgba(196,128,106,0.12)] bg-[#1c1918] px-6 py-20 md:px-10">
      <div className="mx-auto max-w-5xl">
        {testimonials.map((t, i) => (
          <blockquote
            key={t.credit}
            className={`relative py-8 md:py-9 ${i > 0 ? "border-t border-[rgba(196,128,106,0.14)]" : ""}`}
          >
            <p className="font-display text-[clamp(1rem,2.1vw,1.45rem)] leading-[1.5] font-normal text-[#F5F0EE] italic">
              &ldquo;{t.quote}&rdquo;
            </p>
            <footer className="mt-4 text-[8px] font-semibold tracking-[0.22em] text-[#C4806A] uppercase">
              {t.credit}
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
