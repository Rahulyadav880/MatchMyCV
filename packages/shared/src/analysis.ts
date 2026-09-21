export interface SkillMatch {
  skill: string;
  status: "matched" | "missing" | "related";
  evidence: string | null;
}

export interface ResumeSuggestion {
  category:
    | "summary"
    | "skills"
    | "experience"
    | "projects"
    | "education"
    | "formatting"
    | "ats";

  issue: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
}

export interface BulletSuggestion {
  original: string;
  improved: string;
  reason: string;
}

export interface AnalysisResult {
  overallSummary: string;

  strengths: string[];

  weaknesses: string[];

  matchedSkills: SkillMatch[];

  missingSkills: SkillMatch[];

  suggestions: ResumeSuggestion[];

  bulletSuggestions: BulletSuggestion[];

  atsKeywords: string[];

  jobMatch: {
    matchedRequirements: string[];
    missingRequirements: string[];
    transferableSkills: string[];
  };
}