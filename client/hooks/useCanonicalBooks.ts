import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCanonicalBooks = () => {
  return useQuery({
    queryKey: ["canonicalBooks"],
    queryFn: async () => {
      const { data } = await axios.get("/api/books");
      return data;
    },
  });
};