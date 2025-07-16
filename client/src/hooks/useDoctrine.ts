import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useDoctrine() {
  const queryClient = useQueryClient();

  const { data: doctrines = [], isLoading } = useQuery({
    queryKey: ["/api/doctrine"],
    queryFn: () => apiRequest("GET", "/api/doctrine"),
  });

  const mutation = useMutation({
    mutationFn: (params: { id: number; principle: string }) =>
      apiRequest("PUT", `/api/doctrine/${params.id}`, { principle: params.principle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/doctrine"] });
    },
  });

  return {
    doctrines,
    isLoading,
    updateDoctrine: mutation.mutate,
  };
}