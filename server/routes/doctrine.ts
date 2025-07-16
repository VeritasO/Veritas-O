import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const doctrinePath = path.resolve(__dirname, "../../veritas.doctrine.json");

// GET /api/doctrine - Serve doctrine file
router.get("/", async (req, res) => {
  try {
    const data = await fs.promises.readFile(doctrinePath, "utf8");
    const doctrine = JSON.parse(data);
    res.json(doctrine);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error("Doctrine file not found:", err);
      res.status(500).json({ error: "Doctrine file not found" });
    } else if (err instanceof SyntaxError) {
      console.error("Malformed doctrine file:", err);
      res.status(500).json({ error: "Malformed doctrine file" });
    } else {
      console.error("Error reading doctrine file:", err);
      res.status(500).json({ error: "Error reading doctrine file" });
    }
  }
});

// POST /api/doctrine - Update doctrine file
router.post("/", async (req, res) => {
  const newDoctrine = req.body;
  if (
    !newDoctrine ||
    typeof newDoctrine !== "object" ||
    Array.isArray(newDoctrine)
  ) {
    return res.status(400).json({ error: "Invalid doctrine format" });
  }
  try {
    await fs.promises.writeFile(doctrinePath, JSON.stringify(newDoctrine, null, 2), "utf8");
    res.status(200).json({ message: "Doctrine updated successfully" });
  } catch (error) {
    console.error("Error writing doctrine file:", error);
    res.status(500).json({ error: "Failed to update doctrine" });
  }
});

export default router;
