import { useState } from "react";

interface SymbolicWorkflowProps {
  rituals: string[];
}

export default function SymbolicWorkflow({ rituals }: SymbolicWorkflowProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (!Array.isArray(rituals) || rituals.length === 0) {
    return (
      <div>
        <h3 className="font-semibold mb-2">Symbolic Transformation</h3>
        <p className="text-gray-500">No rituals available.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Symbolic Transformation</h3>
      <ul className="space-y-2">
        {rituals.map((r) => (
          <li key={r}>
            <button
              className={`px-3 py-1 rounded ${
                selected === r ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setSelected(r)}
            >
              {r}
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <div className="mt-4 p-2 bg-green-100 rounded">
          Transformation initiated for: <span className="font-bold">{selected}</span>
        </div>
      )}
    </div>
  );
}