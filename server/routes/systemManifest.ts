// /server/routes/systemManifest.ts
import { Router } from "express";
import path from "path";
import fs from "fs";

const router = Router();

router.get("/", (req, res) => {
  const manifestPath = path.join(process.cwd(), "veritas.config.json");
  fs.readFile(manifestPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Manifest not found" });
    }
    res.type("application/json").send(data);
  });
});

export default router;
