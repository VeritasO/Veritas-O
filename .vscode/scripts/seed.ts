// scripts/seed.ts
import { db } from "../server/db";
import {
  agents,
  canonicalBooks,
  reflections,
  rituals,
  contradictions,
  tasks,
} from "../server/schema";

async function main() {
  console.log("🌱 Seeding Veritas.O database...");

  // --- Canonical Books ---
  await db.insert(canonicalBooks).values([
    { bookNumber: 1, title: "Meaningful Thought", subtitle: "Fairness Logic & Memory", description: "Foundational principles of justice across time.", pages: 88, colorTheme: "blue" },
    { bookNumber: 2, title: "Gentle De-escalation", subtitle: "Grief & Dialogue", description: "Conflict resolution through restoration.", pages: 76, colorTheme: "teal" },
    { bookNumber: 3, title: "Gentle Escalation", subtitle: "Boundaries & Protest Logic", description: "Justice via protest, truth exposure, and resistance.", pages: 66, colorTheme: "amber" },
    { bookNumber: 4, title: "Mental Health & Grief Justice", subtitle: "Psychosocial Integrity", description: "Integrating emotional trauma into the justice process.", pages: 91, colorTheme: "rose" },
    { bookNumber: 5, title: "Transformative Restoration", subtitle: "Land & Ecosystem", description: "Nature-first repair logic, land-based healing.", pages: 112, colorTheme: "green" },
    { bookNumber: 6, title: "Sovereignty", subtitle: "Rituals & Self-Governance", description: "Rights, ceremony, and internal jurisdiction.", pages: 72, colorTheme: "purple" },
    { bookNumber: 7, title: "The Agents", subtitle: "Protocols & Prompts", description: "Agent design and interdependence logic.", pages: 97, colorTheme: "gray" },
    { bookNumber: 8, title: "Time Harmonization", subtitle: "TEMPUS & CVT", description: "Coordinated Veritas Time and temporal fairness.", pages: 84, colorTheme: "indigo" },
    { bookNumber: 9, title: "Agentic Intelligence", subtitle: "Multi-Agent Coordination", description: "Orchestration logic across all agents.", pages: 69, colorTheme: "emerald" },
    { bookNumber: 10, title: "Knowledge Architecture", subtitle: "Interoperability", description: "Shared truth systems and data harmonization.", pages: 78, colorTheme: "cyan" },
    { bookNumber: 11, title: "Data Export Formats", subtitle: "Portability & Memory", description: "Formats for justice continuity.", pages: 54, colorTheme: "yellow" },
    { bookNumber: 12, title: "Governance & Versioning", subtitle: "Evolution & Audit", description: "Meta-systems for rule updates and integrity.", pages: 67, colorTheme: "pink" },
    { bookNumber: 13, title: "Security & Compliance", subtitle: "Grief-Safe Boundaries", description: "Protection from exploitation and coercion.", pages: 49, colorTheme: "red" },
    { bookNumber: 14, title: "Collaborative Intelligence", subtitle: "Shared Sovereignty", description: "Federated wisdom, mirrored grief.", pages: 88, colorTheme: "fuchsia" },
    { bookNumber: 15, title: "Future Roadmap", subtitle: "Federated Justice", description: "Planned evolutions and societal interfaces.", pages: 99, colorTheme: "orange" },
  ]);
  console.log("📚 Canonical books seeded.");

  // --- Agents ---
  await db.insert(agents).values([
    { name: "JUNO", role: "Judicial harmony", description: "Doctrine enforcement & reasoning", capabilities: ["verdict", "restore", "audit"], iconColor: "#3b82f6", icon: "⚖️", status: "active" },
    { name: "TEMPUS", role: "Timekeeper", description: "Manages CVT and time logic", capabilities: ["clock", "loop", "reverse"], iconColor: "#6366f1", icon: "⏳", status: "active" },
    { name: "AEGIS", role: "Bias auditor", description: "Fairness and impartiality logic", capabilities: ["scan", "balance", "bias-check"], iconColor: "#10b981", icon: "🛡️", status: "active" },
    { name: "LYRA", role: "Narrative healer", description: "Story-based justice and grief logic", capabilities: ["record", "reflect", "repair"], iconColor: "#ec4899", icon: "🪶", status: "active" },
    { name: "VESTA", role: "Ritual architect", description: "Symbolic justice systems", capabilities: ["ritual", "design", "restore"], iconColor: "#f97316", icon: "🔥", status: "active" },
    { name: "THALEA", role: "Ecosystem restorer", description: "Land-based reconciliation", capabilities: ["ground", "replant", "listen"], iconColor: "#22c55e", icon: "🌿", status: "active" },
    { name: "MIRRA", role: "Contradiction monitor", description: "Loop scanner & inconsistency engine", capabilities: ["flag", "loop-check", "audit"], iconColor: "#a855f7", icon: "🔍", status: "active" },
    { name: "POLYMNIA", role: "Semantic memory", description: "Agent design & system architecture", capabilities: ["map", "define", "evolve"], iconColor: "#0ea5e9", icon: "🧬", status: "active" },
  ]);
  console.log("🧠 Core agents seeded.");

  // --- Ritual Prompts ---
  await db.insert(rituals).values([
    { tier: "low", prompt: "🌾 Take 3 breaths and name what feels gentle in the grief." },
    { tier: "medium", prompt: "🕯️ Write a letter to the harmed party expressing recognition." },
    { tier: "high", prompt: "🌑 Ritual silence: 10 minutes of stillness before writing any response." },
  ]);
  console.log("🔥 Rituals seeded.");

  // --- Contradictions (MIRRA test flags) ---
  await db.insert(contradictions).values([
    { reflectionId: 1, issue: "Status marked complete while griefTier = high", timestamp: new Date() },
    { reflectionId: 2, issue: "Priority = low but content indicates trauma incident", timestamp: new Date() },
  ]);
  console.log("🪞 Contradictions seeded.");

  // --- Reflections (for MIRRA audit testing) ---
  await db.insert(reflections).values([
    {
      type: "grief",
      content: "I'm struggling to reconcile a breach of trust in my community.",
      priority: "high",
      relatedAreas: ["community", "trust"],
      reviewedBy: "JUNO",
      status: "reviewing",
      timestamp: new Date(),
    },
  ]);
  console.log("💬 Reflections seeded.");

  // --- Tasks (Agent duties) ---
  await db.insert(tasks).values([
    { agent: "JUNO", task: "Review doctrinal conflict flagged by MIRRA", priority: "high", context: "Case #4012 / Reflection Loop" },
    { agent: "TEMPUS", task: "Trigger grief loop on timestamp deviation", priority: "medium", context: "Reflection #194 delay > 1h" },
    { agent: "LYRA", task: "Record lived experience on protest outcome", priority: "normal", context: "Narrative reflection for Book III" },
    { agent: "VESTA", task: "Design symbolic rite for communal forgiveness", priority: "high", context: "Tier 4 grief ritual" },
  ]);
  console.log("📌 Tasks seeded.");

  console.log("✅ Veritas.O database seeding complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error during seed:", err);
  process.exit(1);
});

