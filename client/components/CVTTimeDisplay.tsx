import { useEffect, useState } from "react";

function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function CVTTimeDisplay() {
  const [cvtTime, setCVTTime] = useState<string>("");
  const [lastSync, setLastSync] = useState<number>(Date.now());
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchTime = async () => {
      try {
        setError(false);
        const url = import.meta.env.CVT_SYNC_URL || "/api/cvt-time";
        const res = await fetch(url);
        const { cvtTime } = await res.json();
        if (mounted) {
          setCVTTime(cvtTime);
          setLastSync(Date.now());
        }
      } catch {
        setError(true);
      }
    };
    fetchTime();
    const interval = setInterval(fetchTime, 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Consider stale if last sync > 5 seconds ago
  const isStale = Date.now() - lastSync > 5000 || error;
  const badgeColor = error ? "bg-red-600" : isStale ? "bg-yellow-500" : "bg-green-600";

  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold">Coordinated Veritas Time:</span>
      <span className={`px-3 py-1 rounded text-white font-mono ${badgeColor}`}>
        {cvtTime ? formatTime(cvtTime) : "Unavailable"}
      </span>
      {isStale && (
        <span className="text-xs text-red-600 ml-2">Not Synced</span>
      )}
    </div>
  );
}