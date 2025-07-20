import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Books API - Coming soon' })
})

export default router
