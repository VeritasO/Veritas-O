import { useEffect, useState } from "react";
export default function FairnessReport() {
  const [report, setReport] = useState<any>(null);
  useEffect(() => {
    fetch("/api/bias-audit").then(res => res.json()).then(setReport);
  }, []);
  if (!report) return <p>Loading fairness report...</p>;
  return <div>Fairness Score: {report.fairnessScore} | Flagged Cases: {report.flaggedCases.join(", ")}</div>;
}