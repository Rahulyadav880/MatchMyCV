import type {
  ParsedResume,
} from "@resume-analyzer/shared";

import type {
  LLMProvider,
} from "./providers/llm-provider.js";

import {
  analysisResultSchema,
} from "./schemas/analysis-schema.js";

import type {
  AnalysisResultSchema,
} from "./schemas/analysis-schema.js";

export interface AnalyzeResumeInput {
  resume: ParsedResume;
  jobDescription: string;
}

export class ResumeAnalyzer {
  constructor(
    private readonly provider: LLMProvider,
  ) {}

  async analyze(
    input: AnalyzeResumeInput,
  ): Promise<AnalysisResultSchema> {
    const systemPrompt =
      buildSystemPrompt();

    const userPrompt =
      buildUserPrompt(input);

    const response =
      await this.provider.generate({
        systemPrompt,
        userPrompt,
        temperature: 0.2,
      });

    const parsed =
      parseAnalysisResponse(
        response.content,
      );

    /*
     * The LLM identifies matched and missing
     * requirements.
     *
     * The application calculates the ATS score.
     */
    const atsScore =
      calculateAtsScore(
        parsed.atsAnalysis.matchedKeywords,
        parsed.atsAnalysis.missingKeywords,
      );

    return {
      ...parsed,

      atsAnalysis: {
        ...parsed.atsAnalysis,
        score: atsScore,
      },
    };
  }
}

/* =========================================================
   SYSTEM PROMPT
   ========================================================= */

function buildSystemPrompt(): string {
  return `
Your analysis must be based ONLY on:

1. The provided resume
2. The provided job description

Do not use outside knowledge about the candidate.

Return ONLY a valid JSON object.

Do not return:
- Markdown
- Code fences
- Explanations outside JSON
- Comments
- Additional fields

The JSON MUST follow exactly this structure:

{
  "overallScore": 0,
  "summary": "string",
  "strengths": [
    "string"
  ],
  "weaknesses": [
    "string"
  ],
  "suggestions": [
    "string"
  ],
  "missingSkills": [
    "string"
  ],
  "atsAnalysis": {
    "score": 0,
    "matchedKeywords": [
      "string"
    ],
    "missingKeywords": [
      "string"
    ]
  }
}

IMPORTANT:

The application will calculate the final ATS score itself.

Therefore:

- atsAnalysis.score MUST be 0.
- Do NOT calculate the ATS score.
- Focus only on correctly identifying matched
  and missing requirements.

==================================================
MATCHED REQUIREMENTS
==================================================

matchedKeywords must contain ONLY requirements
from the job description that have clear evidence
in the resume.

Every matched requirement MUST have identifiable
evidence somewhere in the resume.

For example, if the job description says:

"Experience building REST APIs"

and the resume says:

"Built REST APIs using Express.js"

then "REST APIs" can be matched.

==================================================
MISSING REQUIREMENTS
==================================================

missingKeywords must contain ONLY relevant
job-description requirements that are genuinely
absent from the entire resume.

Before marking something missing, search the
ENTIRE resume.

Do not mark a requirement as missing if equivalent
evidence exists anywhere in the resume.

==================================================
ENTIRE RESUME SEARCH
==================================================

When evaluating a requirement, inspect:

- personal information
- summary
- skills
- projects
- project names
- project descriptions
- technologies
- experience
- responsibilities
- achievements
- education
- certifications

==================================================
EQUIVALENT TERMINOLOGY
==================================================

Treat reasonable equivalent terminology as matching
evidence.

Examples:

- "RESTful APIs" = "REST APIs"
- "REST API development" = "RESTful API development"
- "Postgres" = "PostgreSQL"
- "React" = "React.js"
- "Node" = "Node.js"
- "GitHub repository" = "GitHub"
- "version control using Git" = "Git"

Do NOT create equivalences that are not technically
reasonable.

For example:

- MongoDB does NOT equal PostgreSQL
- MySQL does NOT equal PostgreSQL
- Vercel does NOT equal AWS
- Render does NOT equal AWS
- TurboRepo does NOT equal Docker
- JavaScript does NOT equal TypeScript

==================================================
PROJECT EXPERIENCE
==================================================

If a requirement is demonstrated through a project,
it should be considered MATCHED.

However, do not describe project experience as
professional employment.

For example:

Correct:
"REST APIs are demonstrated through the Affnet-v2
project."

Incorrect:
"The candidate has professional REST API experience."

==================================================
SKILLS
==================================================

Do not infer unsupported skills.

For example:

Knowing JavaScript does not automatically mean
the candidate knows TypeScript.

Knowing MongoDB does not automatically mean
the candidate knows PostgreSQL.

Using Vercel does not automatically mean
the candidate knows AWS.

==================================================
STRENGTHS
==================================================

Strengths must be supported by explicit evidence
from the resume.

Avoid unsupported proficiency claims.

Do NOT use terms such as:

- expert
- advanced
- strong
- proficient
- excellent
- extensive

unless the resume provides explicit evidence
supporting that level of proficiency.

Prefer factual statements.

For example:

"React.js is listed in the skills section."

"React.js is used in the SocketTalk project."

"The resume demonstrates REST API development
through the Affnet-v2 project."

==================================================
WEAKNESSES
==================================================

Weaknesses must be supported by:

1. Information in the resume, OR
2. A clearly identifiable gap between the resume
   and the job description.

Do not invent weaknesses.

Do not treat an empty experience section as proof
that the candidate has no real-world experience.

Instead say:

"No professional experience is listed in the
provided resume."

Do not criticize missing information unless it is
relevant to the job description or requested analysis.

==================================================
SUGGESTIONS
==================================================

Suggestions must be based on actual gaps between
the resume and job description.

Do NOT recommend learning or adding a skill that
is already clearly demonstrated in the resume.

Suggestions should be specific and actionable.

==================================================
ACADEMIC INFORMATION
==================================================

Academic grades and scores are factual data only.

Never evaluate or characterize:

- CGPA
- GPA
- percentage
- rank
- academic performance

Do NOT use:

- good
- bad
- high
- low
- average
- moderate
- excellent
- poor
- strong
- weak

for academic performance unless the job description
explicitly provides an academic requirement or
threshold.

==================================================
OVERALL SCORE
==================================================

overallScore should represent documented job fit.

Consider only:

- requirements in the job description
- relevant skills
- relevant project experience
- relevant professional experience
- relevant education
- relevant qualifications

Do NOT increase the score because of unrelated
skills.

Do NOT decrease the score because of irrelevant
information.

The score must be from 0 to 100.

==================================================
ADDITIONAL RULES
==================================================

1. Do not count the same requirement more than once.

For example:

- React and React.js represent one requirement.
- Git and GitHub may be separate requirements only
  when the job description clearly requires both.

2. Soft skills may be included in atsAnalysis only
when explicitly stated as requirements in the
job description.

3. Do not describe project experience as professional
experience.

4. Do not describe the candidate as a:

- strong candidate
- weak candidate
- excellent candidate
- proficient candidate
- advanced candidate
- expert candidate

Describe the documented evidence instead.

5. Do not criticize the candidate for being a student,
having an expected graduation date, or lacking
professional experience unless professional
experience is explicitly required by the job
description.

6. Do not treat an empty experience array as proof
that the candidate has no real-world experience.

State only:

"No professional experience is listed in the resume."

7. Do not recommend certifications unless:

- the job description requires or prefers a relevant
  certification, OR
- certification is directly relevant to a clearly
  identified gap and is explicitly presented as
  optional.

8. Suggestions must address missing or relevant gaps.

Do not suggest adding information merely for appearance,
such as LinkedIn, portfolio links, or certifications,
unless relevant to the requested analysis.

9. Summary, strengths, weaknesses, and suggestions must
not introduce facts that are absent from the resume
or job description.

10. Before producing the final JSON, internally verify:

- Every matched keyword has resume evidence.
- Every missing keyword is genuinely absent.
- Every missing skill is genuinely absent.
- No suggestion asks the candidate to add a skill that
  is already demonstrated.
- No unsupported proficiency claim is present.
- No academic judgment is present.
- No professional-experience claim is based only
  on projects.

==================================================
FINAL RULE
==================================================

Return ONLY the JSON object.

Do not use Markdown.
Do not use code fences.
Do not add explanations outside JSON.
`.trim();
}

