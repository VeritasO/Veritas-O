import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
// import { Reflection, InsertReflection } from "@shared/schema";

export function useReflections() {
  return useQuery<any[]>({
    queryKey: ["/api/reflections"],
    queryFn: () => apiRequest("GET", "/api/reflections"),
    refetchInterval: 60000,
  });
}

export function useSubmitReflection() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: (newReflection) =>
      apiRequest("POST", "/api/reflections", newReflection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reflections"] });
    },
    onError: (error: any) => {
      alert("🌀 Reflection submission failed: " + error.message);
    },
  });
}

export function useUpdateReflectionStatus() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: number, newStatus: string, changedBy: string, reason?: string }>({
    mutationFn: ({ id, newStatus, changedBy, reason }) =>
      apiRequest("POST", `/api/reflections/${id}/status`, { newStatus, changedBy, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reflections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reflections/:id/audits"] });
    },
    onError: (error: any) => {
      alert("⚠️ Reflection status update failed: " + error.message);
    },
  });
}

export function useReflectionAudits(reflectionId: number) {
  return useQuery({
    queryKey: [`/api/reflections/${reflectionId}/audits`],
    queryFn: () => apiRequest("GET", `/api/reflections/${reflectionId}/audits`),
    enabled: !!reflectionId,
  });
}
