import { Router } from "express";
import { db } from "../db";
import { reflections } from "../schema";
import { eq } from "drizzle-orm";

export const reflectionAuditRouter = Router();

// GET all reflection audit logs (ordered by time)
reflectionAuditRouter.get("/reflection-audit", async (req, res) => {
  try {
    const auditLogs = await db.select().from(reflections).orderBy(reflections.timestamp);
    res.json(auditLogs);
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET audit log by reflection ID
reflectionAuditRouter.get("/reflection-audit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await db.select().from(reflections).where(eq(reflections.id, Number(id)));
    if (!entry || entry.length === 0) {
      return res.status(404).json({ error: "Reflection not found" });
    }
    res.json(entry[0]);
  } catch (err) {
    console.error("Error fetching reflection entry:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH update reflection status (with optional reviewer note)
reflectionAuditRouter.patch("/reflection-audit/:id", async (req, res) => {
  const { id } = req.params;
  const { status, reviewedBy } = req.body;
  try {
    const updated = await db.update(reflections)
      .set({ status, reviewedBy })
      .where(eq(reflections.id, Number(id)))
      .returning();

    res.json(updated);
  } catch (err) {
    console.error("Error updating reflection status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
