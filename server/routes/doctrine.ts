import { Router } from "express";
import { db } from "../db";
import { doctrineVersions } from "../schema";

const router = Router();

router.get("/", async (req, res) => {
  const result = await db.select().from(doctrineVersions);
  res.json(result);
});

export default router;
