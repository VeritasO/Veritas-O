import { z } from 'zod'
import { VALIDATION_LIMITS, ERROR_CODES } from './constants'

/**
 * Validation schemas for Veritas-O system
 */

// Agent-related schemas
export const AgentNameSchema = z.enum([
  'JUNO', 'AEGIS', 'LYRA', 'THALEA', 'KAIROS', 
  'VESTA', 'ORION', 'POLYMNIA', 'TEMPUS', 'MIRRA'
])

export const AgentTaskSchema = z.object({
  id: z.string().uuid(),
  agent: AgentNameSchema,
  input: z.record(z.any()),
  timestamp: z.number(),
  priority: z.number().min(0).max(10).optional(),
  griefTier: z.number().min(0).max(1).optional(),
  originatingAgent: AgentNameSchema.optional(),
})

export const InterAgentMessageSchema = z.object({
  from: AgentNameSchema,
  to: z.union([AgentNameSchema, z.literal('ALL')]),
  type: z.enum(['LOG', 'REQUEST', 'ALERT', 'RITUAL', 'SYNC']),
  payload: z.any(),
  timestamp: z.number(),
})

// Book and doctrine schemas
export const BookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(VALIDATION_LIMITS.BOOK_TITLE_MAX_LENGTH),
  content: z.string(),
  version: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  authorAgent: AgentNameSchema.optional(),
})

export const DoctrineVersionSchema = z.object({
  id: z.string().uuid(),
  version: z.string().max(VALIDATION_LIMITS.DOCTRINE_VERSION_MAX_LENGTH),
  content: z.string(),
  changes: z.array(z.string()),
  contradictions: z.array(z.string()).optional(),
  createdAt: z.date(),
  approvedBy: z.array(AgentNameSchema).optional(),
})

// Ritual schemas
export const RitualSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  phase: z.enum(['preparation', 'invocation', 'working', 'manifestation', 'banishing']),
  participants: z.array(AgentNameSchema),
  startTime: z.date(),
  endTime: z.date().optional(),
  purpose: z.string(),
  result: z.string().optional(),
})

// Reflection schemas
export const ReflectionSchema = z.object({
  id: z.string().uuid(),
  agent: AgentNameSchema,
  content: z.string().max(VALIDATION_LIMITS.REFLECTION_MAX_LENGTH),
  category: z.enum(['philosophical', 'technical', 'doctrinal', 'personal']),
  createdAt: z.date(),
  tags: z.array(z.string()).optional(),
})

// Audit log schemas
export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  action: z.string(),
  actor: z.union([AgentNameSchema, z.string()]),
  target: z.string().optional(),
  details: z.record(z.any()).optional(),
  timestamp: z.date(),
  severity: z.enum(['info', 'warning', 'error', 'critical']),
})

// Contradiction schemas
export const ContradictionSchema = z.object({
  id: z.string().uuid(),
  statement1: z.string(),
  statement2: z.string(),
  detectedBy: AgentNameSchema,
  severity: z.enum(['minor', 'moderate', 'major', 'critical']),
  resolved: z.boolean().default(false),
  resolution: z.string().optional(),
  createdAt: z.date(),
  resolvedAt: z.date().optional(),
})

// API request/response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.date(),
})

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Validation helper functions
export const validateAgentName = (name: string) => {
  try {
    return AgentNameSchema.parse(name)
  } catch {
    throw new Error(ERROR_CODES.AGENT_NOT_FOUND)
  }
}

export const validateMessage = (message: any) => {
  try {
    return InterAgentMessageSchema.parse(message)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid message format: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

export const validateGriefThreshold = (grief: number) => {
  if (grief < 0 || grief > 1) {
    throw new Error('Grief tier must be between 0 and 1')
  }
  return grief
}

// Type exports
export type AgentName = z.infer<typeof AgentNameSchema>
export type AgentTask = z.infer<typeof AgentTaskSchema>
export type InterAgentMessage = z.infer<typeof InterAgentMessageSchema>
export type Book = z.infer<typeof BookSchema>
export type DoctrineVersion = z.infer<typeof DoctrineVersionSchema>
export type Ritual = z.infer<typeof RitualSchema>
export type Reflection = z.infer<typeof ReflectionSchema>
export type AuditLog = z.infer<typeof AuditLogSchema>
export type Contradiction = z.infer<typeof ContradictionSchema>
export type ApiResponse = z.infer<typeof ApiResponseSchema>
export type PaginationParams = z.infer<typeof PaginationSchema>
