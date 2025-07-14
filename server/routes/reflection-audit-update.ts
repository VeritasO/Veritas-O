import { Router } from "express";
import { db } from "../db";
import { reflections } from "../schema";
import { eq } from "drizzle-orm";

export const reflectionAudit = Router();
// GET: Fetch audit logs for a specific reflection
reflectionAudit.get('/:reflectionId', async (req, res) => {
  const { reflectionId } = req.params;
  try {
    const audit = await db.select().from(reflections).where(eq(reflections.id, Number(reflectionId)));
    res.json(audit);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

// POST: Update status
reflectionAudit.post("/update", async (req, res) => {
  const { id, status } = req.body;
  try {
    await db.update(reflections)
      .set({ status })
      .where(eq(reflections.id, Number(id)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Status update failed" });
  }
});
