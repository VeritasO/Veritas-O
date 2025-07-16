import { Router } from "express";
import { db } from "../db";
import { tasks } from "../schema";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { agent, task, priority, context } = req.body;
    const result = await db.insert(tasks).values({
      agent,
      task,
      priority,
      context,
      status: "assigned",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h default
    });
    res.status(200).json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ error: "Failed to assign task" });
  }
});

export default router;


// GET all tasks
router.get("/", async (req, res) => {
  const result = await db.select().from(tasks);
  res.json(result);
});

// POST a new task
router.post("/", async (req, res) => {
  const { agent, task, griefTier } = req.body;
  const inserted = await db.insert(tasks).values({ agent, task, griefTier });
  res.json({ success: true, inserted });
});

export default router;