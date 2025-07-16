// Express route scaffold for books
import { Router } from "express";
import { db } from "../db";
import { canonicalBooks } from "../schema/models/canonicalBooks";

const router = Router();

router.get("/", async (req, res) => {
  const all = await db
    .select()
    .from(canonicalBooks)
    .orderBy(canonicalBooks.bookNumber.asc());
  res.json(all);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, description, pages, colorTheme } = req.body;
  const [updated] = await db
    .update(canonicalBooks)
    .set({ title, subtitle, description, pages, colorTheme })
    .where(canonicalBooks.bookNumber.eq(Number(id)))
    .returning();
  res.json(updated);
});

export default router;
