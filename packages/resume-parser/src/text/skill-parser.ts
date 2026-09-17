import  { type Skill } from "@resume-analyzer/shared";

export function parseSkills(
  skillsText: string,
): Skill[] {
  const skills: Skill[] = [];

  const lines = skillsText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const category = line
      .slice(0, separatorIndex)
      .trim();

    const skillsPart = line
      .slice(separatorIndex + 1)
      .trim();

    if (!category || !skillsPart) {
      continue;
    }

    const skillNames = skillsPart
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    for (const name of skillNames) {
      skills.push({
        name,
        category,
      });
    }
  }

  return skills;
}