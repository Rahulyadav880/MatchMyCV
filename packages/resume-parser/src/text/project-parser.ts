import type { Project } from "@resume-analyzer/shared";
import {
  TECHNOLOGY_VOCABULARY,
} from "./technology-vocabulary.js";
import { parseDateRange } from "./date-parser.js";

export function parseProjects(
  projectText: string,
): Project[] {
  const entries = splitProjectEntries(projectText);

  return entries
    .map(parseProjectEntry)
    .filter(
      (project): project is Project =>
        project !== null,
    );
}

function splitProjectEntries(
  text: string,
): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const entries: string[] = [];

  let currentEntry: string[] = [];

  for (const line of lines) {
  const dateRange = parseDateRange(line);

  const hasDateRange =
    dateRange.startDate !== null &&
    dateRange.endDate !== null;

  if (
    hasDateRange &&
    currentEntry.length > 0
  ) {
    entries.push(currentEntry.join("\n"));
    currentEntry = [];
  }

  currentEntry.push(line);
}

  if (currentEntry.length > 0) {
    entries.push(currentEntry.join("\n"));
  }

  return entries;
}

function extractProjectName(
  entry: string,
): string {
  const firstLine = entry
    .split(/\r?\n/)[0]
    ?.trim();

  if (!firstLine) {
    return "";
  }

  return firstLine
    .replace(
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+(?:19|20)\d{2}\s*[–-]\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+(?:19|20)\d{2}\b/i,
      "",
    )
    .trim();
}

function extractProjectDescription(
  entry: string,
): string {
  const lines = entry
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return "";
  }

  const descriptionLines = lines
    .slice(1)
    .filter(
      (line) =>
        !/^(Live Demo|Source Code|Live Demo \/ Source Code)$/i.test(
          line,
        ),
    )
    .map((line) =>
      line.replace(/^[•●▪◦]\s*/, ""),
    );

  return descriptionLines.join(" ").trim();
}


function escapeRegExp(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}
function extractTechnologies(
  text: string,
): string[] {
  return TECHNOLOGY_VOCABULARY.filter(
    (technology) => {
      const escapedTechnology =
        escapeRegExp(technology);

      const pattern = new RegExp(
        `(?:^|\\s|[,.;:()\\[\\]{}])${escapedTechnology}(?=$|\\s|[,.;:()\\[\\]{}])`,
        "i",
      );

      return pattern.test(text);
    },
  );
}

function parseProjectEntry(
  entry: string,
): Project | null {
  const name = extractProjectName(entry);

  if (!name) {
    return null;
  }

  const dates = parseDateRange(entry);

  return {
    name,
    description: extractProjectDescription(entry),
    technologies: extractTechnologies(entry),
    startDate: dates.startDate,
    endDate: dates.endDate,
    url: null,
  };
}