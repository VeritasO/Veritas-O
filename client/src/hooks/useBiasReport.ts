import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useBiasReport(agentId: string) {
  return useQuery({
    queryKey: ["/api/audit/bias", agentId],
    queryFn: () => apiRequest("GET", `/api/audit/bias?agentId=${agentId}`),
  });
}