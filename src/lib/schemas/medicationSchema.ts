import { z } from "zod";

const medicationRowSchema = z.object({
    id: z.number(),
    medication: z.string().default(""),
    date: z.string().default(""),
    route: z.enum(["IV", "VO", "SC", "IM", ""]).default(""),
    indications: z.string().default(""),
    dose: z.string().default(""),
    time: z.string().default(""),
    doctorSign: z.string().default(""),
    nurseSign: z.string().default(""),
});

export const medicationSchema = z.object({
    patientName: z.string().default(""),
    rows: z.array(medicationRowSchema).default([]),
    updatedAt: z.string().optional(),
});

export type MedicationSchema = typeof medicationSchema;
