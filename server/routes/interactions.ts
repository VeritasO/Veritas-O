// server/routes/interactions.ts
import { Router } from "express";
import db from "../db"; // assumed export of drizzle db instance
import { interactions } from "../schema"; // assumed drizzle schema
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const interactionSchema = z.object({
  agent: z.string(),
  user: z.string(),
  type: z.enum(["message", "ritual", "narrative", "system"]),
  content: z.string(),
  timestamp: z.string().optional(), // ISO 8601, fallback to server time
});

// POST /api/interactions — Log a new interaction
router.post("/", async (req, res) => {
  const parse = interactionSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const data = parse.data;

  try {
    const result = await db.insert(interactions).values({
      ...data,
      timestamp: data.timestamp || new Date().toISOString(),
    });
    res.status(201).json({ success: true, inserted: result });
  } catch (err) {
    console.error("[INTERACTION_ERROR]", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/interactions — Fetch all or filtered interactions
router.get("/", async (req, res) => {
  try {
    const all = await db.select().from(interactions);
    res.json(all);
  } catch (err) {
    console.error("[INTERACTION_FETCH_ERROR]", err);
    res.status(500).json({ error: "Could not retrieve interactions." });
  }
});

export default router;
