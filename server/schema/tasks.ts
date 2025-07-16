import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  agent: text("agent").notNull(),
  task: text("task").notNull(),
  griefTier: text("grief_tier").default("mild"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});