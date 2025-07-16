import { z } from "zod";

export const agentStatusEnum = z.enum(["active", "inactive", "pending"]);

export const canonicalBooks = {
  // Define the schema for the canonicalBooks table
  id: z.number().int().positive(),
  title: z.string(),
  author: z.string(),
  publishedYear: z.number().int().min(0),
};

export const agents = {
  // Define the schema for the agents table
  id: z.number().int().positive(),
  name: z.string(),
  status: agentStatusEnum,
};