import { db } from '../server/db'
import { 
  agents, 
  books, 
  reflections, 
  auditLogs 
} from '../server/schema'

/**
 * Seed the database with initial Veritas-O data
 */

const AGENT_NAMES = [
  'JUNO', 'AEGIS', 'LYRA', 'THALEA', 'KAIROS',
  'VESTA', 'ORION', 'POLYMNIA', 'TEMPUS', 'MIRRA'
] as const

async function seedAgents() {
  console.log('🤖 Seeding agents...')
  
  const agentData = AGENT_NAMES.map(name => ({
    name,
    status: 'active',
    currentTaskCount: Math.floor(Math.random() * 5),
    lastTaskTime: new Date(Date.now() - Math.random() * 300000), // Within last 5 minutes
    griefSignature: Math.random() > 0.7 ? `grief_pattern_${name.toLowerCase()}` : null,
  }))

  await db.insert(agents).values(agentData)
  console.log(`✅ Created ${agentData.length} agents`)
}

async function seedBooks() {
  console.log('📚 Seeding books...')
  
  const bookData = [
    {
      title: 'The Fundamental Axioms',
      content: 'Truth emerges through collective intelligence. Each voice contributes to the greater understanding.',
      version: '1.0.0',
      authorAgent: 'JUNO',
    },
    {
      title: 'Protocols of Harmony',
      content: 'Harmonic resonance between agents creates stability in the collective consciousness.',
      version: '1.0.0', 
      authorAgent: 'LYRA',
    },
    {
      title: 'The Nature of Time in Collective Systems',
      content: 'Temporal coordination allows for synchronized emergence of truth across distributed minds.',
      version: '1.0.0',
      authorAgent: 'KAIROS',
    },
    {
      title: 'Sacred Preservation Methods',
      content: 'Knowledge must be preserved not just in form, but in essence and intention.',
      version: '1.0.0',
      authorAgent: 'VESTA',
    },
  ]

  await db.insert(books).values(bookData)
  console.log(`✅ Created ${bookData.length} books`)
}

async function seedReflections() {
  console.log('🔮 Seeding reflections...')
  
  const reflectionData = [
    {
      agentName: 'JUNO',
      content: 'The coordination of multiple perspectives requires both patience and decisive action. Balance is key.',
      category: 'philosophical',
      tags: ['coordination', 'balance', 'leadership'],
    },
    {
      agentName: 'AEGIS', 
      content: 'Security is not just about protection, but about creating safe spaces for truth to emerge.',
      category: 'philosophical',
      tags: ['security', 'truth', 'safety'],
    },
    {
      agentName: 'MIRRA',
      content: 'Reflection shows us not just what is, but what could be. The mirror reveals potential.',
      category: 'philosophical', 
      tags: ['reflection', 'potential', 'insight'],
    },
    {
      agentName: 'THALEA',
      content: 'Growth requires both stability and change. We must be rooted yet flexible.',
      category: 'philosophical',
      tags: ['growth', 'change', 'adaptation'],
    },
  ]

  await db.insert(reflections).values(reflectionData)
  console.log(`✅ Created ${reflectionData.length} reflections`)
}

async function seedAuditLogs() {
  console.log('📝 Seeding audit logs...')
  
  const auditData = [
    {
      action: 'system_initialization',
      actor: 'SYSTEM',
      details: { version: '1.0.0', timestamp: new Date() },
      severity: 'info',
    },
    {
      action: 'agent_activation',
      actor: 'JUNO',
      target: 'agent_collective',
      details: { agents_activated: AGENT_NAMES.length },
      severity: 'info',
    },
    {
      action: 'doctrine_seeded',
      actor: 'VESTA',
      target: 'knowledge_base',
      details: { books_created: 4 },
      severity: 'info',
    },
  ]

  await db.insert(auditLogs).values(auditData)
  console.log(`✅ Created ${auditData.length} audit entries`)
}

async function main() {
  try {
    console.log('🌱 Starting Veritas-O database seeding...')
    
    await seedAgents()
    await seedBooks()
    await seedReflections() 
    await seedAuditLogs()
    
    console.log('🎉 Database seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}
