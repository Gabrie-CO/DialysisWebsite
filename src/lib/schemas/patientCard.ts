import { z } from "zod";

export const patientCardSchema = z.object({
    date: z.string().default(""),
    name: z.string().default(""),
    age: z.string().default(""),
    weight: z.string().default(""),

    // Checkboxes
    elderly80_90: z.boolean().default(false),
    malnutrition: z.boolean().default(false),
    preservedDiuresis: z.boolean().default(false),

    // Dialysis Params
    time: z.string().default(""),
    qd: z.string().default(""),
    qb: z.string().default(""),
    ktvt: z.string().default(""),
    filter: z.string().default(""),

    observations: z.string().default(""),
    signature: z.string().default(""),
});

export type PatientCardSchema = typeof patientCardSchema;
