import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useSymbolicSuggestions() {
  return useQuery({
    queryKey: ["/api/rituals"],
    queryFn: () => apiRequest("GET", "/api/rituals"),
    staleTime: 120_000,
  });
}