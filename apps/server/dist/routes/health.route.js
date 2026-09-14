import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Resume Analyzer API is running",
    });
});
export default router;
//# sourceMappingURL=health.route.js.map