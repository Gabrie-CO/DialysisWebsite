import { z } from "zod";

export const fichasSchema = z.object({
    // Map of year (string) -> array of checked IDs (number)
    checklist: z.record(z.string(), z.array(z.number())).default({}),
    updatedAt: z.string().optional(),
});

export type FichasSchema = typeof fichasSchema;
