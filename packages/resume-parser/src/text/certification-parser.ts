import type { Certification } from "@resume-analyzer/shared";

const CERTIFICATION_KEYWORDS = [
  "certified",
  "certificate",
  "certification",
  "professional certificate",
  "credential",
];

const DATE_PATTERN =
  /\b(?:19|20)\d{2}\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(?:19|20)\d{2}\b/i;

export function parseCertifications(
  text: string,
): Certification[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const entries = splitCertificationEntries(lines);

  return entries
    .map(parseCertificationEntry)
    .filter(
      (certification): certification is Certification =>
        certification !== null,
    );
}

function splitCertificationEntries(
  lines: string[],
): string[][] {
  const entries: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    const isNewEntry =
      current.length > 0 &&
      looksLikeCertification(line) &&
      !looksLikeProvider(current[current.length - 1]!);

    if (isNewEntry) {
      entries.push(current);
      current = [];
    }

    current.push(line);
  }

  if (current.length > 0) {
    entries.push(current);
  }

  return entries;
}

function parseCertificationEntry(
  lines: string[],
): Certification | null {
  if (lines.length === 0) {
    return null;
  }

  /*
   * Handle:
   *
   * AWS Certified Developer |
   * Amazon Web Services |
   * 2025
   */
  const separated = lines[0]!.split("|");

  if (separated.length >= 2) {
    const name = separated[0]!.trim();
    const issuingOrganization =
      separated[1]!.trim() || null;

    const issueDate =
      findDate(lines) ?? null;

    return {
      name,
      issuingOrganization,
      issueDate,
      expiryDate: null,
      credentialUrl: null,
    };
  }

  const name = lines[0]!;

const hasCertificationSignal =
  lines.some(looksLikeCertification) ||
  lines.length >= 2;

if (!hasCertificationSignal) {
  return null;
}

  const issuingOrganization =
    lines.length >= 2 &&
    !containsDate(lines[1]!)
      ? lines[1]!
      : null;

  const issueDate =
    findDate(lines) ?? null;

  const credentialUrl =
    findCredentialUrl(lines);

  return {
    name,
    issuingOrganization,
    issueDate,
    expiryDate: null,
    credentialUrl,
  };
}

function looksLikeCertification(
  text: string,
): boolean {
  const normalized = text.toLowerCase();

  return CERTIFICATION_KEYWORDS.some(
    (keyword) =>
      normalized.includes(keyword),
  );
}

function looksLikeProvider(
  text: string,
): boolean {
  const normalized = text.toLowerCase();

  return (
    normalized.includes("amazon") ||
    normalized.includes("aws") ||
    normalized.includes("google") ||
    normalized.includes("microsoft") ||
    normalized.includes("oracle") ||
    normalized.includes("ibm") ||
    normalized.includes("coursera") ||
    normalized.includes("udemy")
  );
}

function containsDate(
  text: string,
): boolean {
  return DATE_PATTERN.test(text);
}

function findDate(
  lines: string[],
): string | null {
  for (const line of lines) {
    const match = line.match(DATE_PATTERN);

    if (match) {
      return match[0];
    }
  }

  return null;
}

function findCredentialUrl(
  lines: string[],
): string | null {
  for (const line of lines) {
    const match = line.match(
      /https?:\/\/\S+/i,
    );

    if (match) {
      return match[0];
    }
  }

  return null;
}