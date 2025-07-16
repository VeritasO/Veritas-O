const fs = require("fs");
const path = require("path");

const filesToCheck = [
  "client/src/components/SearchBar.tsx",
  "client/src/components/sections/SystemOverview.tsx",
  "client/src/components/sections/BooksLibrary.tsx",
  "client/src/components/sections/AgentsDirectory.tsx",
  "client/src/components/sections/CVTTimeDisplay.tsx",
  "client/src/components/sections/DoctrineManagement.tsx",
  "client/src/components/sections/ReflectionSubmission.tsx",
  "client/src/components/sections/SystemAnalytics.tsx",
  "client/src/components/ReflectionAuditPanel.tsx",
  "client/src/components/SymbolicSuggestions.tsx",
  "client/src/components/ContradictionMonitor.tsx",
  "client/src/components/AgentTaskComposer.tsx",
  "client/src/hooks/useToast.ts",
  "client/src/lib/queryClient.ts",
  "client/src/hooks/useAuditLogs.ts",
  "client/src/hooks/useSymbolicSuggestions.ts",
  "client/src/hooks/useContradictions.ts"
];

let missing = [];

for (const relPath of filesToCheck) {
  const absPath = path.resolve(relPath);
  if (!fs.existsSync(absPath)) {
    missing.push(relPath);
  }
}

if (missing.length === 0) {
  console.log("✅ All required files exist.");
} else {
  console.log("❌ Missing files:");
  missing.forEach(f => console.log(" - " + f));
}