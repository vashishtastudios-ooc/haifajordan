import { BookingSection } from "@/components/booking-section";
import { Hero } from "@/components/hero";
import { Influences } from "@/components/influences";
import { LiveExperience } from "@/components/live-experience";
import { LiveMoodAlbum } from "@/components/live-mood-album";
import { QuoteBlock } from "@/components/quote-block";
import { ReleaseTicker } from "@/components/release-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { StorySection } from "@/components/story-section";
import { TimelineSection } from "@/components/timeline-section";
import { TvSection } from "@/components/tv-section";
import { VisualStrip } from "@/components/visual-strip";

export default function Home() {
  return (
    <div className="grain-overlay text-[#F5F0EE]">
      <SiteNav />
      <main className="relative z-30">
        <Hero />
        <ReleaseTicker />
        <StorySection />
        <QuoteBlock />
        <TvSection />
        <TimelineSection />
        <LiveMoodAlbum />
        <Influences />
        <VisualStrip />
        <LiveExperience />
        <BookingSection />
      </main>
      <SiteFooter className="relative z-30" />
    </div>
  );
}
