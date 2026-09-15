import express, {} from "express";
import healthRouter from "./routes/health.route.js";
import resumeRouter from "./routes/resume.route.js";
const app = express();
app.use(express.json());
app.use("/api/health", healthRouter);
app.use("/api/resumes", resumeRouter);
export default app;
//# sourceMappingURL=app.js.map