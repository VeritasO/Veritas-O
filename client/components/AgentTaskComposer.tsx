import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { useToast } from "../../hooks/useToast";

export default function AgentTaskComposer() {
  const [agent, setAgent] = useState("");
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("normal");
  const [context, setContext] = useState("");
  const { toast } = useToast();

  const { mutate: assignTask, isPending } = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/tasks", {
        agent,
        task,
        priority,
        context,
      }),
    onSuccess: () => {
      toast({
        title: "✅ Task Assigned",
        description: `Sent to ${agent}`,
      });
      setAgent("");
      setTask("");
      setContext("");
      setPriority("normal");
    },
    onError: () => {
      toast({
        title: "❌ Task Failed",
        description: "Could not assign task.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-4">📌 Assign Agent Task</h2>
      <div className="grid gap-4">
        <input
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
          placeholder="Agent name (e.g. JUNO, LYRA)"
          className="input"
        />
        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          rows={3}
          placeholder="Describe the task"
          className="textarea"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="select"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <input
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Context (e.g., grief case, ritual type)"
          className="input"
        />
        <button
          className="btn btn-green mt-2"
          onClick={() => assignTask()}
          disabled={isPending}
        >
          {isPending ? "Assigning..." : "Assign Task"}
        </button>
      </div>
    </div>
  );
}
