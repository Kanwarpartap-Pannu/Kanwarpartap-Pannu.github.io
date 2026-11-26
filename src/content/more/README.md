# "& More" content

Everything on the `/more` pages comes from the Markdown files in this folder.
Each section has its own folder, and **each `.md` file is one card** in that section's collage.

```text
src/content/more/
├── music/      → /more/music     Music & Guitar
├── art/        → /more/art       Art
├── reviews/    → /more/reviews   Books & Film
├── diy/        → /more/diy       DIY Projects
└── fitness/    → /more/fitness   Fitness
```

Inside each folder, put images in its `images/` subfolder.

## Adding an item

1. Copy any file in the section's folder and rename it. The file name becomes the page address:
   `art/charcoal-hands.md` becomes `/more/art/charcoal-hands`.
2. Put its image in that folder's `images/` subfolder.
3. Edit the front matter (the part between the `---` lines), then write anything you like below it.

A card's height follows its image's shape, so a tall drawing makes a tall card and a wide photo makes a wide one.

Card placement is automatic (see `src/scripts/collage-layout.ts`):
- Photos from the same post always stay together, touching each other, with the main photo first.
- Posts are arranged so the columns end as evenly as possible, leaving little white space. Newer posts tend to be near the top, but the order may shift to make everything fit.

## Replacing the sample cards

Every placeholder has `sample: true` and a file name starting with `sample-`.
When you add real items, delete the sample `.md` files and their `images/sample-*.jpg` files.
A section with no items shows "Coming soon" automatically.

## Fields

### Every section

```yaml
title: "Charcoal Hands"            # required
date: 2026-10-02                   # required, sets the order
summary: "One line about it."      # optional, used in link previews
cover: ./images/charcoal-hands.jpg # optional, the card's picture
images:                            # optional, more photos (see below)
  - ./images/charcoal-hands-detail.jpg
video: "https://youtu.be/VIDEO_ID" # optional, embeds the video on the page
tags: [Figure Drawing]             # optional
```

Image paths start with `./images/` and are relative to the `.md` file.
Large phone photos work, but ask Claude to shrink them and strip their location data before committing.

If an item has a `video` but no photos, the card uses YouTube's thumbnail with a ▶ badge.
If it has neither, the card shows its summary as text.

## Posts with several photos

List the photos under `images`. A photo can be a plain path, or have a caption:

```yaml
images:
  - src: ./images/marathon-start.jpg
    caption: "Start line at 7am"
  - ./images/marathon-km30.jpg          # no caption
  - src: ./images/marathon-medal.jpg
    caption: "Finished!"
```

You don't need `cover` as well: the first photo is used as the cover.
(If you do set `cover`, it comes first and `images` follow.)

Then choose how the post shows in the collage with `display`:

| `display` | In the collage | Good for |
|---|---|---|
| `stack` (the default, no line needed) | **One card** that looks like a small deck. Swipe on a phone, or use the ‹ › arrows on desktop, to flip through the photos. | Sketchbooks, progress updates, most posts |
| `spread` | **One card per photo**, all opening the same page. The first card shows the title; the others show "Title · 2/5". Hovering any of them highlights the whole group. | Big moments you want to stand out, like a race |
| `cover` | **One card showing only the first photo.** The other photos appear only on the post's own page. | Reviews (poster on the card, film stills inside), anything where one image represents the post |

For `spread`, `maxCards` sets the most cards shown (default 4). The last one says "+N more".

```yaml
display: spread
maxCards: 6
```

### How photos appear on the post's own page

Whichever `display` you pick, the post's page shows **every** photo. Choose how with `pageLayout`:

| `pageLayout` | On the post's page |
|---|---|
| `gallery` (the default, no line needed) | One photo at a time, like the engineering project pages: ← → arrows, the caption underneath, a row of thumbnails, and click to view full screen. |
| `collage` | All photos at once in a collage, each keeping its own shape, with captions underneath. Click any photo to view it full screen, with arrows, arrow keys, swipe, and Esc to close. |

```yaml
pageLayout: collage
```

A photo without a caption shows the post title instead (gallery) or no caption (collage).

## Extra fields for each section

### Music & Guitar (`music/`)

Only the shared fields. A typical guitar progress post:

```yaml
title: "Fingerstyle Progress, Month 3"
date: 2026-10-01
video: "https://youtu.be/VIDEO_ID"
tags: [Progress]
```

### Art (`art/`)

```yaml
medium: "Charcoal on paper"   # shown under the title
```

### Books & Film (`reviews/`)

A good layout for reviews: put the poster or book cover first and any stills after it, with `display: cover`. For **movies and TV series**, the poster appears only on the collage card: the review page's gallery shows just the stills after it (and no gallery at all if there are none). Book covers still appear on the page. See `reviews/swades.md` for a template. The page shows a **Rating** section automatically from the single `rating` field (or "Not rated yet"), followed by whatever you write under `## Review`.

```yaml
kind: book                    # required: book, movie, or series (TV series)
creator: "Tracy Kidder"       # author, director, or showrunner
year: 1981                    # year published or released
rating: 4.5                   # how much you enjoyed it, out of 5 (half stars allowed)
```

The filter buttons on the reviews page (All, Books, Movies, TV Series) use `kind`. A button only appears once you have a review of that kind. To add a new kind, add it to `REVIEW_KINDS` in `src/lib/more.ts` and to `kind` in `src/content.config.ts`.

### DIY Projects (`diy/`)

```yaml
builtWith: ["my brother"]     # shows "Built with my brother" on the page
```

### Fitness (`fitness/`)

Only the shared fields.

## Changing section names or adding a section

- **Rename a section or change its description:** edit `MORE_SECTIONS` in `src/lib/more.ts`.
- **Add a new section:** add an entry to `MORE_SECTIONS`, add a matching collection in `src/content.config.ts`, and create its folder here.

The landing page tiles use the newest item's cover in each section, so they update as you add content.
