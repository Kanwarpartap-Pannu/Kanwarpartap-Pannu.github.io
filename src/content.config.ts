import { defineCollection, z, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";

// =========================================
// Engineering projects (src/content/projects)
// =========================================

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/projects",
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    github: z.string().url().optional(),
    video: z.string().url().optional(),
    image: z.string().optional(),
    // Shows an "In progress" badge. Leave it out once the project is done.
    status: z.enum(["in-progress"]).optional(),
    // Shows the project as a large card at the top of the /projects page.
    highlight: z.boolean().default(false),
  }),
});

// =========================================
// "& More" sections (src/content/more/<section>)
// One folder per section. Each Markdown file is one card in that
// section's collage. See src/content/more/README.md for examples.
// =========================================

// Fields every "& More" item can use.
// Image paths are relative to the Markdown file, e.g. ./images/my-drawing.jpg,
// and are resized automatically.
const moreBase = ({ image }: Pick<SchemaContext, "image">) => {
  // A photo is either a plain path, or { src, caption }.
  // (Normalised by getPhotos() in src/lib/more.ts.)
  const photo = z.union([image(), z.object({ src: image(), caption: z.string().optional() })]);

  return {
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    // Optional: if left out, the first of `images` is the cover.
    cover: image().optional(),
    images: z.array(photo).default([]),
    // How a post with several photos shows in the collage:
    //   stack  = one card you can swipe through (default)
    //   spread = one card per photo, all opening the same page
    //   cover  = one card showing only the first photo
    // Whichever you pick, the post's own page shows every photo.
    display: z.enum(["stack", "spread", "cover"]).default("stack"),
    // How the photos are shown on the post's own page:
    //   gallery = one photo at a time with arrows and thumbnails (default)
    //   collage = all photos at once in a collage; click one to view full screen
    pageLayout: z.enum(["gallery", "collage"]).default("gallery"),
    // For `spread`: the most cards to show; the last one says "+N more".
    maxCards: z.number().int().min(1).default(4),
    video: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    // Marks placeholder content. Delete sample files once you add real ones.
    sample: z.boolean().default(false),
  };
};

const moreLoader = (folder: string) =>
  glob({ pattern: "*.md", base: `./src/content/more/${folder}` });

const music = defineCollection({
  loader: moreLoader("music"),
  schema: ({ image }) => z.object({ ...moreBase({ image }) }),
});

const art = defineCollection({
  loader: moreLoader("art"),
  schema: ({ image }) =>
    z.object({
      ...moreBase({ image }),
      medium: z.string().optional(), // e.g. "Charcoal on paper"
    }),
});

const reviews = defineCollection({
  loader: moreLoader("reviews"),
  schema: ({ image }) =>
    z.object({
      ...moreBase({ image }),
      kind: z.enum(["book", "movie", "series"]), // see REVIEW_KINDS in src/lib/more.ts
      creator: z.string().optional(), // author, director, or showrunner
      year: z.number().int().optional(), // year it was published or released
      rating: z.number().min(0).max(5).multipleOf(0.5).optional(), // stars out of 5
    }),
});

const diy = defineCollection({
  loader: moreLoader("diy"),
  schema: ({ image }) =>
    z.object({
      ...moreBase({ image }),
      builtWith: z.array(z.string()).default([]), // e.g. ["my brother"]
    }),
});

const fitness = defineCollection({
  loader: moreLoader("fitness"),
  schema: ({ image }) => z.object({ ...moreBase({ image }) }),
});

export const collections = { projects, music, art, reviews, diy, fitness };
