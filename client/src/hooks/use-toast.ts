import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";

interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "info";
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    setToasts((prev) => [...prev, { title, description, variant }]);
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  return { toast, toasts };
}

export function useContradictions() {
  return useQuery({
    queryKey: ["/api/contradictions"],
    queryFn: () => apiRequest("GET", "/api/contradictions"),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}