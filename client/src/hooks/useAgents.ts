import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
// import { Agent } from "@shared/schema";

export function useAgents() {
  return useQuery<any[]>({
    queryKey: ["/api/agents"],
    queryFn: () => apiRequest("GET", "/api/agents"),
    refetchInterval: 30000,
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, Partial<any> & { id: number }>({
    mutationFn: (agentUpdate) =>
      apiRequest("PUT", `/api/agents/${agentUpdate.id}`, agentUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
    },
    onError: (error: any) => {
      alert("⚠️ Agent update failed: " + error.message);
    },
  });
}
