"use client";

import { useEffect, useState } from "react";

export function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-[rgba(196,128,106,0.12)] bg-[#080808]/90 px-6 py-2.5 backdrop-blur-md md:px-10 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <a
            href="/"
            className="flex min-w-0 shrink items-center gap-2.5"
            onClick={() => setOpen(false)}
            aria-label="Haifa Live home"
          >
            <span className="font-display text-lg tracking-tight text-[#F5F0EE] italic">
              Haifa<span className="text-[#E8C4B8] not-italic">Live</span>
            </span>
          </a>

          <button
            type="button"
            className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-md border border-[rgba(196,128,106,0.35)] text-[#E8C4B8] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-site-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="text-[#F5F0EE]">
                <path
                  fill="currentColor"
                  d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"
                />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="text-[#F5F0EE]">
                <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
              </svg>
            )}
          </button>

          <nav className="hidden md:block" aria-label="Primary">
            <ul className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
              <li>
                <a
                  href="/about"
                  className="text-[10px] font-medium tracking-[0.28em] text-[rgba(245,240,238,0.45)] uppercase transition-colors hover:text-[#D4A090]"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/book"
                  className="text-[11px] font-bold tracking-[0.28em] text-[#C4806A] uppercase transition-colors hover:text-[#E8C4B8]"
                >
                  Book Now
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {open ? (
        <div
          id="mobile-site-nav"
          className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-[#080808]/97 px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <nav aria-label="Primary mobile">
            <ul className="flex flex-col gap-1">
              <li>
                <a
                  href="/about"
                  className="flex min-h-12 items-center rounded-md px-3 text-[13px] font-medium tracking-[0.12em] text-[#F5F0EE] uppercase transition-colors active:bg-[rgba(196,128,106,0.12)]"
                  onClick={() => setOpen(false)}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/book"
                  className="flex min-h-12 items-center rounded-md px-3 text-[15px] font-bold tracking-[0.12em] text-[#C4806A] uppercase transition-colors active:bg-[rgba(196,128,106,0.12)]"
                  onClick={() => setOpen(false)}
                >
                  Book Now
                </a>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </>
  );
}
