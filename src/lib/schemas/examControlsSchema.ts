import { z } from "zod";

const examRowSchema = z.object({
    id: z.string(),
    label: z.string(),
    values: z.record(z.string(), z.string().default("")),
});

export const examControlsSchema = z.object({
    patient: z.object({
        name: z.string().default(""),
        age: z.string().default(""),
        fileNumber: z.string().default(""),
        year: z.string().default(new Date().getFullYear().toString()),
    }),
    serology: z.object({
        hepB: z.enum(["pos", "neg"]).nullable().default(null),
        hepC: z.enum(["pos", "neg"]).nullable().default(null),
        vih: z.enum(["pos", "neg"]).nullable().default(null),
        tb: z.enum(["pos", "neg"]).nullable().default(null),
    }),
    rows: z.array(examRowSchema),
    updatedAt: z.string().optional(),
});

export type ExamControlsSchema = typeof examControlsSchema;
