import { db } from "./db";
import { agents, canonicalBooks } from "./schema";
import seedData from "./seed.json";

async function seedDatabase() {
  try {
    console.log("🌱 Seeding Canonical Books...");
    await db.insert(canonicalBooks).values(seedData.books);
    console.log("📚 Books seeded.");

    console.log("🌱 Seeding Agents...");
    // Map agent statuses to allowed enum values
    const allowedStatuses = ["symbolic", "active", "dormant", "retired", "under_review"];
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
