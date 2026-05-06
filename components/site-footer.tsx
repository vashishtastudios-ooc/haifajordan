export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`border-t border-[rgba(196,128,106,0.12)] px-6 py-16 text-center md:px-10 ${className}`}
    >
      <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(196,128,106,0.2)]">
        <span className="font-display text-sm text-[#E8C4B8] italic">HJ</span>
      </div>
      <p className="mb-6 text-[12px] text-[rgba(245,240,238,0.45)]">
        © 2026 Haifa Jordan · All rights reserved
      </p>
      <div className="flex flex-wrap justify-center gap-8 text-[10px] font-medium tracking-[0.25em] uppercase">
        <a
          href="https://instagram.com/haifalive"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[rgba(245,240,238,0.45)] transition-colors hover:text-[#D4A090]"
        >
          Instagram
        </a>
        <a
          href="https://www.haifalive.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[rgba(245,240,238,0.45)] transition-colors hover:text-[#D4A090]"
        >
          Website
        </a>
      </div>
    </footer>
  );
}
