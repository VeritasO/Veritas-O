import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

export type Doctrine = {
  id: number;
  version: string;
  title: string;
  principle: string;
  date: string;
  cvtTime?: string; // for CVT comparison
};

export function useDoctrineHistory() {
  return useQuery<Doctrine[]>({
    queryKey: ["/api/doctrine"],
    queryFn: () => apiRequest("GET", "/api/doctrine"),
  });
}