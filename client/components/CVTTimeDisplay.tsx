import { useEffect, useState } from "react";

export default function CVTTimeDisplay() {
  const [cvtTime, setCVTTime] = useState<string>("");

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const url = import.meta.env.CVT_SYNC_URL || "/api/cvt-time";
        const res = await fetch(url);
        const { cvtTime } = await res.json();
        setCVTTime(cvtTime);
      } catch {
        setCVTTime("Unavailable");
      }
    };
    fetchTime();
    const interval = setInterval(fetchTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-blue-700 font-mono text-sm">
      CVT Time: {cvtTime}
    </div>
  );
}