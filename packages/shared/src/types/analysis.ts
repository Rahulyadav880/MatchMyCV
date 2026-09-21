export interface ResumeAnalysis {
  resumeId: string;
  jobDescriptionId: string;

  overallScore: number;
  skillsMatchScore: number;

  matchedSkills: string[];
  missingSkills: string[];

  recommendations: string[];
}

export interface ATSAnalysis {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface AnalysisResult {
  overallScore: number;

  summary: string;

  strengths: string[];

  weaknesses: string[];

  suggestions: string[];

  missingSkills: string[];

  atsAnalysis: ATSAnalysis;
}