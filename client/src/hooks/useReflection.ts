import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useReflection() {
  const queryClient = useQueryClient();

  const { data: reflections = [], isLoading } = useQuery({
    queryKey: ["/api/reflections"],
    queryFn: () => apiRequest("GET", "/api/reflections"),
  });

  const addReflection = useMutation({
    mutationFn: (reflection: { agentId: string; content: string }) =>
      apiRequest("POST", "/api/reflections", reflection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reflections"] });
    },
  });

  return {
    reflections,
    isLoading,
    addReflection: addReflection.mutate,
  };
}