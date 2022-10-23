import * as path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: [
        path.resolve(__dirname, "index.html"),
        path.resolve(__dirname, "background.ts"),
      ],
      output: [
        {
          entryFileNames: "[name].js",
          chunkFileNames: "assets/[name].js",
          assetFileNames: "assets/[name].[ext]",
        },
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
