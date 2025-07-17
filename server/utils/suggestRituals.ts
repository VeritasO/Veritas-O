import { canonicalBooks } from "../schema/models/canonicalBooks";

function suggestRituals({ symbolic_class, driftScore, griefStage }) {
  let baseRituals = ritualDatabase.getByClass(symbolic_class);

  if (driftScore >= 0.3) {
    baseRituals = baseRituals.map(r => ({
      ...r,
      intensity: r.intensity + 1,
      note: 'Adjusted for semantic drift',
    }));
  }

  if (griefStage === 'deep') {
    baseRituals.push({
      name: 'Grief Integration Ceremony',
      description: 'A ritual to process deep communal grief alongside restoration.',
      intensity: 3,
    });
  }

  return baseRituals;
}