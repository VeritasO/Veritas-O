import { Router } from "express";
import { db } from "../db";
import { contradictions } from "../schema/models/contradictions";

const router = Router();

// GET all contradictions
router.get("/", async (req, res) => {
  const all = await db.select().from(contradictions).orderBy(contradictions.createdAt.desc());
  res.json(all);
});

// POST a new contradiction
router.post("/", async (req, res) => {
  const { title, description, severity } = req.body;
  if (!title || !description || !severity) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const [entry] = await db.insert(contradictions).values({
    title,
    description,
    severity,
    createdAt: new Date(),
  }).returning();
  res.status(201).json(entry);
});

export default router;
