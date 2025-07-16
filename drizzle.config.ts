import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./server/schema",       // Points to your schema folder
  out: "./drizzle",                // Where migration SQL will be output
  dialect: "postgresql",           // Required by Drizzle v0.19+
  driver: "pg",                    // Use node-postgres driver
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!, // Neon-provided URL
  },
} satisfies Config;
