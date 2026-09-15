import express, {type Express} from "express";

import healthRouter from "./routes/health.route.js";
import resumeRouter from "./routes/resume.route.js";

const app : Express = express();

app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/resumes", resumeRouter);

export default app;