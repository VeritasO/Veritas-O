import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const canonicalBooks = pgTable("canonicalBooks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  summary: text("summary"),
  version: text("version"),
});