import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/schema",  // path to your schema + models
  out: "./drizzle",           // where generated SQL will live
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});
