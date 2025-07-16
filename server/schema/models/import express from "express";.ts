import express from "express";
import { db } from "@/server/db";
import { reflections } from "@/server/schema";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const all = await db.select().from(reflections);
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reflections." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { content, author, griefWeight } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required." });

    const inserted = await db
      .insert(reflections)
      .values({
        content,
        author: author || "anonymous",
        griefWeight: griefWeight || 1,
        createdAt: new Date().toISOString(),
      })
      .returning();

    res.status(201).json(inserted[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit reflection." });
  }
});

export default router;