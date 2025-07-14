import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
// import { InsertInteraction } from "@shared/schema";

export function useLogInteraction() {
  return useMutation<any, Error, any>({
    mutationFn: (interaction) => apiRequest("POST", "/api/interactions", interaction),
    onError: (error: any) => {
      console.warn("Interaction log failed:", error.message);
    },
  });
}
