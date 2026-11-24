# Kanwar Pannu — Engineering Portfolio

Source for [kanwarpannu.com](https://kanwarpannu.com), my portfolio of digital design, computer architecture, and AI hardware projects.

Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), and deployed to GitHub Pages.

## Featured projects

- **ZeroCost-LLC:** a predictable shared last-level cache in SystemVerilog
- **Accuracy-Aware Tensor Processing Unit:** an INT8-to-INT2 TPU taken from RTL to GDS on GF180MCU
- **32-bit RISC-V CPU:** a five-stage pipelined RV32I processor
- **FPGA Spiking CNN Accelerator:** a spiking neural network for MNIST, streamed over UART
- **ECG Monitoring System:** a MOSFET amplifier ECG with live AI heartbeat classification

## Running locally

Requires Node.js 22 or newer.

```sh
npm install
npm run dev       # dev server at http://localhost:4321
npm run build     # production build in ./dist
npm run preview   # serve the production build locally
```

## Project structure

```text
public/                  static files: images, resume.pdf, link-preview image
src/
├── components/          header, footer, project cards, gallery, contact icons
│   └── more/            "& More" tiles, collage cards, star ratings
├── content/
│   ├── projects/        one Markdown file per project
│   └── more/            one folder per "& More" section (music, art, reviews, diy, fitness)
├── layouts/             shared page layout and link-preview tags
├── lib/more.ts          "& More" section names and helpers
├── pages/               home, projects, resume, & more, 404
└── styles/global.css    theme colours and project page styles
```

## Adding a project

1. Create a Markdown file in `src/content/projects/`. The file name becomes the page address, for example `my-project.md` becomes `/projects/my-project`.
2. Fill in the front matter. The fields are defined in `src/content.config.ts`:

   ```yaml
   title: "Project Name"
   description: "One-sentence summary."
   category: "Computer Architecture"
   date: 2026-01-01          # sets the order on the home page, newest first
   tags: [SystemVerilog, RTL]
   featured: true            # shows the project on the home page
   github: "https://github.com/..."     # optional
   image: "/images/..."                 # optional card thumbnail
   video: "https://youtu.be/..."        # optional demo video button
   status: in-progress                  # optional "In progress" badge; remove when done
   highlight: true                      # optional: large card at the top of /projects
   ```

Every project appears on the **Projects page** (`/projects`), newest first, as a grid of same-size cards. `featured: true` additionally shows it on the home page. Projects with `highlight: true` get a large card at the top of the Projects page.

3. To add a gallery, put the images in `public/images/<project>/` and list them under the project's name in `src/pages/projects/[slug].astro`.

## Adding to "& More"

Music, art, reviews, DIY projects, and fitness live in `src/content/more/`, with one folder per section and one Markdown file per card. See [`src/content/more/README.md`](src/content/more/README.md) for the fields and examples.

## Updating the resume

The downloadable resume is `public/resume.pdf`. It's the **web version** of the LaTeX resume, which leaves out the phone number so it isn't scraped from a public file. The normal LaTeX build still includes it for resumes sent to employers.

From the LaTeX resume folder, build the web version:

```sh
pdflatex -jobname=resume-web "\def\webversion{1}\input{resume}"
```

Then copy `resume-web.pdf` here as `public/resume.pdf`, and commit and push.

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages through `.github/workflows/deploy.yml`.
