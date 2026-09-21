import { z } from "zod";

export const atsAnalysisSchema = z.object({
  score: z.number().min(0).max(100),

  matchedKeywords: z.array(
    z.string(),
  ),

  missingKeywords: z.array(
    z.string(),
  ),
});

export const analysisResultSchema =
  z.object({
    overallScore: z
      .number()
      .min(0)
      .max(100),

    summary: z.string(),

    strengths: z.array(
      z.string(),
    ),

    weaknesses: z.array(
      z.string(),
    ),

    suggestions: z.array(
      z.string(),
    ),

    missingSkills: z.array(
      z.string(),
    ),

    atsAnalysis:
      atsAnalysisSchema,
  });

export type AnalysisResultSchema =
  z.infer<
    typeof analysisResultSchema
  >;