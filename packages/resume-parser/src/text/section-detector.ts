export type ResumeSectionName =
  | "summary"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "extracurricular"
  | "unknown";

  export interface ResumeSection {
    name : ResumeSectionName;
    title : string;
    content : string;
  }

  const SECTION_ALIASES: Record<ResumeSectionName, string[]> = {
  summary: [
    "summary",
    "professional summary",
    "profile",
    "professional profile",
    "objective",
    "career objective",
  ],

  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment",
    "employment history",
  ],

  projects: [
    "projects",
    "personal projects",
    "academic projects",
    "project experience",
  ],

  skills: [
    "skills",
    "technical skills",
    "core skills",
    "key skills",
    "technical expertise",
  ],

  education: [
    "education",
    "educational background",
    "academic background",
    "academic qualifications",
  ],

  certifications: [
    "certifications",
    "certificates",
    "licenses & certifications",
    "certifications & courses",
  ],

  extracurricular: [
    "extracurricular",
    "extracurricular activities",
    "activities",
    "achievements",
    "additional activities",
  ],

  unknown: [],
};

function normalizeHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[:\-|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function identifySection(
  heading: string,
): ResumeSectionName | null {
  const normalizedHeading = normalizeHeading(heading);

  for (const [sectionName, aliases] of Object.entries(
    SECTION_ALIASES,
  )) {
    if (
      aliases.some(
        (alias) =>
          normalizeHeading(alias) === normalizedHeading,
      )
    ) {
      return sectionName as ResumeSectionName;
    }
  }

  return null;
}

export function detectSections(
  rawText: string,
): ResumeSection[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: ResumeSection[] = [];

  let currentSection: ResumeSection | null = null;

  for (const line of lines) {
    const sectionName = identifySection(line);

    if (sectionName) {
      if (currentSection) {
        currentSection.content =
          currentSection.content.trim();

        sections.push(currentSection);
      }

      currentSection = {
        name: sectionName,
        title: line,
        content: "",
      };

      continue;
    }

    if (currentSection) {
      currentSection.content += `${line}\n`;
    }
  }

  if (currentSection) {
    currentSection.content =
      currentSection.content.trim();

    sections.push(currentSection);
  }

  return sections;
}