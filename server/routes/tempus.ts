import express from "express";
import { checkLastDriftRecalculation, runDriftRecalculation } from "../services/tempusMonitor";
const router = express.Router();

router.get("/drift-status", async (req, res) => {
  const status = await checkLastDriftRecalculation();
  res.json(status);
});

router.post("/trigger-drift", async (req, res) => {
  // Call your drift recalculation logic here
  await runDriftRecalculation();
  res.json({ ok: true });
});

export default router;