import express, {} from "express";
import healthRouter from "./routes/health.route.js";
const app = express();
app.use(express.json());
app.use("/api/health", healthRouter);
const exampleResume = {
    personalInfo: {
        fullName: "Test User",
        email: null,
        phone: null,
        location: null,
        linkedin: null,
        github: null,
        portfolio: null,
    },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
};
console.log(exampleResume.personalInfo.fullName);
export default app;
//# sourceMappingURL=app.js.map