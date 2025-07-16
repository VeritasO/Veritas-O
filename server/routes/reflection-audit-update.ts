import { Router } from "express";
import { db } from "../db";
import { reflections } from "../schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  const { id, status } = req.body;
  try {
    const updated = await db.update(reflections)
      .set({ status })
      .where(eq(reflections.id, Number(id)))
      .returning();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;
