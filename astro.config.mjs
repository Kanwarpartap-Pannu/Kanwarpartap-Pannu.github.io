
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://kanwarpannu.com",

  vite: {
    plugins: [tailwindcss()],
  },
});
