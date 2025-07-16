import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const doctrineVersions = pgTable("doctrine_versions", {
  id: serial("id").primaryKey(),
  version: varchar("version", { length: 16 }),
  title: varchar("title", { length: 128 }),
  principle: text("principle"),
  date: timestamp("date", { mode: "date" }),
});
