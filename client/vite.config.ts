import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  define: {
    "process.env": {
      CVT_SYNC_URL: JSON.stringify(process.env.CVT_SYNC_URL),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      LOG_LEVEL: JSON.stringify(process.env.LOG_LEVEL),
    },
  },
});


