import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function SeedView() {
  const { data: books } = useQuery({ queryKey: ["/api/books"] });
  const { data: agents } = useQuery({ queryKey: ["/api/agents"] });

  useEffect(() => {
    document.title = "Seed Data Viewer | Veritas.O";
  }, []);

  const bookList = Array.isArray(books) ? books : [];
  const agentList = Array.isArray(agents) ? agents : [];
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-slate-800">📚 Canonical Books</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {bookList.map((book: any) => (
            <li key={book.id} className="bg-white rounded-lg shadow-md p-4 border-l-4" style={{ borderColor: book.colorTheme }}>
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-sm text-slate-500">{book.subtitle}</p>
              <p className="mt-2 text-slate-700">{book.description}</p>
              <span className="block mt-1 text-xs text-slate-400">Pages: {book.pages}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-800">🧠 System Agents</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {agentList.map((agent: any) => (
            <li key={agent.id} className="bg-white rounded-lg shadow-md p-4 border-l-4" style={{ borderColor: agent.iconColor }}>
              <h3 className="font-semibold text-lg">{agent.icon} {agent.name}</h3>
              <p className="text-sm text-slate-500">{agent.role}</p>
              <p className="mt-2 text-slate-700">{agent.description}</p>
              <span className="text-xs text-slate-400 block mt-1">Capabilities: {agent.capabilities?.join(", ")}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
