import { Router } from 'express'

const router = Router()

// Get all agents status
router.get('/', async (req, res) => {
  try {
    // Mock data - replace with actual database query
    const agents = [
      { name: 'JUNO', lastTaskTime: Date.now() - 30000, currentTaskCount: 2 },
      { name: 'AEGIS', lastTaskTime: Date.now() - 45000, currentTaskCount: 1 },
      { name: 'LYRA', lastTaskTime: Date.now() - 60000, currentTaskCount: 0 },
      { name: 'THALEA', lastTaskTime: Date.now() - 120000, currentTaskCount: 3 },
      { name: 'KAIROS', lastTaskTime: Date.now() - 90000, currentTaskCount: 1 },
      { name: 'VESTA', lastTaskTime: Date.now() - 15000, currentTaskCount: 4 },
      { name: 'ORION', lastTaskTime: Date.now() - 200000, currentTaskCount: 0 },
      { name: 'POLYMNIA', lastTaskTime: Date.now() - 75000, currentTaskCount: 2 },
      { name: 'TEMPUS', lastTaskTime: Date.now() - 300000, currentTaskCount: 1 },
      { name: 'MIRRA', lastTaskTime: Date.now() - 180000, currentTaskCount: 0 },
    ]
    
    res.json(agents)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' })
  }
})

// Get specific agent status
router.get('/:agentName', async (req, res) => {
  try {
    const { agentName } = req.params
    
    // Mock single agent data
    const agent = {
      name: agentName,
      lastTaskTime: Date.now() - Math.random() * 300000,
      currentTaskCount: Math.floor(Math.random() * 5),
      griefSignature: Math.random() > 0.8 ? 'grief_pattern_delta' : undefined
    }
    
    res.json(agent)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent' })
  }
})

// Send message to agent
router.post('/:agentName/message', async (req, res) => {
  try {
    const { agentName } = req.params
    const message = req.body
    
    // Mock message sending
    console.log(`Message sent to ${agentName}:`, message)
    
    res.json({ success: true, timestamp: Date.now() })
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' })
  }
})

export default router
