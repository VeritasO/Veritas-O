import { Router } from "express";
import { db } from "../db";
import { tasks } from "../schema";

const router = Router();

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