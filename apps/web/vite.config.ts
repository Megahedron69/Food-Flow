import path from "node:path";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "app-icon.svg"],
      manifest: {
        name: "FoodFlow",
        short_name: "FoodFlow",
        description: "Cloud-native multi-outlet POS and restaurant operations platform.",
        theme_color: "#0f172a",
        background_color: "#f8fafc",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/app-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any"
          },
          {
            src: "/app-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        navigateFallbackDenylist: [/^\/api\//]
      }
    })
  ],
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
