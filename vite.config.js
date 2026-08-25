import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // relative paths — works whether hosted at a domain root or a subfolder like GitHub Pages
});
