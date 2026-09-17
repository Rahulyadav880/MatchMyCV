import type { PersonalInfo } from "@resume-analyzer/shared";

export function parsePersonalInfo(
  rawText: string,
): PersonalInfo {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const fullName = extractFullName(lines);
  const email = extractEmail(rawText);
  const phone = extractPhone(rawText);
  const linkedin = extractLinkedIn(rawText);
  const github = extractGithub(rawText);
  const portfolio = extractPortfolio(rawText);

  return {
    fullName,
    email,
    phone,
    location: null,
    linkedin,
    github,
    portfolio,
  };
}

function extractFullName(lines: string[]): string {
  const firstLine = lines[0];

  if (!firstLine) {
    return "";
  }

  if (
    firstLine.includes("@") ||
    /\d/.test(firstLine)
  ) {
    return "";
  }

  return firstLine;
}

function extractEmail(
  text: string,
): string | null {
  const match = text.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  );

  return match ? match[0] : null;
}

function extractPhone(
  text: string,
): string | null {
  const match = text.match(
    /(?:\+91[\s-]?)?[6-9]\d{9}/,
  );

  return match
    ? match[0].replace(/[\s-]/g, "")
    : null;
}

function extractLinkedIn(
  text: string,
): string | null {
  const match = text.match(
    /https?:\/\/(?:www\.)?linkedin\.com\/[^\s|]+/i,
  );

  return match ? match[0] : null;
}

function extractGithub(
  text: string,
): string | null {
  const match = text.match(
    /https?:\/\/(?:www\.)?github\.com\/[^\s|]+/i,
  );

  return match ? match[0] : null;
}

function extractPortfolio(
  text: string,
): string | null {
  const match = text.match(
    /https?:\/\/(?!www\.)?(?!linkedin\.com)(?!github\.com)[^\s|]+\.[^\s|]+/i,
  );

  return match ? match[0] : null;
}