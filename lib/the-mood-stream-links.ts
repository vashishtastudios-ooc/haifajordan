/**
 * When the single is live on stores, paste the **official** track or album URLs here
 * (Spotify track link, Apple Music link, etc.). Leave `""` and the site uses a
 * search URL on each platform so buttons still go somewhere useful until release.
 */
export const THE_MOOD_DIRECT_STREAM_LINKS = {
  spotify: "",
  appleMusic: "",
  beatport: "",
  youtubeMusic: "",
} as const;

const SEARCH = encodeURIComponent("Ronnie Herel The Mood Haifa Quantize");

type OutletId = keyof typeof THE_MOOD_DIRECT_STREAM_LINKS;

const LABELS: Record<OutletId, string> = {
  spotify: "Spotify",
  appleMusic: "Apple Music",
  beatport: "Beatport",
  youtubeMusic: "YouTube Music",
};

function fallbackHref(id: OutletId): string {
  switch (id) {
    case "spotify":
      return `https://open.spotify.com/search/${SEARCH}`;
    case "appleMusic":
      return `https://music.apple.com/search?term=${SEARCH}`;
    case "beatport":
      return `https://www.beatport.com/search?q=${encodeURIComponent("Ronnie Herel The Mood Haifa")}`;
    case "youtubeMusic":
      return `https://music.youtube.com/search?q=${SEARCH}`;
    default:
      return `https://open.spotify.com/search/${SEARCH}`;
  }
}

export type MoodStreamOutlet = {
  id: OutletId;
  label: string;
  href: string;
  /** True when you set a direct URL in THE_MOOD_DIRECT_STREAM_LINKS */
  isOfficial: boolean;
};

export function getMoodStreamOutlets(): MoodStreamOutlet[] {
  const ids = Object.keys(THE_MOOD_DIRECT_STREAM_LINKS) as OutletId[];
  return ids.map((id) => {
    const direct = THE_MOOD_DIRECT_STREAM_LINKS[id].trim();
    return {
      id,
      label: LABELS[id],
      href: direct || fallbackHref(id),
      isOfficial: Boolean(direct),
    };
  });
}
