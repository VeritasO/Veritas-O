import { useEffect, useState } from "react";

export default function TEMPUSClock() {
  const [cvtTime, setCvtTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const cvt = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} / ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      setCvtTime(cvt);
    };
    const interval = setInterval(update, 1000);
    update();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm text-slate-500 mt-2">
      <span className="font-mono">🕰️ CVT: {cvtTime}</span>
    </div>
  );
}
