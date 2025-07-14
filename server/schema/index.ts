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
