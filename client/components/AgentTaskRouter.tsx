import { useState } from "react";

export default function AgentTaskRouter() {
  const [agent, setAgent] = useState("");
  const [task, setTask] = useState("");

  const assignTask = async () => {
    if (!agent || !task) return alert("Agent and task required");
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent, task }),
      });
      alert(`🧠 Assigned to ${agent}: ${task}`);
      setAgent("");
      setTask("");
    } catch (err) {
      alert("Failed to assign task");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-2">
      <h3 className="font-semibold text-lg">🛠️ Assign Agent Tasks</h3>
      <input
        placeholder="Agent (e.g. JUNO)"
        value={agent}
        onChange={(e) => setAgent(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <textarea
        placeholder="Describe the task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="border p-2 rounded w-full"
        rows={3}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={assignTask}
      >
        Assign Task
      </button>
    </div>
  );
}