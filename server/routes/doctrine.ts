import { Router } from "express";

const router = Router();

const doctrines = [
  {
    id: 1,
    version: "I",
    title: "Book I: Foundations of Meaning",
    principle: "Meaningful Thought is the prime directive...",
    date: "2025-01-01",
  },
  {
    id: 2,
    version: "II",
    title: "Book II: Emotional Sovereignty",
    principle: "Affirms the sanctity of internal experience...",
    date: "2025-01-02",
  },
  // ...add up to Book XV as needed
];

router.get("/", (req, res) => {
  res.json(doctrines);
});

export default router;
