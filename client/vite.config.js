import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react";
            if (id.includes("lodash")) return "lodash";
            if (id.includes("fortawesome")) return "fortawesome";
            if (id.includes("dnd-kit")) return "dnd-kit";
            if (id.includes("emotion")) return "emotion";
            if (id.includes("autoprefixer")) return "autoprefixer";
            if (id.includes("swiper")) return "swiper";
            if (id.includes("socket.io-client")) return "socket.io-client";
            if (id.includes("framer-motion")) return "framer-motion";
            return "vendor";
          }
        },
      },
    },
  },
});
