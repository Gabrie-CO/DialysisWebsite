import { z } from "zod";

export const infectionsSchema = z.object({
    name: z.string().default(""),
    antibiotic: z.string().default(""),
    dose: z.string().default(""),
    route: z.string().default(""),
    pps: z.enum(["negative", "positive"]).nullable().default(null),
    startDate: z.string().default(""),
    endDate: z.string().default(""),
    observations: z.string().default(""),
    updatedAt: z.string().optional(),
});

export type InfectionsSchema = typeof infectionsSchema;
