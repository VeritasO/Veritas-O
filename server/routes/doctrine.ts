import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const doctrinePath = path.resolve(__dirname, "../../veritas.doctrine.json");

// GET /api/doctrine - Serve doctrine file
router.get("/", (req, res) => {
  fs.readFile(doctrinePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading doctrine file:", err);
      return res.status(500).json({ error: "Doctrine file not found" });
    }
    try {
      const doctrine = JSON.parse(data);
      res.json(doctrine);
    } catch (e) {
      console.error("Malformed doctrine file:", e);
      res.status(500).json({ error: "Malformed doctrine file" });
    }
  });
});

// POST /api/doctrine - Replace doctrine file
router.post("/", (req, res) => {
  const newDoctrine = req.body;
  if (!newDoctrine || typeof newDoctrine !== "object") {
    return res.status(400).json({ error: "Invalid doctrine format" });
  }
  try {
    fs.writeFileSync(doctrinePath, JSON.stringify(newDoctrine, null, 2), "utf8");
    res.status(200).json({ message: "Doctrine updated successfully" });
  } catch (error) {
    console.error("Error writing doctrine file:", error);
    res.status(500).json({ error: "Failed to update doctrine" });
  }
});

export default router;
