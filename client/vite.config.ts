import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      include: ["buffer", "process"], // include specific polyfills
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Define environment variables for client-side use
    'process.env.MOCA_API_BASE': JSON.stringify(process.env.VITE_MOCA_API_BASE || "https://api.air.moca.network"),
    'process.env.MOCA_ISSUER_DID': JSON.stringify(process.env.VITE_MOCA_ISSUER_DID),
    'process.env.AIR_VERIFY_API_URL': JSON.stringify(process.env.VITE_AIR_VERIFY_API_URL),
    'process.env.AIR_VERIFY_API_KEY': JSON.stringify(process.env.VITE_AIR_VERIFY_API_KEY),
  },
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1'
    ],
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/generate-moca-jwt': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
});
