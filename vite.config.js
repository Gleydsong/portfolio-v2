import { defineConfig } from "vite";

export default defineConfig({
  base: "/portfolio-v2/",
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
