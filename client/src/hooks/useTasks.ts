// /client/src/hooks/useTasks.ts
import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  updatedAt?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest("GET", "/api/tasks");
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskInput: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const created = await apiRequest("POST", "/api/tasks", taskInput);
      setTasks((prev) => [...prev, created]);
      return created;
    } catch (err: any) {
      setError(err.message || "Failed to create task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Optional: update a task
  const updateTask = useCallback(async (id: number, updates: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await apiRequest("PUT", `/api/tasks/${id}`, updates);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Optional: delete a task
  const deleteTask = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest("DELETE", `/api/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
