import type { Express } from "express";
import { extractTextFromPdf, parseResume, parsePersonalInfo } from "@resume-analyzer/resume-parser";

export const processResumeUpload = async (
  file: Express.Multer.File,
) => {
  const rawText = await extractTextFromPdf(file.buffer);

   const parsedResume = parseResume(rawText);

  return {
    id: "temporary-id",
    fileName: file.originalname,
    rawText,
    parsedResume
  };
};