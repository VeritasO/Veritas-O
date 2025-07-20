import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Dashboard from './pages/dashboard'
import Agents from './pages/agents'
import Books from './pages/books'
import Doctrine from './pages/doctrine'
import Reflections from './pages/reflections'
import Rituals from './pages/rituals'
import Contradictions from './pages/contradictions'
import Audit from './pages/audit'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/books" element={<Books />} />
          <Route path="/doctrine" element={<Doctrine />} />
          <Route path="/reflections" element={<Reflections />} />
          <Route path="/rituals" element={<Rituals />} />
          <Route path="/contradictions" element={<Contradictions />} />
          <Route path="/audit" element={<Audit />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
