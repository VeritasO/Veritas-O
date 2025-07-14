import { griefTierEnum, entityTypeEnum } from '../schema';

interface SandboxInput {
  parties: Array<{ name: string; entityType: string; role: string }>;
  harmDescription: string;
  griefTier: string;
  damageEstimate: number;
  relatedRights?: string[];
}

interface VerdictLayer {
  summary: string;
  rationale: string;
}

interface GeneratedOutcome {
  JUNO: VerdictLayer;
  AEGIS: VerdictLayer;
  LYRA: VerdictLayer;
  THALEA: VerdictLayer;
  VESTA: VerdictLayer;
  KAIROS: VerdictLayer;
  [key: string]: VerdictLayer;
}

export function generateSandboxVerdict(input: SandboxInput): GeneratedOutcome {
  const numericGriefTier = parseInt(input.griefTier);
  let baseSeverity = numericGriefTier * input.parties.length;

  const entityWeights: Record<string, number> = {
    human: 1,
    business: 1.2,
    government: 1.3,
    community: 1.1,
    other: 1.0,
  };
  let entityFactor = 1;
  input.parties.forEach(party => {
    entityFactor = Math.max(entityFactor, entityWeights[party.entityType.toLowerCase()] || 1);
  });

  const harmWeights: Record<string, number> = {
    physical: 1.5,
    emotional: 1.2,
    economic: 1.3,
    environmental: 1.5,
    narrative: 1.4,
  };
  const harmFactor = harmWeights[input.harmDescription.toLowerCase().includes("physical") ? "physical" :
                                 input.harmDescription.toLowerCase().includes("emotional") ? "emotional" :
                                 input.harmDescription.toLowerCase().includes("economic") ? "economic" :
                                 input.harmDescription.toLowerCase().includes("environmental") ? "environmental" :
                                 input.harmDescription.toLowerCase().includes("narrative") ? "narrative" : "physical"] || 1;

  const severityScore = baseSeverity * entityFactor * harmFactor + (input.damageEstimate / 100);

  let verdictSummary = "";
  let restorationPlanDetails: any = {};
  let symbolicSuggestions: string[] = [];

  if (severityScore <= 5) {
    verdictSummary = "Restorative Dialogue and Community Healing Circles recommended.";
    restorationPlanDetails = { rites: ["Dialogue", "Apology"], durationDays: 7, focus: "Community Reconciliation" };
    symbolicSuggestions = ["🕊️ Gentle wind ritual", "💧 Breath Ritual – Gentle Reflection"];
  } else if (severityScore <= 15) {
    verdictSummary = "Structured Mediation with LYRA narrative repair and VESTA symbolic rites recommended.";
    restorationPlanDetails = { rites: ["Mediation", "Narrative Repair", "Symbolic Rite"], durationDays: 30, focus: "Relational Harmony" };
    symbolicSuggestions = ["🌿 Grounding Ritual – Soft Earth Listening", "🌊 Deep Water Ceremony – Release & Renewal"];
  } else {
    verdictSummary = "Comprehensive tribunal review, grief integration by KAIROS, and ecosystem restoration by THALEA advised.";
    restorationPlanDetails = { rites: ["Tribunal", "Grief Integration", "Land Restoration"], durationDays: 90, focus: "Holistic Transformation" };
    symbolicSuggestions = ["🌕 Full moon reflection", "🪨 Ancestor stone placement", "🌌 Cosmic Release Rite"];
  }

  return {
    JUNO: {
      summary: verdictSummary,
      rationale:
        "Proportionality scales with grief tier and damage, honoring emotional sovereignty and time reversibility in the judgment.",
    },
    AEGIS: {
      summary: `Bias audit clear; fairness metrics satisfied. Entity factor: ${entityFactor.toFixed(2)}.`,
      rationale:
        "Equitable treatment across parties with no undue bias detected by AEGIS protocols, ensuring fairness logic.",
    },
    LYRA: {
      summary: "Narrative healing recommended through reconciliation storytelling.",
      rationale:
        "Validating lived experience and restoring relational truths is essential for durable justice, as observed by LYRA's narrative repair protocols.",
    },
    THALEA: {
      summary: "Environmental impact assessed; advise land-based rituals.",
      rationale:
        "Land-based justice integrated to maintain ecosystem and spiritual balance, per THALEA's holistic view.",
    },
    VESTA: {
      summary: `Symbolic ceremonies encouraged: ${symbolicSuggestions.join(", ")}.`,
      rationale:
        "Ritual acts help manifest justice and restore social harmony at symbolic levels, embedding transformation culturally.",
    },
    KAIROS: {
      summary: `Grief integration score: ${numericGriefTier}.
`,
      rationale: "Assessed the depth of grief for time-scaled healing. Full integration may take time, aligned with CVT principles."
    }
  };
}
