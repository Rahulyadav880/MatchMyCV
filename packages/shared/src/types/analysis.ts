export interface ResumeAnalysis {
  resumeId: string;
  jobDescriptionId: string;

  overallScore: number;
  skillsMatchScore: number;

  matchedSkills: string[];
  missingSkills: string[];

  recommendations: string[];
}