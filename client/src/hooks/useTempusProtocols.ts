import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useTempusProtocols() {
  return useQuery({
    queryKey: ["/api/tempus/logs"],
    queryFn: () => apiRequest("GET", "/api/tempus/logs"),
    refetchInterval: 10000, // auto-refresh every 10 seconds
  });
}