export interface ExperienceHeader {
  company: string;
  position: string;
  location: string | null;
}

const JOB_TITLE_KEYWORDS = [
  "engineer",
  "developer",
  "designer",
  "manager",
  "analyst",
  "consultant",
  "architect",
  "intern",
  "internship",
  "developer",
  "programmer",
  "administrator",
  "specialist",
  "associate",
  "lead",
  "director",
  "scientist",
  "tester",
  "qa",
  "devops",
  "recruiter",
];

export function parseExperienceHeader(
  lines: string[],
): ExperienceHeader | null {
  const headerLines = lines
    .map((line) => line.trim())
    .filter(Boolean);

  if (headerLines.length === 0) {
    return null;
  }

  /*
   * Format:
   *
   * Company | Position
   * Company | Position | Location
   */
  const separatorResult =
    parseSeparatedHeader(headerLines);

  if (separatorResult) {
    return separatorResult;
  }

  /*
   * Format:
   *
   * Position — Company
   * Position - Company
   */
  const dashResult =
    parseDashHeader(headerLines);

  if (dashResult) {
    return dashResult;
  }

  /*
   * Format:
   *
   * Software Engineer
   * ABC Technologies
   *
   * OR
   *
   * ABC Technologies
   * Software Engineer
   */
  if (headerLines.length >= 2) {
    const first = headerLines[0]!;
    const second = headerLines[1]!;

    const firstLooksLikePosition =
      looksLikeJobTitle(first);

    const secondLooksLikePosition =
      looksLikeJobTitle(second);

    if (
      firstLooksLikePosition &&
      !secondLooksLikePosition
    ) {
      return {
        company: second,
        position: first,
        location: null,
      };
    }

    if (
      !firstLooksLikePosition &&
      secondLooksLikePosition
    ) {
      return {
        company: first,
        position: second,
        location: null,
      };
    }
  }

  /*
   * We don't have enough information to
   * confidently determine the header.
   */
  return null;
}

function parseSeparatedHeader(
  lines: string[],
): ExperienceHeader | null {
  const line = lines[0]!;

  if (!line.includes("|")) {
    return null;
  }

  const parts = line
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  const first = parts[0]!;
  const second = parts[1]!;

  const firstLooksLikePosition =
    looksLikeJobTitle(first);

  const secondLooksLikePosition =
    looksLikeJobTitle(second);

  let company: string;
  let position: string;

  if (
    firstLooksLikePosition &&
    !secondLooksLikePosition
  ) {
    position = first;
    company = second;
  } else {
    company = first;
    position = second;
  }

  const location =
    parts.length >= 3
      ? parts[2]!
      : null;

  return {
    company,
    position,
    location,
  };
}

function parseDashHeader(
  lines: string[],
): ExperienceHeader | null {
  const line = lines[0]!;

  const match = line.match(
    /^(.+?)\s+(?:—|–|-)\s+(.+)$/,
  );

  if (!match) {
    return null;
  }

  const first = match[1]!.trim();
  const second = match[2]!.trim();

  const firstLooksLikePosition =
    looksLikeJobTitle(first);

  const secondLooksLikePosition =
    looksLikeJobTitle(second);

  if (
    firstLooksLikePosition &&
    !secondLooksLikePosition
  ) {
    return {
      company: second,
      position: first,
      location: null,
    };
  }

  if (
    !firstLooksLikePosition &&
    secondLooksLikePosition
  ) {
    return {
      company: first,
      position: second,
      location: null,
    };
  }

  return null;
}

function looksLikeJobTitle(
  text: string,
): boolean {
  const normalized = text.toLowerCase();

  return JOB_TITLE_KEYWORDS.some(
    (keyword) =>
      normalized.includes(keyword),
  );
}