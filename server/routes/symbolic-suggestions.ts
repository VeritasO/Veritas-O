import { Router } from "express";
import { vestaLexicon } from "../schema";

const router = Router();

// GET ritual suggestions by grief tier
router.get("/:griefTier", async (req, res) => {
  const { griefTier } = req.params;
  // Example: fetch suggestions from VESTA lexicon
  const suggestions = await vestaLexicon[griefTier] || [];
  res.json(suggestions);
});

// POST new ritual suggestion (community submitted)
router.post("/", async (req, res) => {
  const { griefTier, symbol, description } = req.body;
  // Example: add to lexicon
  vestaLexicon[griefTier] = vestaLexicon[griefTier] || [];
  vestaLexicon[griefTier].push({ symbol, description });
  res.status(201).json({ success: true });
});

export default router;
