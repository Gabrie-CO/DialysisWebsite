import { z } from "zod";

export const generalInfoSchema = z.object({
    name: z.string().default(""),
    age: z.string().default(""),
    sex: z.string().default(""),
    civilStatus: z.string().default(""),
    occupation: z.string().default(""),
    birthPlace: z.string().default(""),
    birthDate: z.string().default(""),
    residence: z.string().default(""),
    phone: z.string().default(""),
    updatedAt: z.string().optional(),
});

export type GeneralInfoSchema = typeof generalInfoSchema;
