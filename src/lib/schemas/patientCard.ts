import { z } from "zod";

export const patientCardSchema = z.object({

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
  updatedAt: z.string().optional(),
});

export type PatientCardSchema = typeof patientCardSchema;
