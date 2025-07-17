import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useReflections = () => {
  return useQuery({
    queryKey: ['reflections'],
    queryFn: async () => (await axios.get('/api/reflections')).data,
    retry: 2, // Retry twice on error
  });
};

export const useCreateReflection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newReflection) =>
      axios.post('/api/reflections', newReflection),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reflections'] }),
    onError: (error) => {
      console.error("[JUNO][Reflection][Submit][Error]", error);
      // Optionally show a toast/modal here
    },
  });
};