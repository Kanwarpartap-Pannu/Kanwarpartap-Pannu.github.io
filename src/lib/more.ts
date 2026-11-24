import { getCollection, type CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";

// =========================================
// "& More" sections
// To rename a section or change its blurb, edit it here.
// To add a whole new section, add an entry here AND a matching
// collection in src/content.config.ts with its own folder.
// =========================================

export const MORE_SECTIONS = [
  {
    key: "music",
    title: "Music & Guitar",
    label: "MUSIC",
    blurb: "Guitar progress, covers, and songs I've been learning.",
  },
  {
    key: "art",
    title: "Art",
    label: "ART",
    blurb: "Drawings, sketches, and other things I make by hand.",
  },
  {
    key: "reviews",
    title: "Books & Film",
    label: "REVIEWS",
    blurb: "Short reviews of books I've read and movies and shows I've watched.",
  },
  {
    key: "diy",
    title: "DIY Projects",
    label: "DIY",
    blurb: "Things my brother and I build, fix, and tinker with.",
  },
  {
    key: "fitness",
    title: "Fitness",
    label: "FITNESS",
    blurb: "Training, progress, and staying active.",
  },
] as const;

// =========================================
// Review kinds (Books & Film section)
// To add a kind, add it here AND to `kind` in src/content.config.ts.
// =========================================

export const REVIEW_KINDS = {
  book: { label: "Book", filter: "Books", creatorPrefix: "by" },
  movie: { label: "Movie", filter: "Movies", creatorPrefix: "Directed by" },
  series: { label: "TV Series", filter: "TV Series", creatorPrefix: "Showrunner:" },
} as const;

export type ReviewKind = keyof typeof REVIEW_KINDS;

export type MoreSectionKey = (typeof MORE_SECTIONS)[number]["key"];
export type MoreSection = (typeof MORE_SECTIONS)[number];
export type MoreEntry = CollectionEntry<MoreSectionKey>;

export function getSection(key: string): MoreSection | undefined {
  return MORE_SECTIONS.find((section) => section.key === key);
}

/** All items in a section, newest first. */
export async function getSectionEntries(key: MoreSectionKey): Promise<MoreEntry[]> {
  const entries = (await getCollection(key)) as MoreEntry[];
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export type Photo = { src: ImageMetadata; caption?: string };

/** Every photo in a post: the cover first (if set), then `images`. */
export function getPhotos(entry: MoreEntry): Photo[] {
  const photos: Photo[] = [];
  if (entry.data.cover) photos.push({ src: entry.data.cover });
  for (const item of entry.data.images as unknown[]) {
    // Each item is either an image, or { src: image, caption }
    const asCaptioned = item as { src: unknown; caption?: string };
    if (asCaptioned && typeof asCaptioned.src === "object") {
      photos.push({ src: asCaptioned.src as ImageMetadata, caption: asCaptioned.caption });
    } else {
      photos.push({ src: item as ImageMetadata });
    }
  }
  return photos;
}

/** Extracts the video ID from youtube.com/watch?v=, youtu.be/, or /shorts/ links. */
export function youtubeId(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/))([\w-]{11})/,
  );
  return match?.[1];
}

/** YouTube's own thumbnail for a video link, used when an item has no cover. */
export function youtubeThumbnail(url: string | undefined): string | undefined {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-CA", { year: "numeric", month: "long", timeZone: "UTC" });
}
