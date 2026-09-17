export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

const MONTH_PATTERN =
  "(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)";

export function parseDateRange(
  text: string,
): DateRange {
  const normalizedText = text
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  const rangeMatch = normalizedText.match(
    new RegExp(
      `\\b(${MONTH_PATTERN}\\s+\\d{4}|\\d{4})\\s*-\\s*(${MONTH_PATTERN}\\s+\\d{4}|\\d{4}|Present|Current)\\b`,
      "i",
    ),
  );

  if (rangeMatch) {
  return {
    startDate: rangeMatch[1]
      ? normalizeDate(rangeMatch[1])
      : null,

    endDate: rangeMatch[2]
      ? normalizeDate(rangeMatch[2])
      : null,
  };
}

  // Single year
  const yearMatch = normalizedText.match(
    /\b(?:19|20)\d{2}\b/,
  );

  if (yearMatch) {
  return {
    startDate: yearMatch[0],
    endDate: null,
  };
}

  return {
    startDate: null,
    endDate: null,
  };
}

const MONTHS: Record<string, string> = {
  january: "01",
  jan: "01",
  february: "02",
  feb: "02",
  march: "03",
  mar: "03",
  april: "04",
  apr: "04",
  may: "05",
  june: "06",
  jun: "06",
  july: "07",
  jul: "07",
  august: "08",
  aug: "08",
  september: "09",
  sep: "09",
  sept: "09",
  october: "10",
  oct: "10",
  november: "11",
  nov: "11",
  december: "12",
  dec: "12",
};

function normalizeDate(
  value: string,
): string {
  const trimmed = value.trim();

  if (
    /^(present|current)$/i.test(trimmed)
  ) {
    return "Present";
  }

  const monthYearMatch = trimmed.match(
    new RegExp(
      `^(${MONTH_PATTERN})\\s+(\\d{4})$`,
      "i",
    ),
  );

  if (monthYearMatch) {
    const month = MONTHS[
      monthYearMatch[1]!.toLowerCase()
    ];

    return `${monthYearMatch[2]}-${month}`;
  }

  return trimmed;
}

