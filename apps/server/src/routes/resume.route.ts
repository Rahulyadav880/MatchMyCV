import { Router} from "express";
import { resumeUpload } from "../middleware/upload.middleware.js";
import { uploadResume } from "../controllers/resume.controller.js";
const router = Router() as Router;

router.post("/", 
    resumeUpload.single("resume"),
    uploadResume,
);


export default router;