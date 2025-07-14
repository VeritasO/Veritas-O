import { Router } from "express";
import { db } from "../db";
import { reflections, auditTrail, contradictions } from "../schema";

const router = Router();

// GET contradiction logs (admin/system only)
router.get("/logs", async (_req, res) => {
  const logs = await db.select().from(contradictions);
  res.json(logs);
});

// POST: scan for contradictions in a reflection
router.post("/scan", async (req, res) => {
  const { reflectionId } = req.body;
  // Example: scan audit trail for status/time inconsistencies
  const trail = await db.select().from(auditTrail).where({ reflectionId });
  // Simple logic: flag if status reverses without grief transition
  let contradiction = null;
  for (let i = 1; i < trail.length; i++) {
    if (trail[i].status === 'closed' && trail[i-1].status === 'pending') {
      contradiction = {
        reflectionId,
        issue: 'Closed after pending without grief transition',
        timestamp: trail[i].cvtTimestamp
      };
      break;
    }
  }
  if (contradiction) {
    await db.insert(contradictions).values(contradiction);
    res.status(200).json({ flagged: true, contradiction });
  } else {
    res.status(200).json({ flagged: false });
  }
});

export default router;
