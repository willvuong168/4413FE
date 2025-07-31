import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://159.203.37.5:8080",
        changeOrigin: true, // rewrites Host header to match target
        secure: false, // if you’re running HTTPS on 8080 with a self-signed cert
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
