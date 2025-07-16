import { Router } from "express";
import db from "../db";
import { auditTrail } from "../schema";

const router = Router();

// GET full audit trail for a reflection
router.get("/:reflectionId", async (req, res) => {
  const { reflectionId } = req.params;
  const result = await db.select().from(auditTrail).where({ reflectionId });
  res.json(result);
});

// POST new audit entry
router.post("/", async (req, res) => {
  const { reflectionId, status, changedBy, reason, griefTier, cvtTimestamp } = req.body;
  const result = await db.insert(auditTrail).values({
    reflectionId,
    status,
    changedBy,
    reason,
    griefTier,
    cvtTimestamp,
  }).returning();
  res.status(201).json(result);
});

export default router;
