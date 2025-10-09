import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/", // Replace with your GitHub repo name
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
