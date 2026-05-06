const items = [
  {
    year: "15",
    title: "The beginning",
    desc: "Freestyle vocalist on London's sharpest circuit — UK house and garage in its golden hour. The voice finds its crowd.",
  },
  {
    year: "18",
    title: "Public Demand Records",
    desc: "Signed to the label home of Craig David and Artful Dodger. Debut cut remixed by Artful Dodger — peak-era garage, peak-era energy.",
  },
  {
    year: "2001",
    title: "Pop Idol — Final 10",
    desc: "Live finals on the UK's inaugural Pop Idol. National recognition overnight — and a quote that still follows the tape.",
  },
  {
    year: "2002",
    title: "Ministry of Sound · #2 UK dance",
    desc: "Incentive / Ministry of Sound. \"Unbreak My Heart\" hits #2. Topshop TV. Touring. Privilege, Ibiza — warming up for Adeva.",
  },
  {
    year: "2003",
    title: "EMI · L O V E · Dubai",
    desc: "EMI circles her bilingual L O V E. One of the first UK artists with Westwood (BBC Radio 1) in Dubai.",
  },
  {
    year: "2004",
    title: "Eurovision — Making Your Mind Up",
    desc: "Sony. BBC primetime. Competing to fly the UK flag at Eurovision.",
  },
  {
    year: "2005",
    title: "The X Factor — Final 7",
    desc: "Sharon's group. LA. Final seven. Sharon: \"You've got a great smoky voice — you could never put that on.\"",
  },
  {
    year: "2018",
    title: "Sing It Entertainment",
    desc: "Founding a boutique agency on 25+ years of relationships — bespoke, full-service events from first brief to last cab.",
  },
  {
    year: "2026",
    title: "Quantize — \"The Mood\"",
    desc: "Written by Haifa Jordan. Ronnie Herel & Kevin [TBC] on DJ Spen's Quantize. Mi-Soul playlist. Full release 21 May 2026.",
  },
];

export function TimelineSection() {
  return (
    <section id="milestones" className="bg-[#1c1918] px-6 py-24 md:px-10 md:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="section-label mb-16 text-[9px] font-semibold tracking-[0.35em] text-[#C4806A] uppercase">
          Career milestones
        </p>
        <ul className="relative border-l border-[rgba(196,128,106,0.2)] pl-8 md:pl-12">
          {items.map((it) => (
            <li key={it.year} className="relative mb-14 last:mb-0">
              <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[#C4806A] shadow-[0_0_12px_rgba(196,128,106,0.6)]" />
              <div className="grid gap-6 md:grid-cols-[100px_1fr] md:gap-10">
                <p className="font-display text-[26px] leading-none font-normal text-[#C4806A]">
                  {it.year}
                </p>
                <div>
                  <p className="mb-2.5 text-[10px] font-semibold tracking-[0.22em] text-[#D4A090] uppercase">
                    {it.title}
                  </p>
                  <p className="text-[14px] leading-[1.75] text-[rgba(245,240,238,0.62)]">
                    {it.desc}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
