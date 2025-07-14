import { db } from "../db";
import { reflections } from '../schema';
import { eq } from 'drizzle-orm';

// MIRRA scans reflection content for narrative contradictions
export async function mirraScanContradictions() {
  const allReflections = await db.select().from(reflections);
  let contradictions = [];

  // Simple heuristic: check pairs of reflections for contradictory keywords
  for (let i = 0; i < allReflections.length; i++) {
    for (let j = i + 1; j < allReflections.length; j++) {
      if (isContradictory(allReflections[i].content, allReflections[j].content)) {
        contradictions.push({
          pair: [allReflections[i].id, allReflections[j].id],
          message: "Narrative contradiction detected between two reflections",
          details: {
            reflection1_content: allReflections[i].content,
            reflection2_content: allReflections[j].content,
          }
        });
      }
    }
  }

  // Check if a 'reconciled' reflection still contains 'unresolved' keywords
  for (const ref of allReflections) {
    if (ref.status === 'reconciled' && ref.content.toLowerCase().includes('unresolved')) {
      contradictions.push({
        pair: [ref.id],
        message: `MIRRA Notice: Reconciled reflection ID ${ref.id} contains 'unresolved' keywords, potential status-content mismatch.`,
        details: { status: ref.status, content: ref.content }
      });
    }
  }

  return contradictions;
}

function isContradictory(textA: string, textB: string): boolean {
  return (
    (textA.toLowerCase().includes("not guilty") && textB.toLowerCase().includes("guilty")) ||
    (textA.toLowerCase().includes("no harm") && textB.toLowerCase().includes("harm")) ||
    (textA.toLowerCase().includes("innocent") && textB.toLowerCase().includes("culpable"))
  );
}
