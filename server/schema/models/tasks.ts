import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  agentId: varchar("agent_id", { length: 32 }).notNull(),
  description: varchar("description", { length: 2048 }).notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  urgency: varchar("urgency", { length: 16 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});