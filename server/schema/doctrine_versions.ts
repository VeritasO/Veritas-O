import { pgTable, serial, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const doctrineVersions = pgTable("doctrine_versions", {
  id: serial("id").primaryKey(),
  book: varchar("book", { length: 64 }),
  version: varchar("version", { length: 16 }),
  summary: text("summary"),
  updatedAt: timestamp("updated_at", { mode: "date" }),
  approvedBy: varchar("approved_by", { length: 64 }),
});
