import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const reflections = pgTable("reflections", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  griefTier: varchar("grief_tier", { length: 5 }).notNull(), // I–V
  submittedBy: varchar("submitted_by", { length: 100 }),
  cvtTimestamp: timestamp("cvt_timestamp", { withTimezone: true }).defaultNow().notNull()
});