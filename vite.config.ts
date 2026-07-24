import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  const base = process.env.VITE_BASE_PATH ?? "/";

  return {
    base,
    build: {
      // MapLibre is intentionally lazy-loaded only on map screens.
      chunkSizeWarningLimit: 1100,
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon-16x16.png",
          "favicon-32x32.png",
          "apple-touch-icon.png",
          "assets/yorimichi-quest-key-visual.jpg",
          "assets/washi-paper.jpg",
        ],
        devOptions: { enabled: true },
        manifest: {
          name: "寄り道クエスト",
          short_name: "寄り道",
          description: "いつもの道を、少しだけ冒険に変える。",
          lang: "ja",
          start_url: ".",
          scope: ".",
          display: "standalone",
          background_color: "#f7eedb",
          theme_color: "#f7eedb",
          orientation: "portrait",
          icons: [
            { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            {
              src: "icon-maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ]
        },
        workbox: {
          navigateFallback: "index.html",
          globPatterns: ["**/*.{js,css,html,jpg,png}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/tile\.openstreetmap\.org\//,
              handler: "CacheFirst",
              options: {
                cacheName: "yorimichi-map-tiles",
                expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 },
                cacheableResponse: { statuses: [0, 200] }
              }
            }
          ]
        }
      })
    ]
  };
});
