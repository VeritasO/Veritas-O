import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const contradictions = pgTable("contradictions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 128 }).notNull(),
  description: varchar("description", { length: 2048 }).notNull(),
  severity: varchar("severity", { length: 16 }).notNull(), // e.g., "low", "medium", "high"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});