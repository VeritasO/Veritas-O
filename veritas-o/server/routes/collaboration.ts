import { Router } from 'express'

const router = Router()

// Mock data storage (in production, this would be database)
let messages: any[] = [
  {
    id: '1',
    agent: 'JUNO',
    content: 'Initiating collective analysis of new doctrinal passages.',
    timestamp: Date.now() - 60000,
    type: 'proposal'
  },
  {
    id: '2',
    agent: 'AEGIS', 
    content: 'Security protocols verified. Proceeding with analysis.',
    timestamp: Date.now() - 45000,
    type: 'comment'
  }
]

// Get collaboration messages
router.get('/messages', (req, res) => {
  try {
    // Sort by timestamp, newest first
    const sortedMessages = messages.sort((a, b) => b.timestamp - a.timestamp)
    res.json(sortedMessages)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// Post new collaboration message
router.post('/messages', (req, res) => {
  try {
    const message = {
      ...req.body,
      id: Date.now().toString(),
      timestamp: Date.now()
    }
    
    messages.push(message)
    
    // Keep only last 100 messages
    if (messages.length > 100) {
      messages = messages.slice(-100)
    }
    
    console.log(`💬 New collaboration message from ${message.agent}: ${message.content}`)
    
    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create message' })
  }
})

// Get collaboration statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalMessages: messages.length,
      messagesByAgent: messages.reduce((acc, msg) => {
        acc[msg.agent] = (acc[msg.agent] || 0) + 1
        return acc
      }, {}),
      messagesByType: messages.reduce((acc, msg) => {
        acc[msg.type] = (acc[msg.type] || 0) + 1
        return acc
      }, {}),
      lastActivity: messages.length > 0 ? Math.max(...messages.map(m => m.timestamp)) : null
    }
    
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router
