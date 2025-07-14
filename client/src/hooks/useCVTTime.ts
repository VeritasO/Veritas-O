// Get live CVT time
import { useEffect, useState } from "react";

export function useCVTTime() {
  const [cvtTime, setCVTTime] = useState<string>("");
  useEffect(() => {
    const update = () => {
      setCVTTime(new Date().toISOString());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);
  return cvtTime;
}
