// import type { ParsedResume } from "@resume-analyzer/shared";

// import { extractTextFromPdf } from "@resume-analyzer/resume-parser";
// import { parseResume } from "@resume-analyzer/resume-parser";

// import { ResumeAnalyzer } from "./analyzer.js";
// import type { AnalysisResultSchema } from "./schemas/analysis-schema.js";

// export async function analyzeResumeFromPdf(
//   pdfPath: string,
//   jobDescription: string,
//   analyzer: ResumeAnalyzer,
// ): Promise<AnalysisResultSchema> {
//   // 1. Extract raw text from PDF
//   const rawText =
//     await extractTextFromPdf(pdfPath);

//   // 2. Convert raw text into ParsedResume
//   const resume: ParsedResume =
//     parseResume(rawText);

//   // 3. Analyze the parsed resume against
//   //    the provided job description
//   const result =
//     await analyzer.analyze({
//       resume,
//       jobDescription,
//     });

//   return result;
// }