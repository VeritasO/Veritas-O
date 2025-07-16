// /server/routes/systemManifest.ts
import { Router } from "express";
import path from "path";
import fs from "fs/promises";
import { db } from "../db";
import { agents, auditTrail } from "../schema";

const router = Router();

router.get("/", async (req, res) => {
  const manifestPath = path.resolve(__dirname, "../../veritas.config.json");
  try {
    const data = await fs.readFile(manifestPath, "utf8");
    const parsed = JSON.parse(data);

    // Fetch agent statuses and recent audit logs from DB
    const agentStatuses = await db.select().from(agents);
    const recentAudits = await db
      .select()
      .from(auditTrail)
      .orderBy("cvtTimestamp desc")
      .limit(5);

    res.json({ ...parsed, agentStatuses, recentAudits });
  } catch (err) {
    console.error("Manifest route error:", err);
    res.status(500).json({ error: "Manifest not found or malformed" });
  }
});

export default router;
