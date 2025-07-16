import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useContradictions() {
  return useQuery({
    queryKey: ["/api/contradictions"],
    queryFn: () => apiRequest("GET", "/api/contradictions"),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}