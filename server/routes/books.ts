// Express route scaffold for books
import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  // Fetch books logic here
  res.json([]);
});

export default router;
