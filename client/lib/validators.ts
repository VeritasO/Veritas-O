import { z } from "zod";

export const BookSchema = z.object({
  bookNumber: z.number().int().positive(),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().min(1),
  pages: z.number().int().positive(),
  colorTheme: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const AgentSchema = z.object({
  agentId: z.string().min(1),
  status: z.enum(["active", "inactive", "pending"]),
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const ReflectionSchema = z.object({
  agentId: z.string().min(1),
  content: z.string().min(1),
  griefTier: z.number().optional(),
  createdAt: z.string().datetime(),
});
export type Reflection = z.infer<typeof ReflectionSchema>;