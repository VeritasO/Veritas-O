import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ cvtTime: new Date().toISOString() });
});

export default router;