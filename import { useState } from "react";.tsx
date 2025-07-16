import { useState } from "react";
export default function SymbolicWorkflow({ rituals }: { rituals: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div>
      <h3>Symbolic Transformation</h3>
      <ul>
        {rituals.map(r => (
          <li key={r}>
            <button onClick={() => setSelected(r)}>{r}</button>
          </li>
        ))}
      </ul>
      {selected && <div>Transformation initiated for: {selected}</div>}
    </div>
  );
}