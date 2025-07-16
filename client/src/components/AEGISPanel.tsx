import React from "react";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { useAgentTasks } from "@/hooks/useAgentTasks";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AEGISPanel() {
  const { logs, isLoading: logsLoading } = useAuditLogs();
  const { tasks, isLoading: tasksLoading, addTask } = useAgentTasks();

  return (
    <div>
      <h2 className="font-bold text-xl mb-4">AEGIS Admin Panel</h2>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Audit Logs</h3>
        {logsLoading ? <p>Loading logs...</p> : (
          <div className="space-y-2">
            {logs.map(log => (
              <Card key={log.id} className="p-2">
                <div>{log.timestamp}: {log.message}</div>
                <div className="text-xs text-slate-500">{log.agentId}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Agent Tasks</h3>
        {tasksLoading ? <p>Loading tasks...</p> : (
          <div className="space-y-2">
            {tasks.map(task => (
              <Card key={task.id} className="p-2">
                <div>{task.description}</div>
                <div className="text-xs text-slate-500">{task.status} | {task.urgency}</div>
                <Button className="mt-2" onClick={() => addTask({ ...task, status: "overridden" })}>
                  Override Task
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}