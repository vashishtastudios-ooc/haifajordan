const cards = [
  {
    title: "Premium vocalist",
    desc: "Soul, house, and club classics with three decades behind the mic — a voice that fills the room and steers the night.",
  },
  {
    title: "Full event host",
    desc: "From welcome to last call — performance and patter woven into one seamless arc so your guests never clock-watch.",
  },
  {
    title: "Sound production",
    desc: "Technical rigour meets artistic instinct — stages tuned so every lyric lands where it should.",
  },
  {
    title: "The Haifa Live band",
    desc: "Bespoke line-ups built around your brief — intimate lounges to full-scale spectacle, one standard: undeniable.",
  },
  {
    title: "International",
    desc: "UK, Dubai, Ibiza and beyond — at home wherever the rider is serious and the crowd is hungry.",
  },
  {
    title: "Full-service agency",
    desc: "Via Sing It Entertainment — artists, bands, production: one call from concept to curtain.",
  },
];

export function LiveExperience() {
  return (
    <section id="live" className="scroll-mt-24 px-6 py-24 md:px-10 md:py-28">
      <p className="section-label mx-auto mb-6 max-w-6xl text-[9px] font-semibold tracking-[0.35em] text-[#C4806A] uppercase">
        The live experience
      </p>
      <div className="mx-auto grid max-w-6xl gap-px bg-[rgba(196,128,106,0.15)] md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <article
            key={c.title}
            className="bg-[#080808] p-10 transition-colors hover:bg-[#0f0d0c]"
          >
            <h3 className="font-display mb-3.5 text-[clamp(13px,2vw,17px)] font-semibold tracking-[0.16em] text-[#D4A090] uppercase">
              {c.title}
            </h3>
            <p className="text-[14px] leading-[1.75] text-[rgba(245,240,238,0.55)]">
              {c.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
