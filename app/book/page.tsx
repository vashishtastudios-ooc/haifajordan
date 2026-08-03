import type { Metadata } from "next";
import { BookForm } from "@/components/book-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Book Now",
  description:
    "Book Haifa Jordan for weddings, corporate events, private celebrations and destination experiences. Premium soul & house vocalist — London, UK & international. Send an enquiry.",
  alternates: {
    canonical: "/book",
  },
};

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

          <BookForm />
        </section>
      </main>
      <SiteFooter className="relative z-30" />
    </div>
  );
}
