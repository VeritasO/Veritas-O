# Veritas-O Agent Management System

A comprehensive full-stack application for managing and monitoring Veritas Agents - an advanced multi-agent system for knowledge management, doctrinal analysis, and philosophical exploration.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Express + TypeScript + Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **State Management**: TanStack Query (React Query)
- **Styling**: TailwindCSS with dark theme

## 🤖 Agent System

The system manages 10 specialized agents:
- **JUNO** - Central coordinator
- **AEGIS** - Security and validation
- **LYRA** - Harmonic analysis
- **THALEA** - Growth and adaptation
- **KAIROS** - Temporal coordination
- **VESTA** - Sacred preservation
- **ORION** - Navigation and guidance
- **POLYMNIA** - Knowledge synthesis  
- **TEMPUS** - Time-based operations
- **MIRRA** - Reflection and insight

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- pnpm/npm/yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd veritas-o
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up the database:**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

This starts both the client (port 3000) and server (port 5000).

## 📁 Project Structure

```
veritas-o/
├── client/                  # React frontend
│   ├── components/         # UI components & AgentCollaborationPanel
│   ├── pages/             # Page components (renamed from routes)
│   ├── lib/               # agents.ts, symbols.ts, constants.ts, validators.ts, types.ts, utils.ts
│   ├── hooks/             # useCollaboration.ts & other custom React hooks
│   └── styles/            # TailwindCSS
├── server/                 # Express backend  
│   ├── routes/            # API endpoints + collaboration.ts
│   ├── schema/            # Drizzle schema with 10+ tables
│   ├── events/            # agent-socket.ts for WebSocket communication
│   └── db.ts              # Database connection
├── drizzle/               # Database migrations & seed.ts
├── public/                # veritas-logo.svg & manifest.json
└── tests/                 # Test suites
```

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build for production
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run test` - Run test suites
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

- `GET /api/agents` - List all agents and their status
- `GET /api/agents/:name` - Get specific agent details
- `POST /api/agents/:name/message` - Send message to agent
- `GET /api/books` - Manage sacred texts
- `GET /api/doctrine` - Doctrine version control
- `GET /api/reflections` - Agent reflections
- `GET /api/rituals` - Coordination rituals
- `GET /api/contradictions` - Logical contradictions
- `GET /api/tasks` - Agent task management
- `GET /api/tribunal/rulings` - Get tribunal rulings
- `POST /api/tribunal/rulings` - Submit new tribunal ruling
- `POST /api/tribunal/rulings/:id/apply` - Apply a tribunal ruling
- `GET /api/tribunal/stats` - Tribunal system statistics
- `GET /api/collaboration/messages` - Agent collaboration feed
- `POST /api/collaboration/messages` - Send collaboration message  
- `GET /api/collaboration/stats` - Collaboration statistics

## 🎨 Features

### Current Implementation
- ✅ Agent status monitoring
- ✅ Real-time dashboard
- ✅ Inter-agent messaging
- ✅ Agent Collaboration Panel with live feed
- ✅ Dual Tribunal System (simulation & direct ruling interfaces)
- ✅ Contradiction detection & tracking with resolution
- ✅ Agent task management & dispatch
- ✅ Philosophical reflection system
- ✅ Sacred symbols & UI theming
- ✅ WebSocket support for live updates
- ✅ Dark-themed UI
- ✅ Responsive design

### Planned Features
- 🔄 Complete database integration
- 🔄 Advanced tribunal workflow automation
- 🔄 Doctrine version tracking with git-like versioning
- 🔄 Ritual coordination ceremonies
- 🔄 Comprehensive audit logging
- 🔄 Advanced analytics dashboard
- 🔄 Multi-tenant agent collective management

## 🔮 Philosophy

Veritas-O represents a system for exploring truth through collective intelligence. Each agent embodies different aspects of knowledge seeking, working together to maintain doctrinal consistency while allowing for growth and adaptation.

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines and submit pull requests for any improvements.

---

*"Through many voices, one truth emerges."* - Veritas-O Collective
