import React, { useState } from "react";
import { useDoctrine } from "@/hooks/useDoctrine";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const DoctrineManagement: React.FC<{ onInteraction?: (action: string, details?: string) => void }> = ({ onInteraction }) => {
  const { doctrines, isLoading, updateDoctrine } = useDoctrine();
  const [editId, setEditId] = useState<number | null>(null);
  const [editPrinciple, setEditPrinciple] = useState("");

  React.useEffect(() => {
    onInteraction?.("view_doctrine");
  }, [onInteraction]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Doctrine of Meaningful Thought</h2>
      <ul className="list-disc pl-6">
        <li>Transparent Reasoning</li>
        <li>Proportional Impact</li>
        <li>Communal Healing</li>
      </ul>
      <p className="text-sm text-gray-500 mt-2">Refer to Canonical Books I-III for details.</p>
      <h2 className="font-bold text-xl mb-4">Doctrine Management</h2>
      {doctrines.map((d) => (
        <Card key={d.id} className="mb-4 p-4">
          <div className="font-semibold">{d.title}</div>
          <div>{d.version} – {d.date}</div>
          {editId === d.id ? (
            <div>
              <textarea
                value={editPrinciple}
                onChange={e => setEditPrinciple(e.target.value)}
                className="w-full border rounded p-2 mt-2"
              />
              <Button
                className="mt-2"
                onClick={() => {
                  updateDoctrine(d.id, editPrinciple);
                  setEditId(null);
                }}
              >
                Save
              </Button>
              <Button className="mt-2 ml-2" onClick={() => setEditId(null)}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <div className="mt-2 text-slate-600">{d.principle}</div>
              <Button className="mt-2" onClick={() => {
                setEditId(d.id);
                setEditPrinciple(d.principle);
              }}>
                Edit
              </Button>
            </>
          )}
        </Card>
      ))}
    </div>
  );
};

export default DoctrineManagement;
