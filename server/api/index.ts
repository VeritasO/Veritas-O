import express from "express";
import { db } from "../db";
import {
  insertReflectionSchema,
  insertInteractionSchema,
  insertRitualSchema,
  insertReflectionAuditSchema,
  reflections,
  canonicalBooks,
  agents,
  interactions,
  rituals,
  reflectionAudits,
  sandboxCases,
  griefTierEnum,
  priorityEnum,
  reflectionStatusEnum,
  entityTypeEnum
} from "../schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
// import { mirraScanContradictions } from '../agents/mirra';
// import { generateSandboxVerdict } from '../agents/juno';

const router = express.Router();

// GET /api/books
router.get("/books", async (req, res) => {
  const books = await db.select().from(canonicalBooks);
  res.json(books);
});

// GET /api/agents
router.get("/agents", async (req, res) => {
  const agentsList = await db.select().from(agents);
  res.json(agentsList);
});

// GET /api/analytics
router.get("/analytics", async (req, res) => {
  const activeSessions = 5;
  const reflectionsSubmitted = (await db.select().from(reflections)).length;
  const agentsOnline = (await db.select().from(agents).where(eq(agents.status, "active"))).length;
  res.json({ activeSessions, reflectionsSubmitted, agentsOnline });
});

// GET /api/reflections
router.get("/reflections", async (req, res) => {
  const allReflections = await db.select().from(reflections).orderBy(reflections.timestamp, "desc");
  res.json(allReflections);
});

// POST /api/reflections
router.post("/reflections", async (req, res) => {
  try {
    const validated = insertReflectionSchema.parse(req.body);
    const inserted = await db.insert(reflections).values({
      ...validated,
      userId: req.body.userId || null,
      status: "pending",
      timestamp: new Date(),
    }).returning();
    await db.insert(interactions).values({
      userId: req.body.userId || null,
      action: "submitted_reflection",
      details: `Submitted new reflection of type ${validated.type}`,
      sessionId: req.headers["x-session-id"] as string || "unknown",
      timestamp: new Date(),
    }).returning();
    res.status(201).json(inserted);
  } catch (err) {
    res.status(400).json({ error: err.errors ? err.errors : err.message });
  }
});

// POST /api/reflections/:id/status
router.post("/reflections/:id/status", async (req, res) => {
  const { id } = req.params;
  const { newStatus, changedBy, reason } = req.body;
  try {
    const reflection = await db.select().from(reflections).where(eq(reflections.id, Number(id))).limit(1);
    if (!reflection.length) return res.status(404).json({ error: "Reflection not found" });
    const prevStatus = reflection.status;
    const currentGriefTier = reflection.griefTier;
    await db.transaction(async (trx) => {
      await trx.update(reflections)
        .set({ status: reflectionStatusEnum.enumValues.includes(newStatus) ? newStatus : prevStatus })
        .where(eq(reflections.id, Number(id)));
      await trx.insert(reflectionAudits).values({
        reflectionId: Number(id),
        changedBy,
        previousStatus: prevStatus,
        newStatus,
        reason,
        griefTier: currentGriefTier,
        timestamp: new Date(),
      });
    });
    res.json({ message: "Status updated and logged." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update reflection status." });
  }
});

// GET /api/reflections/:id/audits
router.get("/reflections/:id/audits", async (req, res) => {
  const { id } = req.params;
  try {
    const audits = await db.select().from(reflectionAudits).where(eq(reflectionAudits.reflectionId, Number(id))).orderBy(reflectionAudits.timestamp, "desc");
    res.json(audits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch audit trail." });
  }
});

// POST /api/interactions
router.post("/interactions", async (req, res) => {
  try {
    const validated = insertInteractionSchema.parse(req.body);
    const inserted = await db.insert(interactions).values({ ...validated, timestamp: new Date() }).returning();
    res.status(201).json(inserted);
  } catch (err) {
    res.status(400).json({ error: err.errors ? err.errors : err.message });
  }
});

// POST /api/rituals
router.post("/rituals", async (req, res) => {
  try {
    const validated = insertRitualSchema.parse(req.body);
    const inserted = await db.insert(rituals).values({ ...validated, date: new Date() }).returning();
    res.status(201).json(inserted);
  } catch (err) {
    res.status(400).json({ error: err.errors ? err.errors : err.message });
  }
});

// GET /api/rituals
router.get("/rituals", async (req, res) => {
  const allRituals = await db.select().from(rituals).orderBy(rituals.date, "desc");
  res.json(allRituals);
});

// SANDBOX ROUTES
const sandboxInputSchema = z.object({
  parties: z.array(z.object({
    name: z.string(),
    entityType: z.enum(entityTypeEnum.enumValues),
    role: z.string(),
  })),
  harmDescription: z.string(),
  griefTier: z.enum(griefTierEnum.enumValues),
  damageEstimate: z.number().int().min(0),
  relatedRights: z.array(z.string()).optional(),
  createdByUserId: z.number().nullable().optional(),
});

// POST /api/sandbox
router.post("/sandbox", async (req, res) => {
  try {
    const input = sandboxInputSchema.parse(req.body);
    // const generatedOutcome = generateSandboxVerdict(input);
    const insertedCase = await db.insert(sandboxCases).values({
      ...input,
      generatedOutcome: {},
      createdAt: new Date(),
      status: "processed"
    }).returning();
    res.status(201).json({ case: insertedCase });
  } catch (err) {
    res.status(400).json({ error: err.errors ? err.errors : err.message || "Invalid sandbox input." });
  }
});

// GET /api/sandbox/:id
router.get("/sandbox/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const caseId = Number(id);
    if (isNaN(caseId)) return res.status(400).json({ error: "Invalid case ID." });
    const sandboxCase = await db.select().from(sandboxCases).where(eq(sandboxCases.id, caseId)).limit(1);
    if (sandboxCase.length === 0) return res.status(404).json({ error: "Sandbox case not found." });
    res.json(sandboxCase[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sandbox case." });
  }
});

export default router;
