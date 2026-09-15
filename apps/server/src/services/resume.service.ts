import type { Express } from "express";

import { extractTextFromPdf } from "@resume-analyzer/resume-parser";

export const processResumeUpload = async (
  file: Express.Multer.File,
) => {
  const rawText = await extractTextFromPdf(file.buffer);

  return {
    id: "temporary-id",
    fileName: file.originalname,
    rawText,
  };
};