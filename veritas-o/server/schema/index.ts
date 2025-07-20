import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  timestamp, 
  integer, 
  boolean, 
  decimal,
  jsonb 
} from 'drizzle-orm/pg-core'

// Agents table
export const agents = pgTable('agents', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  lastTaskTime: timestamp('last_task_time').defaultNow(),
  currentTaskCount: integer('current_task_count').default(0),
  griefSignature: varchar('grief_signature', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Agent tasks table
export const agentTasks = pgTable('agent_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  agentName: varchar('agent_name', { length: 50 }).notNull(),
  input: jsonb('input').notNull(),
  priority: integer('priority').default(0),
  griefTier: decimal('grief_tier', { precision: 3, scale: 2 }),
  originatingAgent: varchar('originating_agent', { length: 50 }),
  status: varchar('status', { length: 20 }).default('pending'),
  result: jsonb('result'),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
})

// Inter-agent messages table
export const interAgentMessages = pgTable('inter_agent_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  fromAgent: varchar('from_agent', { length: 50 }).notNull(),
  toAgent: varchar('to_agent', { length: 50 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  payload: jsonb('payload').notNull(),
  processed: boolean('processed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// Books table
export const books = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  version: varchar('version', { length: 50 }).notNull(),
  authorAgent: varchar('author_agent', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Doctrine versions table  
export const doctrineVersions = pgTable('doctrine_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  version: varchar('version', { length: 100 }).notNull(),
  content: text('content').notNull(),
  changes: jsonb('changes').notNull(),
  contradictions: jsonb('contradictions'),
  approvedBy: jsonb('approved_by'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Rituals table
export const rituals = pgTable('rituals', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  phase: varchar('phase', { length: 20 }).notNull(),
  participants: jsonb('participants').notNull(),
  purpose: text('purpose').notNull(),
  result: text('result'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Reflections table
export const reflections = pgTable('reflections', {
  id: uuid('id').defaultRandom().primaryKey(),
  agentName: varchar('agent_name', { length: 50 }).notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 20 }).notNull(),
  tags: jsonb('tags'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Contradictions table
export const contradictions = pgTable('contradictions', {
  id: uuid('id').defaultRandom().primaryKey(),
  statement1: text('statement1').notNull(),
  statement2: text('statement2').notNull(),
  detectedBy: varchar('detected_by', { length: 50 }).notNull(),
  severity: varchar('severity', { length: 20 }).notNull(),
  resolved: boolean('resolved').default(false),
  status: varchar('status', { length: 20 }).default('OPEN'),
  resolution: text('resolution'),
  createdAt: timestamp('created_at').defaultNow(),
  resolvedAt: timestamp('resolved_at'),
})

// Audit logs table
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  action: varchar('action', { length: 100 }).notNull(),
  actor: varchar('actor', { length: 50 }).notNull(),
  target: varchar('target', { length: 100 }),
  details: jsonb('details'),
  severity: varchar('severity', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Grief signatures table
export const griefSignatures = pgTable('grief_signatures', {
  id: uuid('id').defaultRandom().primaryKey(),
  agentName: varchar('agent_name', { length: 50 }).notNull(),
  signature: varchar('signature', { length: 100 }).notNull(),
  intensity: decimal('intensity', { precision: 3, scale: 2 }).notNull(),
  context: text('context'),
  resolved: boolean('resolved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  resolvedAt: timestamp('resolved_at'),
})

// Tribunal rulings table
export const tribunalRulings = pgTable('tribunal_rulings', {
  id: uuid('id').defaultRandom().primaryKey(),
  contradictionId: uuid('contradiction_id').notNull(),
  rulingText: text('ruling_text').notNull(),
  ruledBy: varchar('ruled_by', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).default('submitted'),
  timestamp: timestamp('timestamp').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
})
