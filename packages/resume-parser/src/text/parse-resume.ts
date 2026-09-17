import type { ParsedResume } from "@resume-analyzer/shared";

import { parsePersonalInfo } from "./personal-info-parser.js";
import { detectSections } from "./section-detector.js";
import { parseSkills } from "./skill-parser.js";
import { parseEducation } from "./education-parser.js";
import { parseProjects } from "./project-parser.js";
import { parseExperience } from "./experience-parser.js";
import { parseCertifications } from "./certification-parser.js";

export function parseResume(
  rawText: string,
): ParsedResume {
  const sections = detectSections(rawText);

  const skillsSection = sections.find(
    (section) => section.name === "skills",
  );

  const educationSection = sections.find(
    (section) => section.name === "education",
  );

  const projectsSection = sections.find(
    (section) => section.name === "projects",
  );

  const experienceSection = sections.find(
    (section) => section.name === "experience",
  );

  const certificationsSection = sections.find(
    (section) => section.name === "certifications",
  );

  const experience = experienceSection
    ? parseExperience(experienceSection.content)
    : [];

  const skills = skillsSection
    ? parseSkills(skillsSection.content)
    : [];

  const education = educationSection
    ? parseEducation(educationSection.content)
    : [];

  const projects = projectsSection
    ? parseProjects(projectsSection.content)
    : [];

  const certifications = certificationsSection
  ? parseCertifications(certificationsSection.content)
  : [];

  const personalInfo =
    parsePersonalInfo(rawText);

  return {
    personalInfo,
    education,
    experience,
    projects,
    skills,
    certifications,
  };
}