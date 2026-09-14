import express, {type Express} from "express";

import healthRouter from "./routes/health.route.js";

const app : Express = express();

app.use(express.json());

app.use("/api/health", healthRouter);

export default app;