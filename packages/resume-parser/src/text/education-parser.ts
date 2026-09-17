import type { Education } from "@resume-analyzer/shared";
import { parseDateRange } from "./date-parser.js";
export function parseEducation(
  educationText: string,
): Education[] {
  const entries = splitEducationEntries(educationText);

  return entries
    .map(parseEducationEntry)
    .filter(
      (education): education is Education =>
        education !== null,
    );
}

function splitEducationEntries(
  text: string,
): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const entries: string[] = [];

  let currentEntry: string[] = [];

  for (const line of lines) {
    const hasDateRange =
      /\b(?:19|20)\d{2}\s*[–-]\s*(?:19|20)\d{2}\b/.test(
        line,
      );

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

function extractGrade(
  text: string,
): string | null {
  const cgpaMatch = text.match(
    /\bCGPA\s*:\s*([0-9]+(?:\.[0-9]+)?(?:\s*\/\s*[0-9]+(?:\.[0-9]+)?)?)/i,
  );

  if (cgpaMatch?.[1]) {
    return cgpaMatch[1].replace(/\s+/g, "");
  }

  const percentageMatch = text.match(
    /\b([0-9]+(?:\.[0-9]+)?)\s*%/,
  );

  return percentageMatch?.[1]
    ? `${percentageMatch[1]}%`
    : null;
}

function extractDegree(
  text: string,
): string {
  const degreePatterns = [
    /\bBachelor of Technology\b/i,
    /\bBachelor of Engineering\b/i,
    /\bMaster of Technology\b/i,
    /\bMaster of Engineering\b/i,
    /\bMaster of Science\b/i,
    /\bBachelor of Science\b/i,
    /\bBachelor of Computer Applications\b/i,
    /\bMaster of Computer Applications\b/i,
    /\bClass XII\b/i,
    /\bClass X\b/i,
    /\b12th\b/i,
    /\b10th\b/i,
  ];

  for (const pattern of degreePatterns) {
    const match = text.match(pattern);

    if (match?.[0]) {
      return match[0];
    }
  }

  return "";
}

function extractFieldOfStudy(
  text: string,
  degree: string,
): string | null {
  if (!degree) {
    return null;
  }

  const degreeIndex = text
    .toLowerCase()
    .indexOf(degree.toLowerCase());

  if (degreeIndex === -1) {
    return null;
  }

  const afterDegree = text.slice(
    degreeIndex + degree.length,
  );

  const match = afterDegree.match(
    /\bin\s+(.+?)(?=\s+CGPA\b|\s+\d+(?:\.\d+)?%|\s*$)/i,
  );

  return match?.[1]?.trim() ?? null;
}

function extractInstitution(
  text: string,
): string {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const firstLine = lines[0];

  if (!firstLine) {
    return "";
  }

  return firstLine
    .replace(
      /\b(?:19|20)\d{2}\s*[–-]\s*(?:19|20)\d{2}\b/,
      "",
    )
    .trim();
}

function parseEducationEntry(
  entry: string,
): Education | null {
  const lines = entry
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return null;
  }

  const dateRange = parseDateRange(entry);
  const degree = extractDegree(entry);

  return {
    institution: extractInstitution(entry),
    degree,
    fieldOfStudy: extractFieldOfStudy(
      entry,
      degree,
    ),
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    grade: extractGrade(entry),
  };
}