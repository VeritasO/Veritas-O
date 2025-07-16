// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/schema",       // Your schema folder
  out: "./drizzle",                // Migration output folder
  dialect: "postgresql",           // ✅ REQUIRED for new drizzle-kit
  driver: "pg",                    // Your driver (still valid)
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});
