import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'

// Load environment variables
config()

import agentsRouter from './routes/agents'
import booksRouter from './routes/books'
import doctrineRouter from './routes/doctrine'
import tasksRouter from './routes/tasks'
import ritualsRouter from './routes/rituals'
import contradictionsRouter from './routes/contradictions'
import reflectionsRouter from './routes/reflections'
import auditRouter from './routes/audit'
import tracesRouter from './routes/traces'
import collaborationRouter from './routes/collaboration'

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/agents', agentsRouter)
app.use('/api/books', booksRouter)
app.use('/api/doctrine', doctrineRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/rituals', ritualsRouter)
app.use('/api/contradictions', contradictionsRouter)
app.use('/api/reflections', reflectionsRouter)
app.use('/api/audit', auditRouter)
app.use('/api/traces', tracesRouter)
app.use('/api/collaboration', collaborationRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

export default app
