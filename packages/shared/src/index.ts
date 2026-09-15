export type {
  ResumeDocument,
  PersonalInfo,
  Education,
  Experience,
  Project,
  Skill,
  Certification,
  ParsedResume,
} from "./types/resume.js";

export type { JobDescription } from "./types/job.js";

export type { ResumeAnalysis } from "./types/analysis.js";

// export {resumeUploadMetadataSchema, resumeResponseSchema} from "./schemas/resume.schema.js";
export {resumeResponseSchema} from "./schemas/resume.schema.js";


// export type{resumeUploadMetadata, resumeResponse} from "./schemas/resume.schema.js";
export type{resumeResponse} from "./schemas/resume.schema.js";

export {apiErrorSchema} from "./schemas/api.schema.js";

export type{apiError} from "./schemas/api.schema.js";