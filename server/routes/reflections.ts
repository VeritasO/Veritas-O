import express, { Request, Response } from "express";
import { db } from "../db";
import { reflections } from "../schema/models/reflections";
import { z } from "zod";

export const reflectionsRouter = express.Router();

// Schema validation using zod
const reflectionSchema = z.object({
  content: z.string().min(5, "Reflection must be at least 5 characters"),
  griefTier: z.union([z.string(), z.number()]), // Accepts string or number for flexibility
  submittedBy: z.string().optional(), // Optional for anonymous reflections
  cvtTimestamp: z.string().optional(), // If not provided, system will generate it
});

// GET: fetch all reflections (optionally filter by griefTier)
reflectionsRouter.get("/", async (req: Request, res: Response) => {
  const { griefTier } = req.query;

  try {
    const query = griefTier
      ? db.select().from(reflections).where(reflections.griefTier.eq(griefTier))
      : db.select().from(reflections);

    const results = await query;
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching reflections:", err);
    res.status(500).json({ error: "Failed to fetch reflections." });
  }
});

// POST: submit a new reflection
reflectionsRouter.post("/", async (req: Request, res: Response) => {
  const parse = reflectionSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() });
  }

  const { content, griefTier, submittedBy, cvtTimestamp } = parse.data;

  try {
    const [result] = await db
      .insert(reflections)
      .values({
        content,
        griefTier,
        submittedBy,
        cvtTimestamp: cvtTimestamp || new Date().toISOString(),
      })
      .returning();

    res.status(201).json(result);
  } catch (err) {
    console.error("Error submitting reflection:", err);
    res.status(500).json({ error: "Failed to submit reflection." });
  }
});

export default reflectionsRouter;
