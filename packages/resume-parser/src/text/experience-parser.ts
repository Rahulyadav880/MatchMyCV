import type { Experience } from "@resume-analyzer/shared";
import { parseDateRange } from "./date-parser.js";
import {
  parseExperienceHeader,
} from "./experience-header-parser.js";

export function parseExperience(
  text: string,
): Experience[] {
  const entries = splitExperienceEntries(text);

  return entries
    .map(parseExperienceEntry)
    .filter(
      (experience): experience is Experience =>
        experience !== null,
    );
}

function splitExperienceEntries(
  text: string,
): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const entries: string[] = [];
  let currentEntry: string[] = [];

  for (const line of lines) {
    const isDateLine =
      parseDateRange(line).startDate !== null;

    /*
     * A new experience normally starts after
     * the previous experience's responsibilities.
     *
     * We therefore only start a new entry when:
     * - we already have an entry
     * - the current line is NOT a bullet
     * - the current entry already contains a date
     * - the current line looks like a new header
     */
    if (
      currentEntry.length > 0 &&
      !line.startsWith("•") &&
      !isDateLine &&
      hasDate(currentEntry)
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

function hasDate(
  lines: string[],
): boolean {
  return lines.some(
    (line) =>
      parseDateRange(line).startDate !== null,
  );
}

function parseExperienceEntry(
  entry: string,
): Experience | null {
  const lines = entry
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return null;
  }

  const dateLineIndex = lines.findIndex(
    (line) =>
      parseDateRange(line).startDate !== null,
  );

  if (dateLineIndex === -1) {
    return null;
  }

  const dateRange = parseDateRange(
    lines[dateLineIndex]!,
  );

  const headerLines = lines.slice(
  0,
  dateLineIndex,
);

const header =
  parseExperienceHeader(headerLines);

if (!header) {
  return null;
}

  const contentLines = lines.slice(
    dateLineIndex + 1,
  );

  const bulletPoints = contentLines
    .filter((line) =>
      line.startsWith("•"),
    )
    .map((line) =>
      line.replace(/^•\s*/, ""),
    );

  return {
    company: header.company,
position: header.position,
location: header.location,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    currentlyWorking:
      dateRange.endDate === "Present",
    responsibilities: bulletPoints,
    achievements: [],
  };
}