import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

type Doctrine = {
  id: number;
  version: string;
  title: string;
  principle: string;
  date: string;
};

export default function DoctrineHistory() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: doctrines, isLoading } = useQuery({
    queryKey: ["/api/doctrine"],
    queryFn: () => apiRequest("GET", "/api/doctrine"),
  });

  const selectedDoctrine = doctrines?.find((d: Doctrine) => d.id === selectedId);

  if (isLoading) return <p className="text-slate-500">Loading doctrines...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">📜 Doctrine History</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctrines?.map((d: Doctrine) => (
          <Card key={d.id} className="p-4">
            <div className="text-sm text-slate-600">{d.version} – {d.date}</div>
            <div className="text-lg font-semibold">{d.title}</div>
            <Button className="mt-2" onClick={() => setSelectedId(d.id)}>
              View Principle
            </Button>
          </Card>
        ))}
      </div>

      {selectedDoctrine && (
        <div className="bg-slate-100 p-4 rounded-md mt-6">
          <h2 className="text-xl font-bold text-slate-700">
            {selectedDoctrine.title}
          </h2>
          <p className="text-slate-600 whitespace-pre-wrap mt-2">
            {selectedDoctrine.principle}
          </p>
        </div>
      )}
    </div>
  );
}
