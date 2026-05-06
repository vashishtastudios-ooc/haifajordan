export function QuoteBlock() {
  return (
    <div className="border-y border-[rgba(196,128,106,0.12)] bg-[#1c1918] px-6 py-20 md:px-10">
      <blockquote className="relative mx-auto max-w-3xl text-center">
        <span
          className="font-display pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 text-[150px] leading-none text-[#C4806A]/22"
          aria-hidden
        >
          &ldquo;
        </span>
        <p className="font-display relative z-10 mb-7 text-[clamp(1.45rem,3.7vw,2.3rem)] leading-[1.35] font-normal text-[#F5F0EE] italic drop-shadow-[0_4px_24px_rgba(196,128,106,0.2)]">
          Simply amazing.
        </p>
        <footer className="text-[10px] font-semibold tracking-[0.24em] text-[#E8C4B8] uppercase">
          Simon Cowell — Pop Idol, 2001
        </footer>
      </blockquote>
    </div>
  );
}
