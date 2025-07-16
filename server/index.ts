// server/index.ts
import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import agentsRoute from "./routes/agents";
import booksRoute from "./routes/books";
import { reflectionsRouter } from "./routes/reflections";
import interactionsRoute from "./routes/interactions";
import auditRoute from "./routes/reflection-audit";
import ritualRoute from "./routes/rituals";
import contradictionRoute from "./routes/contradictions";
import doctrineRouter from "./routes/doctrine";
import taskRouter from "./routes/tasks";
import systemManifestRoute from "./routes/systemManifest";
import cvtTimeRoute from "./routes/cvt-time";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing in .env");
  process.exit(1);
}

const app: express.Application = express();
app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRouter);
app.use("/api/doctrine", doctrineRouter);
app.use("/api/agents", agentsRoute);
app.use("/api/books", booksRoute);
app.use("/api/reflections", reflectionsRouter);
app.use("/api/interactions", interactionsRoute);
app.use("/api/reflection-audit", auditRoute);
app.use("/api/rituals", ritualRoute);
app.use("/api/contradictions", contradictionRoute);
app.use("/api/system", systemManifestRoute);
app.use("/api/cvt-time", cvtTimeRoute);
// Error-handling middleware must have 4 arguments for Express to recognize it
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌍 Veritas API running on port ${PORT}`));
