import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const reflections = pgTable("reflections", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  author: text("author"),
  griefWeight: integer("grief_weight").default(1),
  createdAt: timestamp("created_at").defaultNow()
});
