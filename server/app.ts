import bookRoutes from "./routes/books";
app.use("/api/books", bookRoutes);
import tempusRoutes from "./routes/tempus";
app.use("/api/tempus", tempusRoutes);