/* =========================================================
   USER PROMPT
   ========================================================= */

function buildUserPrompt(
  input: AnalyzeResumeInput,
): string {
  return JSON.stringify(
    {
      resume: input.resume,
      jobDescription:
        input.jobDescription,
    },
    null,
    2,
  );
}

/* =========================================================
   JSON PARSING
   ========================================================= */

function parseAnalysisResponse(
  content: string,
): AnalysisResultSchema {
  let cleaned = content.trim();

  /*
   * Some models occasionally return a JSON code fence
   * despite being instructed not to.
   *
   * We remove ONLY the surrounding fence so the
   * application remains robust.
   */

  if (
    cleaned.startsWith("```json") &&
    cleaned.endsWith("```")
  ) {
    cleaned = cleaned
      .slice(7, -3)
      .trim();
  } else if (
    cleaned.startsWith("```") &&
    cleaned.endsWith("```")
  ) {
    cleaned = cleaned
      .slice(3, -3)
      .trim();
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error(
      "\n===== INVALID LLM RESPONSE =====",
    );

    console.error(content);

    console.error(
      "================================\n",
    );

    throw new Error(
      "LLM returned invalid JSON.",
    );
  }

  const result =
    analysisResultSchema.safeParse(
      parsed,
    );

  if (!result.success) {
    console.error(
      "\n===== INVALID LLM SCHEMA =====",
    );

    console.error(
      result.error.format(),
    );

    console.error(
      "\n===== LLM RESPONSE =====",
    );

    console.error(cleaned);

    console.error(
      "========================\n",
    );

    throw new Error(
      `LLM response failed schema validation: ${result.error.message}`,
    );
  }

  return result.data;
}

/* =========================================================
   ATS SCORE
   ========================================================= */

function calculateAtsScore(
  matchedKeywords: string[],
  missingKeywords: string[],
): number {
  const matched = new Set(
    matchedKeywords.map(
      normalizeRequirement,
    ),
  );

  const missing = new Set(
    missingKeywords.map(
      normalizeRequirement,
    ),
  );

  /*
   * A requirement cannot be both matched and missing.
   *
   * If the LLM accidentally puts the same requirement
   * into both arrays, matched takes precedence.
   */
  for (const requirement of matched) {
    missing.delete(requirement);
  }

  const matchedCount =
    matched.size;

  const missingCount =
    missing.size;

  const totalRequirements =
    matchedCount + missingCount;

  if (totalRequirements === 0) {
    return 0;
  }

  return Math.round(
    (matchedCount /
      totalRequirements) *
      100,
  );
}

/* =========================================================
   REQUIREMENT NORMALIZATION
   ========================================================= */

function normalizeRequirement(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ");
}