import type { Request, Response } from "express";

import { processResumeUpload } from "../services/resume.service.js";

export const uploadResume = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      error: {
        code: "RESUME_FILE_REQUIRED",
        message: "Please upload a resume PDF.",
      },
    });

    return;
  }

  const result = await processResumeUpload(req.file);

  res.status(201).json({
    success: true,
    data: result,
  });
};