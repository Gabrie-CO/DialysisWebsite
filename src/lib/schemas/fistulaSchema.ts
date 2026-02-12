import { z } from "zod";

export const fistulaSchema = z.object({
    patientName: z.string().default(""),
    age: z.string().default(""),
    statusColor: z.enum(["red", "yellow", "green"]).nullable().default(null),
    fistulaType: z.object({
        autologous: z.boolean().default(false),
        prosthetic: z.boolean().default(false),
    }),
    checks: z.object({
        mature: z.object({ active: z.boolean().nullable().default(null) }),
        stenosisYuxta: z.object({ active: z.boolean().nullable().default(null) }),
        accessoryVeins: z.object({ active: z.boolean().nullable().default(null) }),
        stenosisProximal: z.object({ active: z.boolean().nullable().default(null) }),
    }),
    observation: z.string().default(""),
    updatedAt: z.string().optional(),
});

export type FistulaSchema = typeof fistulaSchema;
