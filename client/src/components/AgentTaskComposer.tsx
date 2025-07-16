import React, { useState } from "react";
import { useAgentTasks } from "@/hooks/useAgentTasks";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const STATUS_OPTIONS = ["pending", "in-progress", "completed"];
const URGENCY_OPTIONS = ["low", "medium", "high"];

export default function AgentTaskComposer() {
  const [agentId, setAgentId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [urgency, setUrgency] = useState(URGENCY_OPTIONS[0]);
  const { addTask, isLoading } = useAgentTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentId && description) {
      addTask({ agentId, description, status, urgency });
      setDescription("");
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Agent ID"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        >
          {URGENCY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <Button
          type="submit"
          disabled={isLoading || !agentId || !description}
        >
          Assign Task
        </Button>
      </form>
    </Card>
  );
}