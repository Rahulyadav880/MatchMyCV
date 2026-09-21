import type { ParsedResume } from "@resume-analyzer/shared";
import type { LLMProvider } from "./providers/llm-provider.js";
import type { AnalysisResultSchema } from "./schemas/analysis-schema.js";
export interface AnalyzeResumeInput {
    resume: ParsedResume;
    jobDescription: string;
}
export declare class ResumeAnalyzer {
    private readonly provider;
    constructor(provider: LLMProvider);
    analyze(input: AnalyzeResumeInput): Promise<AnalysisResultSchema>;
}
//# sourceMappingURL=analyzer.d.ts.map