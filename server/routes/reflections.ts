// server/routes/reflections.ts

import express, { Request, Response } from "express";
import { db } from "../db";
import { reflections } from "../schema/models/reflections";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import logInteraction from "../routes/audit";
import { evaluateGriefLoop } from "../utils/griefPatterns";
import { detectContradiction } from "../utils/contradictionTriggers";
import { getCVT } from "../utils/cvtTime"; // Implement this utility to fetch CVT time

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
  agentId: z.string().optional(),
});

// GET: By ID or filter by status, type, reviewedBy, etc.
reflectionsRouter.get("/", async (req: Request, res: Response) => {
  const { id, status, type, reviewedBy, priority } = req.query;
  try {
    const filters: any[] = [];
    if (id) filters.push(eq(reflections.id, Number(id)));
    if (status) filters.push(eq(reflections.status, String(status)));
    if (type) filters.push(eq(reflections.type, String(type)));
    if (reviewedBy) filters.push(eq(reflections.reviewedBy, String(reviewedBy)));
    if (priority) filters.push(eq(reflections.priority, String(priority)));

    let results;
    if (filters.length) {
      results = await db.select().from(reflections).where(and(...filters));
    } else {
      results = await db.select().from(reflections);
    }
    res.status(200).json(results);
  } catch (err) {
    console.error("[JUNO][Reflection][GET]", err);
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
    agentId = "JUNO",
    timestamp,
  } = parse.data;

  try {
    const grief = evaluateGriefLoop(content);
    const contradiction = detectContradiction(content);

    // Use CVT time for timestamp
    const cvtTimestamp = timestamp || getCVT();

    const [result] = await db
      .insert(reflections)
      .values({
        content,
        priority,
        relatedAreas,
        status,
        reviewedBy,
        agentId,
        timestamp: cvtTimestamp,
        grief,
        contradiction
      })
      .returning();

    // Context-rich audit log
    await logInteraction({
      action: "reflection_submitted",
      reflectionId: result.id,
      user: reviewedBy,
      agentId,
      timestamp: result.timestamp,
      meta: { type, priority, status, relatedAreas, grief, contradiction }
    });

    // Optionally trigger ritual or log contradiction
    if (grief) {
      // trigger ritual logic here
      console.log("[VESTA][Ritual Trigger]", { id: result.id, grief });
    }
    if (contradiction) {
      // log contradiction logic here
      console.log("[MIRRA][Contradiction Flag]", { id: result.id, contradiction });
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("[JUNO][Reflection][POST]", err);
    res.status(500).json({ error: "Failed to submit reflection." });
  }
});

export default reflectionsRouter;
