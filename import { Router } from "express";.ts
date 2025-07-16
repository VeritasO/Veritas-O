import { Router } from "express";
import { reflectionAudits } from "../schema";
const router = Router();
router.get("/audit-logs/:format", async (req, res) => {
  const logs = await db.select().from(reflectionAudits);
  if (req.params.format === "csv") {
    // Convert logs to CSV
    const csv = logs.map(l => Object.values(l).join(",")).join("\n");
    res.type("text/csv").send(csv);
  } else {
    res.json(logs);
  }
});
export default router;