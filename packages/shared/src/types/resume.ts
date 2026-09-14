export interface ResumeDocument {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  rawText: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  grade: string | null;
}

export interface Experience {
  company: string;
  position: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  currentlyWorking: boolean;
  responsibilities: string[];
  achievements: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface Skill {
  name: string;
  category: string;
}

export interface Certification {
  name: string;
  issuingOrganization: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  credentialUrl: string | null;
}

export interface ParsedResume {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
}