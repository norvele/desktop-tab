import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";
import { mergeConfig } from "vite";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // globalSetup: ["./src/test/setup.ts"],
    },
  })
);
