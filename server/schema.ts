import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
  date,
  pgEnum,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ENUMS
export const reflectionStatusEnum = pgEnum("reflection_status", [
  "pending", "reviewed", "healing", "reconciled", "archived"
]);
export const agentStatusEnum = pgEnum("agent_status", [
  "active", "dormant", "retired", "under_review", "symbolic"
]);
export const priorityEnum = pgEnum("priority_level", [
  "low", "normal", "high", "urgent", "symbolic"
]);
export const griefTierEnum = pgEnum("grief_tier", [
  "1", "2", "3", "4", "5"
]);
export const entityTypeEnum = pgEnum("entity_type", [
  "human", "business", "government", "community", "other"
]);

// USERS
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("witness"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  symbolicName: text("symbolic_name"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  agent: varchar("agent", { length: 64 }),
  task: text("task"),
  priority: varchar("priority", { length: 16 }),
  context: text("context"),
  status: varchar("status", { length: 16 }),
  dueDate: timestamp("due_date", { mode: "date" }),
});


// REFLECTIONS
export const reflections = pgTable("reflections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).nullable(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  griefTier: griefTierEnum("grief_tier").default("1"),
  priority: priorityEnum("priority").default("normal"),
  relatedAreas: text("related_areas").array().default([]),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  status: reflectionStatusEnum("status").default("pending"),
  reviewedBy: text("reviewed_by"),
  restorationPath: jsonb("restoration_path").default({}),
  emotionalState: text("emotional_state"),
  symbolicResonance: text("symbolic_resonance"),
  originDate: date("origin_date"),
});

// INTERACTIONS
export const interactions = pgTable("interactions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id"),
  userId: integer("user_id").references(() => users.id).nullable(),
  action: text("action").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  meta: jsonb("meta").default({}),
  location: text("location"),
});

// CANONICAL BOOKS
export const canonicalBooks = pgTable("canonical_books", {
  id: serial("id").primaryKey(),
  bookNumber: integer("book_number").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  pages: integer("pages").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  colorTheme: text("color_theme").notNull(),
  tags: text("tags").array().default([]),
  symbolicMeaning: text("symbolic_meaning"),
  ritualAnchor: text("ritual_anchor"),
});

// AGENTS
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  status: agentStatusEnum("status").default("active"),
  capabilities: text("capabilities").array().default([]),
  icon: text("icon").notNull(),
  iconColor: text("icon_color").notNull(),
  tags: text("tags").array().default([]),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
  symbolicMeaning: text("symbolic_meaning"),
  ritualAnchor: text("ritual_anchor"),
  linkedBooks: integer("linked_books").array().default([]),
});

// RITUALS
export const rituals = pgTable("rituals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  linkedBook: text("linked_book").nullable(),
  performedBy: text("performed_by").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  category: text("category").default("general"),
  griefTierLinked: griefTierEnum("grief_tier_linked").default(null),
  description: text("description").default(""),
});

// REFLECTION AUDITS
export const reflectionAudits = pgTable("reflection_audits", {
  id: serial("id").primaryKey(),
  reflectionId: integer("reflection_id").references(() => reflections.id).notNull(),
  previousStatus: reflectionStatusEnum("previous_status"),
  newStatus: reflectionStatusEnum("new_status").notNull(),
  updatedBy: text("updated_by").notNull(),
  reason: text("reason"),
  griefTier: griefTierEnum("grief_tier"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// SANDBOX CASES
export const sandboxCases = pgTable("sandbox_cases", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdByUserId: integer("created_by_user_id").references(() => users.id).notNull(false),
  parties: jsonb("parties").notNull(),
  harmDescription: text("harm_description").notNull(),
  griefTier: griefTierEnum("grief_tier").notNull(),
  damageEstimate: integer("damage_estimate").notNull(),
  relatedRights: text("related_rights").array().default([]),
  generatedOutcome: jsonb("generated_outcome").default(null),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true, password: true, role: true, symbolicName: true,
});
export const insertReflectionSchema = createInsertSchema(reflections).omit({
  id: true, timestamp: true, reviewedBy: true, status: true, userId: true,
});
export const insertInteractionSchema = createInsertSchema(interactions).omit({
  id: true, timestamp: true,
});
export const insertRitualSchema = createInsertSchema(rituals).omit({
  id: true, date: true,
});
export const insertReflectionAuditSchema = createInsertSchema(reflectionAudits).omit({
  id: true, timestamp: true,
});
export const insertSandboxCaseSchema = createInsertSchema(sandboxCases).omit({
  id: true, createdAt: true, generatedOutcome: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Reflection = typeof reflections.$inferSelect;
export type InsertReflection = z.infer<typeof insertReflectionSchema>;
export type Interaction = typeof interactions.$inferSelect;
export type InsertInteraction = z.infer<typeof insertInteractionSchema>;
export type CanonicalBook = typeof canonicalBooks.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type Ritual = typeof rituals.$inferSelect;
export type InsertRitual = z.infer<typeof insertRitualSchema>;
export type ReflectionAudit = typeof reflectionAudits.$inferSelect;
export type InsertReflectionAudit = z.infer<typeof insertReflectionAuditSchema>;
export type SandboxCase = typeof sandboxCases.$inferSelect;
export type InsertSandboxCase = z.infer<typeof insertSandboxCaseSchema>;
