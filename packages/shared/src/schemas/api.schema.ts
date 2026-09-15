import {z} from "zod";

export const apiErrorSchema = z.object({
    success : z.literal(false),
    
    error : z.object({
        code : z.object(),
        message : z.string(),
    }),
});

export type apiError = z.infer< typeof apiErrorSchema>;