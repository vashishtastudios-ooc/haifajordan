const items = [
  "New cut on the floor",
  "The Mood",
  "Ronnie Herel ft. Haifa",
  "Quantize Recordings",
  "Mi-Soul rotation",
  "Full drop — 21 May 2026",
];

export function ReleaseTicker() {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-[rgba(196,128,106,0.2)] bg-[linear-gradient(90deg,#A0604A,#C4806A,#A0604A)] py-3.5">
      <div className="ticker-track flex w-max gap-10 whitespace-nowrap px-4 text-[10px] font-bold tracking-[0.35em] text-[#080808] uppercase">
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span>{t}</span>
            <span className="opacity-40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
