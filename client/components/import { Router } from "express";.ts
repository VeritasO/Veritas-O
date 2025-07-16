import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
  res.json({ cvtTime: new Date().toISOString() }); // Replace with real CVT sync logic
});
export default router;