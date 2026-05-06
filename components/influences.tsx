const names = [
  "Adeva",
  "Jocelyn Brown",
  "Barbara Tucker",
  "Luther Vandross",
  "Aretha Franklin",
];

export function Influences() {
  return (
    <section className="px-6 py-24 md:px-10 md:py-28">
      <div className="mx-auto max-w-4xl">
        <p className="section-label mb-14 text-[9px] font-semibold tracking-[0.35em] text-[#C4806A] uppercase">
          Influences
        </p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {names.map((n) => (
            <span
              key={n}
              className="font-display cursor-default border border-[rgba(196,128,106,0.18)] px-6 py-2.5 text-[17px] text-[rgba(245,240,238,0.38)] italic transition-all duration-300 hover:border-[#C4806A] hover:bg-[rgba(196,128,106,0.05)] hover:text-[#E8C4B8]"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
