// server/routes/reflections.ts

import express, { Request, Response } from "express";
import { db } from "../db";
import { reflections } from "../schema/models/reflections";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { logInteraction } from "../routes/audit"; // Ensure this exists
import { evaluateGriefLoop } from "../utils/griefPatterns";
import { detectContradiction } from "../utils/contradictionTriggers";

export const reflectionsRouter = express.Router();

// Zod validation schema
const reflectionSchema = z.object({
  type: z.string().min(2),
  content: z.string().min(5, "Reflection must be at least 5 characters"),
  priority: z.enum(["low", "normal", "high"]).optional(),
  relatedAreas: z.array(z.string()).optional(),
  status: z.string().optional(),
  reviewedBy: z.string().optional(),
  timestamp: z.string().optional(),
});

// GET: By ID or filter by status, type, reviewedBy, etc.
reflectionsRouter.get("/", async (req: Request, res: Response) => {
  const { id, status, type, reviewedBy, priority } = req.query;
  try {
    let query = db.select().from(reflections);

    const filters = [];
    if (id) filters.push(eq(reflections.id, Number(id)));
    if (status) filters.push(eq(reflections.status, String(status)));
    if (type) filters.push(eq(reflections.type, String(type)));
    if (reviewedBy) filters.push(eq(reflections.reviewedBy, String(reviewedBy)));
    if (priority) filters.push(eq(reflections.priority, String(priority)));

    if (filters.length) {
      query = query.where(and(...filters));
    }

    const results = await query;
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching reflections:", err);
    res.status(500).json({ error: "Failed to fetch reflections." });
  }
});

// POST: Submit a new reflection, log audit, trigger MIRRA loop (future)
reflectionsRouter.post("/", async (req: Request, res: Response) => {
  const parse = reflectionSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() });
  }

  const {
    type,
    content,
    priority = "normal",
    relatedAreas = [],
    status = "pending",
    reviewedBy = "JUNO",
    timestamp,
  } = parse.data;

  try {
    const grief = evaluateGriefLoop(content);
    const contradiction = detectContradiction(content);

    const [result] = await db
      .insert(reflections)
      .values({
        type,
        content,
        priority,
        relatedAreas,
        status,
        reviewedBy,
        timestamp: timestamp || new Date().toISOString(),
        grief,
        contradiction
      })
      .returning();

    // Log submission as a system action
    await logInteraction({
      action: "reflection_submitted",
      reflectionId: result.id,
      user: reviewedBy,
      timestamp: result.timestamp,
      meta: { type, priority, status, relatedAreas }
    });

    // TODO: Trigger MIRRA loop audit if content contradicts priority
    // Example placeholder:
    // if (priority === "low" && content.includes("urgent")) {
    //   triggerMirraAudit(result.id, content, priority);
    // }

    // Optionally trigger ritual or log contradiction
    if (grief) {
      // trigger ritual logic here
    }
    if (contradiction) {
      // log contradiction logic here
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error submitting reflection:", err);
    res.status(500).json({ error: "Failed to submit reflection." });
  }
});

export default reflectionsRouter;
