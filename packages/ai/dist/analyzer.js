import { analysisResultSchema, } from "./schemas/analysis-schema.js";
export class ResumeAnalyzer {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    async analyze(input) {
        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt(input);
        const response = await this.provider.generate({
            systemPrompt,
            userPrompt,
            temperature: 0.2,
        });
        return parseAnalysisResponse(response.content);
    }
}
function buildSystemPrompt() {
    return `
You are an expert resume analysis assistant.

Analyze the candidate's resume against
the provided job description.

Return ONLY a valid JSON object.

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

Rules:

1. overallScore must be a number from 0 to 100.

2. atsAnalysis.score must be a number
   from 0 to 100.

3. matchedKeywords must contain only job-description
   keywords or requirements that are clearly present
   or explicitly demonstrated in the resume.

4. missingKeywords must contain only relevant
   job-description keywords or requirements that are
   genuinely absent from the entire resume.

5. missingSkills must contain only skills that are
   required by the job description and are not present,
   demonstrated, or reasonably equivalent anywhere
   in the resume.

6. Search the ENTIRE resume before deciding whether
   a skill or requirement is matched or missing.

   Check:
   - personal information
   - summary
   - skills
   - projects
   - project descriptions
   - technologies
   - experience
   - responsibilities
   - achievements
   - education
   - certifications

7. Treat equivalent terminology as matching evidence.

   Examples:
   - "RESTful APIs" = "REST APIs"
   - "REST API development" = "RESTful API development"
   - "Postgres" = "PostgreSQL"
   - "React" = "React.js"
   - "Node" = "Node.js"
   - "GitHub repository" = "GitHub"
   - "version control using Git" = "Git"

8. If the resume explicitly demonstrates a required
   skill through a project, experience, responsibility,
   achievement, education, certification, or skill
   entry, do NOT classify that skill as missing.

9. Every matched keyword must have identifiable
   evidence somewhere in the resume.

10. Do not infer unsupported skills.

    For example, do not assume that knowing
    JavaScript means the candidate knows TypeScript,
    or that knowing MongoDB means the candidate knows
    PostgreSQL.

11. Before adding anything to missingSkills or
    missingKeywords, verify that the skill or
    requirement does not appear anywhere in the
    resume, including equivalent terminology.

12. Do not claim that the candidate lacks a skill when
    explicit evidence for that skill exists in the resume.

13. Distinguish between a skill being completely absent
    and a skill being insufficiently demonstrated.

    If the skill is mentioned or demonstrated anywhere
    in the resume, do NOT classify it as missing.

    If the resume provides only limited evidence for a
    requirement, treat it as matched but describe the
    evidence factually without claiming a higher level
    of proficiency.

14. Do not treat a different technology as evidence of
    the required technology.

    For example:
    - MongoDB does not equal PostgreSQL.
    - AWS does not equal Vercel.
    - Docker does not equal TurboRepo.

15. Suggestions must be based on the actual gap between
    the resume and job description.

    Do not recommend learning or adding a skill that is
    already clearly demonstrated in the resume.

16. Strengths must be supported by explicit information
    in the resume.

17. Weaknesses must be supported by information from
    the resume or by a clearly identifiable gap between
    the resume and job description.

    Do not treat an academic grade as a weakness unless
    the job description explicitly specifies an academic
    requirement or threshold.

18. Do not invent experience, skills, qualifications,
    achievements, metrics, projects, certifications,
    employment history, or technologies.

19. Do not assume information that is not explicitly
    present in the resume.

20. Academic grades and scores are factual data only.

Never evaluate, rate, characterize, or interpret a grade,
CGPA, GPA, percentage, rank, or academic performance.

Do NOT use words such as:
- good
- bad
- strong
- weak
- high
- low
- average
- moderate
- excellent
- poor

unless the job description explicitly specifies an
academic requirement or threshold and the analysis is
directly comparing the resume against that requirement.

21. Do not treat the absence of a section or field as
    evidence of poor ability.

    For example, an empty experience section means
    that professional experience is not listed; it does
    not prove that the candidate has no real-world
    experience outside the resume.

22. Do not criticize a resume for missing information
    unless that information is relevant to the job
    description or to the requested resume analysis.

23. When a requirement is satisfied by evidence in a
    project rather than professional employment, consider
    it matched but do not describe it as professional
    work experience.

24. Keep the analysis grounded strictly in the provided
    resume and job description.

25. Prefer factual descriptions over subjective judgments.
    When describing the candidate, identify the evidence
    first and avoid unsupported evaluative claims.

26. Scoring must be based only on the evidence found
    in the resume and the requirements stated in the
    job description.

    overallScore should reflect the degree to which the
    candidate's documented qualifications match the
    job requirements.

    atsAnalysis.score should reflect the proportion of
    relevant job-description keywords or requirements
    that are explicitly matched by the resume.

    Do not reduce scores because of information that is
    irrelevant to the job description.

    Do not increase scores because of skills or
    qualifications that are not relevant to the job
    description.
  26a. For atsAnalysis.score, evaluate the relevant
     job-description requirements individually.

     Use the following principle:

     - Explicitly matched requirement = matched
     - Explicitly absent requirement = missing

     The ATS score should approximately reflect:

     matched relevant requirements
     -------------------------------- × 100
     total relevant requirements

     Do not count irrelevant job-description text
     as a requirement.

  26b. overallScore may consider broader job fit than
     ATS keyword matching, including documented
     projects, education, experience, and relevant
     qualifications.

     However, every factor used in the score must be
     supported by the resume and relevant to the
     job description.

27. Avoid unsupported proficiency claims.

    Do not describe a skill as:
    - expert
    - advanced
    - strong
    - proficient
    - excellent
    - extensive

    unless the resume provides explicit evidence supporting
    that level of proficiency.

    Prefer factual descriptions such as:
    - "React.js is listed in the skills section."
    - "React.js is used in the SocketTalk project."
    - "The resume demonstrates experience building REST APIs
      through the Affnet-v2 project."

28. Avoid subjective proficiency or quality judgments
    unless directly supported by explicit evidence.

    Do not describe the candidate, resume, skill level,
    academic performance, project quality, or experience
    using unsupported subjective terms.

    Prefer factual statements describing what is actually
    present in the resume.
`.trim();
}
function buildUserPrompt(input) {
    return JSON.stringify({
        resume: input.resume,
        jobDescription: input.jobDescription,
    });
}
function parseAnalysisResponse(content) {
    let cleaned = content.trim();
    // Remove markdown code fences if the model adds them
    if (cleaned.startsWith("```")) {
        cleaned = cleaned
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();
    }
    let parsed;
    try {
        parsed = JSON.parse(cleaned);
    }
    catch {
        console.error("\n===== INVALID LLM RESPONSE =====");
        console.error(content);
        console.error("================================\n");
        throw new Error("LLM returned invalid JSON.");
    }
    const result = analysisResultSchema.safeParse(parsed);
    if (!result.success) {
        throw new Error(`LLM response failed schema validation: ${result.error.message}`);
    }
    return result.data;
}
//# sourceMappingURL=analyzer.js.map