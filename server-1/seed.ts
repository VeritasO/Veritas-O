import { db } from "./db";
import { agents, canonicalBooks } from "./schema";
const AGENT_STATUSES = ["active", "inactive", "pending"];
import seedData from "./seed.json";

async function seedDatabase() {
  try {
    console.log("🌱 Seeding Canonical Books...");
    await db.insert(canonicalBooks).values(seedData.books);
    console.log("📚 Books seeded.");

    console.log("🌱 Seeding Agents...");
    const allowedStatuses = AGENT_STATUSES;
    const agentsData = seedData.agents.map(agent => ({
      ...agent,
      status: allowedStatuses.includes(agent.status) ? agent.status : "active"
    }));
    await db.insert(agents).values(agentsData);
    console.log("🧠 Agents seeded.");

    console.log("✅ Seed complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seedDatabase();