import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@foodflow/api-contracts": path.resolve(__dirname, "../../packages/api-contracts/src"),
      "@foodflow/lib": path.resolve(__dirname, "../../packages/lib/src"),
      "@foodflow/types": path.resolve(__dirname, "../../packages/types/src"),
      "@foodflow/ui": path.resolve(__dirname, "../../packages/ui/src")
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          tanstack: ["@tanstack/react-query", "@tanstack/react-table"],
          charts: ["recharts"]
        }
      }
    }
  }
});
