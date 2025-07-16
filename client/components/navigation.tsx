import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <div className="font-bold text-lg">Veritas.O</div>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/books" className="hover:underline">Books</Link>
        <Link to="/agents" className="hover:underline">Agents</Link>
        <Link to="/doctrine" className="hover:underline">Doctrine</Link> {/* ✅ Added */}
      </div>
        </nav>
      );
    }