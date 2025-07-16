// server/index.ts
import express from "express";
import cors from "cors";
import agentsRoute from "./routes/agents";
import booksRoute from "./routes/books";
import reflectionsRoute from "./routes/reflections";
import interactionsRoute from "./routes/interactions";
import auditRoute from "./routes/reflection-audit";
import ritualRoute from "./routes/rituals";
import contradictionRoute from "./routes/contradictions";
import tasksRoute from "./routes/tasks";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/agents", agentsRoute);
app.use("/api/books", booksRoute);
app.use("/api/reflections", reflectionsRoute);
app.use("/api/interactions", interactionsRoute);
app.use("/api/reflection-audit", auditRoute);
app.use("/api/rituals", ritualRoute);
app.use("/api/contradictions", contradictionRoute);
app.use("/api/tasks", tasksRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌍 Veritas API running on port ${PORT}`));
