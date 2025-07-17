import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useDriftStatus() {
  return useQuery(["drift-status"], async () => {
    const res = await axios.get("/api/tempus/drift-status");
    return res.data;
  }, { refetchInterval: 60000 }); // poll every minute
}