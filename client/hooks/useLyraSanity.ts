import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useLyraSanity() {
  return useQuery(["lyra-sanity"], async () => {
    const res = await axios.get("/api/books/sanity");
    return res.data; // { driftAvailable: true, countMissing: 0 }
  });
}