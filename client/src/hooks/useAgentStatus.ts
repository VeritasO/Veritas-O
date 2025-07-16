import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAgentStatus(agentId: string) {
  return useQuery({
    queryKey: ["/api/agents/status", agentId],
    queryFn: () => apiRequest("GET", `/api/agents/${agentId}/status`),
    refetchInterval: 5000, // Poll every 5 seconds for real-time sync
  });
}