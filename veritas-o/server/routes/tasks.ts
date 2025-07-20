import { Router } from 'express'
const router = Router()
router.get('/', (req, res) => res.json({ message: 'Tasks API - Coming soon' }))
export default router
