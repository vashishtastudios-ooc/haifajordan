export type HaifaReel = {
  mp4: string;
  webm?: string;
  poster?: string;
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
  { stem: "story1", caption: "Story 1", alt: "Haifa Jordan — story 1" },
  { stem: "story2", caption: "Story 2", alt: "Haifa Jordan — story 2" },
  { stem: "story3", caption: "Story 3", alt: "Haifa Jordan — story 3" },
  { stem: "story4", caption: "Story 4", alt: "Haifa Jordan — story 4" },
] as const;

/**
 * Put files in `public/haifa/`. Names are stems (no extension) unless noted.
 */
export const SITE_MEDIA = {
  hero: {
    poster: "/haifa/hero-poster.jpg",
    videoWebm: "/haifa/hero.webm",
    videoMp4: "/haifa/hero.mp4",
  },
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
    { mp4: "/haifa/reel-1.mp4" },
    { mp4: "/haifa/reel-2.mp4" },
    { mp4: "/haifa/reel-3.mp4" },
    { mp4: "/haifa/venue-reel-1.mp4" },
  ] satisfies readonly HaifaReel[],
  gallery: STORY_FRAMES.map(({ stem, caption }) => ({
    caption,
    candidates: haifaStem(stem),
  })),
} as const;
