import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
// import { Ritual, InsertRitual } from "@shared/schema";

export function useRituals() {
  return useQuery<any[]>({
    queryKey: ["/api/rituals"],
    queryFn: () => apiRequest("GET", "/api/rituals"),
    refetchInterval: 60000,
  });
}

export function useLogRitual() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: (newRitual) =>
      apiRequest("POST", "/api/rituals", newRitual),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rituals"] });
    },
    onError: (error: any) => {
      alert("🔮 Ritual logging failed: " + error.message);
    },
  });
}
