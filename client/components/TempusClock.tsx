import { useEffect, useState } from "react";

export default function TempusClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toUTCString());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-blue-600 font-mono text-sm mt-2">
      TEMPUS CVT: {time}
    </div>
  );
}