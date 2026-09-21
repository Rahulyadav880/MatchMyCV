import { z } from "zod";
export declare const atsAnalysisSchema: z.ZodObject<{
    score: z.ZodNumber;
    matchedKeywords: z.ZodArray<z.ZodString>;
    missingKeywords: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const analysisResultSchema: z.ZodObject<{
    overallScore: z.ZodNumber;
    summary: z.ZodString;
    strengths: z.ZodArray<z.ZodString>;
    weaknesses: z.ZodArray<z.ZodString>;
    suggestions: z.ZodArray<z.ZodString>;
    missingSkills: z.ZodArray<z.ZodString>;
    atsAnalysis: z.ZodObject<{
        score: z.ZodNumber;
        matchedKeywords: z.ZodArray<z.ZodString>;
        missingKeywords: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AnalysisResultSchema = z.infer<typeof analysisResultSchema>;
//# sourceMappingURL=analysis-schema.d.ts.map