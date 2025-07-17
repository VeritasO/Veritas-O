import { booksModelExists } from "../utils/booksModelExists";
import { useLyraSanity } from "../utils/useLyraSanity";
import { checkNightlyRecalculation } from "../utils/tempusHarmony";
import { db } from "../db";

async function runHealthChecks() {
  let allHealthy = true;

  // POLYMNIA: Model existence
  if (!booksModelExists()) {
    console.error("POLYMNIA: Books model missing!");
    allHealthy = false;
  }

  // LYRA: Drift score accessibility
  const lyraOk = await useLyraSanity(db);
  if (!lyraOk) {
    console.error("LYRA: Drift score not accessible in canonicalBooks!");
    allHealthy = false;
  }

  // TEMPUS: Nightly recalculation
  const tempusOk = await checkNightlyRecalculation();
  if (!tempusOk) {
    console.error("TEMPUS: Nightly drift recalculation overdue!");
    allHealthy = false;
  }

  if (allHealthy) {
    console.log("✅ All system health checks passed.");
  } else {
    process.exit(1);
  }
}

runHealthChecks();

// .github/workflows/health-check.yml
name: System Health Check

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Run system health check
        run: npx ts-node server/scripts/systemHealthCheck.ts