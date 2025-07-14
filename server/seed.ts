import { db } from "./db";
import { agents, canonicalBooks } from "./schema";
import seedData from "./seed.json";

async function seedDatabase() {
  try {
    console.log("🌱 Seeding Canonical Books...");
    await db.insert(canonicalBooks).values(seedData.books);
    console.log("📚 Books seeded.");

    console.log("🌱 Seeding Agents...");
    await db.insert(agents).values(seedData.agents);
    console.log("🧠 Agents seeded.");

    console.log("✅ Seed complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seedDatabase();
