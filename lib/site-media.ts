export type HaifaReel = {
  mp4: string;
  webm?: string;
  poster?: string;
  caption: string;
  alt: string;
};

/** Try common extensions — place files under `public/haifa/` (e.g. `story1.png`). */
export function haifaStem(stem: string): readonly string[] {
  const b = `/haifa/${stem}`;
  /** Prefer .jpeg early — matches shipped story assets; fewer 404s before a hit. */
  return [
    `${b}.jpeg`,
    `${b}.jpg`,
    `${b}.webp`,
    `${b}.png`,
    `${b}.JPG`,
    `${b}.PNG`,
  ] as const;
}

/** `public/haifa/story1.jpeg` … `story4` — shared by #story grid and #visuals film strip. */
const STORY_FRAMES = [
  {
    stem: "story1",
    caption: "Live on stage",
    alt: "Haifa Jordan, soul and house vocalist for hire, performing live at a UK event",
  },
  {
    stem: "story2",
    caption: "Studio session",
    alt: "Haifa Jordan recording vocals — London-based soul and house singer-songwriter",
  },
  {
    stem: "story3",
    caption: "Behind the scenes",
    alt: "Haifa Jordan behind the scenes — premium live vocalist for weddings and corporate events",
  },
  {
    stem: "story4",
    caption: "On the mic",
    alt: "Haifa Jordan with microphone on stage — UK soul and house vocalist available for booking",
  },
] as const;

/**
 * Put files in `public/haifa/`. Names are stems (no extension) unless noted.
 */
export const SITE_MEDIA = {
  hero: {
    poster: "/haifa/hero-poster.jpg",
    videoWebm: "/haifa/hero.webm",
    videoMp4: "/haifa/hero.mp4",
    bannerSrc: "/haifa/haifajordanherobannerimg.jfif",
    bannerAlt:
      "Haifa Jordan on stage — premium soul and house vocalist for hire across London and the UK",
  },
  logoAlt:
    "Haifa Live logo — Haifa Jordan, soul and house vocalist for hire in London and the UK",
  albumCoverAlt:
    "The Mood single artwork — Haifa Jordan ft. Ronnie Herel, soul and house release on Quantize Recordings",
  profileCandidates: haifaStem("profile"),
  logoCandidates: [
    "/haifa/logohaifalive.png",
    "/haifa/logohaifalive.jfif",
    ...haifaStem("logohaifalive"),
  ] as const,
  albumCoverCandidates: haifaStem("the-mood-cover"),
  storyImages: STORY_FRAMES.map(({ stem, alt }) => ({
    alt,
    candidates: haifaStem(stem),
  })),
  /** Vertical reels in #visuals — MP4 under `public/haifa/`. Optional `webm` / `poster` per clip. */
  reels: [
    {
      mp4: "/haifa/reel-1.mp4",
      caption: "Live set",
      alt: "Haifa Jordan live vocal performance — soul and house vocalist for hire in London",
    },
    {
      mp4: "/haifa/reel-2.mp4",
      caption: "Soundcheck",
      alt: "Haifa Jordan soundcheck before a UK live event — professional vocalist for weddings and private bookings",
    },
    {
      mp4: "/haifa/reel-3.mp4",
      caption: "Crowd moment",
      alt: "Haifa Jordan engaging a crowd on stage — soul and house live vocalist",
    },
    {
      mp4: "/haifa/venue-reel-1.mp4",
      caption: "Venue night",
      alt: "Haifa Jordan at a UK venue night — book a premium soul and house vocalist",
    },
  ] satisfies readonly HaifaReel[],
  gallery: STORY_FRAMES.map(({ stem, caption, alt }) => ({
    caption,
    alt,
    candidates: haifaStem(stem),
  })),
} as const;
