import { Router} from "express";
const router = Router() as Router;

router.get("/", (req, res) => {
    res.status(200).json({
        success : true,
        message : "Resume Analyzer API is running",
    });
});

export default router;