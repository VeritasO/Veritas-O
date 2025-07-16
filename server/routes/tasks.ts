import { Router } from "express";
import { db } from "../db";
import { tasks } from "../schema/models/tasks";

const router = Router();

router.get("/", async (req, res) => {
  const all = await db.select().from(tasks).orderBy(tasks.createdAt.desc());
  res.json(all);
});

router.post("/", async (req, res) => {
  const { agentId, description, status, urgency } = req.body;
  if (!agentId || !description || !status || !urgency) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const [entry] = await db.insert(tasks).values({
    agentId,
    description,
    status,
    urgency,
    createdAt: new Date(),
  }).returning();
  res.status(201).json(entry);
});

export default router;