import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useReflections() {
  return useQuery({
    queryKey: ["reflections"],
    queryFn: () => apiRequest("/api/reflections", "GET"),
  });
}

export function useSubmitReflection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; author?: string; griefWeight?: number }) =>
      apiRequest("/api/reflections", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["reflections"]);
    },
  });
}