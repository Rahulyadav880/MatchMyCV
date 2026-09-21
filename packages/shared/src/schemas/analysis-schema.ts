import { z } from "zod";

export const skillMatchSchema = z.object({
  skill: z.string(),
  status: z.enum([
    "matched",
    "missing",
    "related",
  ]),
  evidence: z.string().nullable(),
});

export const resumeSuggestionSchema =
  z.object({
    category: z.enum([
      "summary",
      "skills",
      "experience",
      "projects",
      "education",
      "formatting",
      "ats",
    ]),
    issue: z.string(),
    suggestion: z.string(),
    priority: z.enum([
      "high",
      "medium",
      "low",
    ]),
  });

export const bulletSuggestionSchema =
  z.object({
    original: z.string(),
    improved: z.string(),
    reason: z.string(),
  });

export const analysisResultSchema =
  z.object({
    overallSummary: z.string(),

    strengths: z.array(z.string()),

    weaknesses: z.array(z.string()),

    matchedSkills: z.array(
      skillMatchSchema,
    ),

    missingSkills: z.array(
      skillMatchSchema,
    ),

    suggestions: z.array(
      resumeSuggestionSchema,
    ),

    bulletSuggestions: z.array(
      bulletSuggestionSchema,
    ),

    atsKeywords: z.array(z.string()),

    jobMatch: z.object({
      matchedRequirements:
        z.array(z.string()),

      missingRequirements:
        z.array(z.string()),

      transferableSkills:
        z.array(z.string()),
    }),
  });

export type AnalysisResult = z.infer<
  typeof analysisResultSchema
>;