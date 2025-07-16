import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAgentTasks() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["/api/tasks"],
    queryFn: () => apiRequest("GET", "/api/tasks"),
  });

  const addTask = useMutation({
    mutationFn: (task: { agentId: string; description: string; status: string; urgency: string }) =>
      apiRequest("POST", "/api/tasks", task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  return {
    tasks,
    isLoading,
    addTask: addTask.mutate,
  };
}