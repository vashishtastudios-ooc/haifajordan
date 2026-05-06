/**
 * Audio files for The Mood live desk — place under `public/haifa/`.
 * Browser uses the first <source> it can decode. WAV is listed first while masters live in repo; put .mp3 first for lighter streaming if you add it.
 */
export const THE_MOOD_TRACKS = [
  {
    id: "01",
    title: "The Mood",
    sub: "Original vocal",
    meta: "Quantize",
    sources: [
      { src: "/haifa/the-mood-vocal.wav", type: "audio/wav" },
      { src: "/haifa/the-mood-vocal.mp3", type: "audio/mpeg" },
      { src: "/haifa/the-mood-vocal.m4a", type: "audio/mp4" },
      { src: "/haifa/the-mood-vocal.ogg", type: "audio/ogg" },
    ],
  },
  {
    id: "02",
    title: "The Mood",
    sub: "DJ Spen & MicFreak remix",
    meta: "Club",
    sources: [
      { src: "/haifa/the-mood-remix.wav", type: "audio/wav" },
      { src: "/haifa/the-mood-remix.mp3", type: "audio/mpeg" },
      { src: "/haifa/the-mood-remix.m4a", type: "audio/mp4" },
      { src: "/haifa/the-mood-remix.ogg", type: "audio/ogg" },
    ],
  },
] as const;
