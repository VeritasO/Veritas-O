// Express route scaffold for agents
import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  // Fetch agents logic here
  res.json([]);
});

export default router;
