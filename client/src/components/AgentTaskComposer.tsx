import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function AgentTaskComposer() {
  const [agent, setAgent] = useState("");
  const [task, setTask] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      await apiRequest("POST", "/api/tasks", {
        agent,
        task,
      });
      setStatus("done");
      setAgent("");
      setTask("");
    } catch (error) {
      console.error("Failed to assign task:", error);
      setStatus("idle");
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-4 rounded shadow-sm max-w-xl mx-auto">
      <h3 className="text-lg font-bold mb-2">Assign Task to Agent</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Agent name (e.g., LYRA)"
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
          required
        />
        <textarea
          placeholder="Task description"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Assigning..." : "Assign Task"}
        </button>
        {status === "done" && (
          <p className="text-green-700 text-xs">Task successfully assigned.</p>
        )}
      </form>
    </div>
  );
}