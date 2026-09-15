import {z} from "zod";

// export const resumeUploadMetadataSchema = z.object({
//     fileName : z.string().min(1).max(255),
// });

export const resumeResponseSchema = z.object({
    success : z.literal(true),

    data : z.object({
        id : z.string(),
        fileName : z.string(),
    }),
});

// export type resumeUploadMetadata = z.infer<
//     typeof resumeUploadMetadataSchema
// >;

export type resumeResponse = z.infer<
    typeof resumeResponseSchema
>;