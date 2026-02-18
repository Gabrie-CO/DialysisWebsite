import { z } from "zod";

export const criticalInfoSchema = z.object({
    bodyWeight: z.number().min(0).default(0),
    preWeight: z.number().min(0).default(0),
    condition: z.enum(["stable", "warning", "critical"]).default("stable"),
    infected: z.boolean().default(false),
    preExistingConditions: z.string().default(""), // Comma separated string
    treatmentType: z.string().default(""),
    observations: z.string().default(""),
    updatedAt: z.string().optional(),
});

export type CriticalInfoSchema = typeof criticalInfoSchema;
