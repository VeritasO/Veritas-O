// Schema index scaffold
import { pgTable, serial, varchar, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

export const reflections = pgTable('reflections', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 32 }),
  content: text('content'),
  priority: varchar('priority', { length: 16 }),
  relatedAreas: jsonb('related_areas'),
  status: varchar('status', { length: 16 }),
  reviewedBy: varchar('reviewed_by', { length: 64 }),
  timestamp: timestamp('timestamp', { mode: 'date' }),
});

export const agents = pgTable('agents', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 32 }),
  role: varchar('role', { length: 64 }),
  description: text('description'),
  capabilities: jsonb('capabilities'),
  status: varchar('status', { length: 16 }),
  icon: varchar('icon', { length: 8 }),
  iconColor: varchar('icon_color', { length: 16 }),
});

export const canonicalBooks = pgTable('canonical_books', {
  id: serial('id').primaryKey(),
  bookNumber: integer('book_number'),
  title: varchar('title', { length: 128 }),
  subtitle: varchar('subtitle', { length: 128 }),
  description: text('description'),
  pages: integer('pages'),
  colorTheme: varchar('color_theme', { length: 16 }),
});

export const auditTrail = pgTable('audit_trail', {
  id: serial('id').primaryKey(),
  reflectionId: integer('reflection_id'),
  previousStatus: varchar('previous_status', { length: 16 }),
  newStatus: varchar('new_status', { length: 16 }),
  updatedBy: varchar('updated_by', { length: 64 }),
  reason: text('reason'),
  griefTier: varchar('grief_tier', { length: 16 }),
  cvtTimestamp: timestamp('cvt_timestamp', { mode: 'date' }),
});

export const contradictions = pgTable('contradictions', {
  id: serial('id').primaryKey(),
  reflectionId: integer('reflection_id'),
  issue: text('issue'),
  timestamp: timestamp('timestamp', { mode: 'date' }),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  agent: varchar('agent', { length: 32 }),
  description: text('description'),
  status: varchar('status', { length: 16 }),
  dueDate: timestamp('due_date', { mode: 'date' }),
});

export const rituals = pgTable('rituals', {
  id: serial('id').primaryKey(),
  tier: varchar('tier', { length: 16 }),
  prompt: text('prompt'),
});

export const interactions = pgTable('interactions', {
  id: serial('id').primaryKey(),
  agentId: integer('agent_id'),
  content: text('content'),
  timestamp: timestamp('timestamp', { mode: 'date' }),
});

export const reflectionAudits = pgTable('reflection_audits', {
  id: serial('id').primaryKey(),
  reflectionId: integer('reflection_id').notNull(),
  previousStatus: varchar('previous_status', { length: 16 }),
  newStatus: varchar('new_status', { length: 16 }).notNull(),
  updatedBy: varchar('updated_by', { length: 64 }).notNull(),
  reason: text('reason'),
  griefTier: varchar('grief_tier', { length: 16 }),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});



export const interactions = pgTable('interactions', {
  id: serial('id').primaryKey(),
  agentId: integer('agent_id').notNull(),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

export const reflectionStatusEnum = pgTable('reflection_status_enum', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 16 }).notNull(),
});

export const griefTierEnum = pgTable('grief_tier_enum', {
  id: serial('id').primaryKey(),
  tier: varchar('tier', { length: 16 }).notNull(),
});

export const agentStatusEnum = pgTable('agent_status_enum', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 16 }).notNull(),
});

export const insertInteractionSchema = pgTable('insert_interaction_schema', {
  agentId: integer('agent_id').notNull(),
  content: text('content').notNull(),
});

export const insertRitualSchema = pgTable('insert_ritual_schema', {
  name: varchar('name', { length: 64 }).notNull(),
  linkedBook: varchar('linked_book', { length: 64 }).nullable(),
  performedBy: varchar('performed_by', { length: 64 }).notNull(),
  date: timestamp('date').notNull().defaultNow(),
  category: varchar('category', { length: 32 }).default('general'),
  griefTierLinked: griefTierEnum('grief_tier_linked').nullable(),
  description: text('description').nullable(),
});

export const ritualsByTier = {
  low: [
    { tier: "low", prompt: "🌾 Take 3 breaths and name what feels gentle in the grief." },
  ],
  medium: [
    { tier: "medium", prompt: "🕯️ Write a letter to the harmed party expressing recognition." },
  ],
  high: [
    { tier: "high", prompt: "🌑 Ritual silence: 10 minutes of stillness before writing any response." },
  ],
};




