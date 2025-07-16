import "dotenv/config"; // ensure this line is present
import type { Config } from "drizzle-kit";

export default {
  schema: "./server/schema",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
