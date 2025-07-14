import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
// import { CanonicalBook } from "@shared/schema";

export function useBooks() {
  return useQuery<any[]>({
    queryKey: ["/api/books"],
    queryFn: () => apiRequest("GET", "/api/books"),
    refetchInterval: 360000,
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, Partial<any> & { id: number }>({
    mutationFn: (bookUpdate) =>
      apiRequest("PUT", `/api/books/${bookUpdate.id}`, bookUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
    },
    onError: (error: any) => {
      alert("📚 Book update failed: " + error.message);
    },
  });
}
