import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { computeDriftScore } from "../utils/computeDriftScore";

export const canonicalBooks = pgTable("canonical_books", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  summary: text("summary"),
  version: text("version"),
});

export { canonicalBooks as books }; // alias for internal use

const allBooks = await db.select().from(canonicalBooks);