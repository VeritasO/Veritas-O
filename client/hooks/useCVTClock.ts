import { useEffect, useState } from "react";

export function useCVTClock() {
  const [cvtTime, setCVTTime] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCVT() {
      try {
        const res = await fetch("/api/cvt-time");
        const data = await res.json();
        if (isMounted && data?.cvtTime) {
          setCVTTime(data.cvtTime);
        }
      } catch {
        if (isMounted) setCVTTime("Unavailable");
      }
    }

    fetchCVT();
    const interval = setInterval(fetchCVT, 10000); // refresh every 10s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return cvtTime;
}