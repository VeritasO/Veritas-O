import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/agents', label: 'Agents' },
    { path: '/books', label: 'Books' },
    { path: '/doctrine', label: 'Doctrine' },
    { path: '/reflections', label: 'Reflections' },
    { path: '/rituals', label: 'Rituals' },
    { path: '/contradictions', label: 'Contradictions' },
    { path: '/audit', label: 'Audit' },
  ]

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <img src="/veritas-logo.svg" alt="Veritas-O" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-blue-400">Veritas-O</h1>
          </div>
          
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
