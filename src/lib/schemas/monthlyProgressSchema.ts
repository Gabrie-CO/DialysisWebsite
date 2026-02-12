import { z } from "zod";

export const monthlyProgressSchema = z.object({
    meta: z.object({
        month: z.string().default(""),
        fileNumber: z.string().default(""),
        doctorSignature: z.string().default(""),
        updatedAt: z.string().optional(),
    }),
    patient: z.object({
        name: z.string().default(""),
        admission: z.object({
            active: z.boolean().nullable().default(null),
            dateIn: z.string().default(""),
            dateOut: z.string().default(""),
        }),
        diagnosis: z.string().default(""),
    }),
    generalStatus: z.object({
        transfusions: z.object({
            active: z.boolean().nullable().default(null),
            count: z.string().default(""),
        }),
        interdialyticGain: z.string().default(""),
        generalState: z.string().default(""),
        appetite: z.string().default(""),
        residualDiuresis: z.object({
            active: z.boolean().nullable().default(null),
            type: z.string().default(""),
        }),
    }),
    comorbidities: z.object({
        hypotension: z.boolean().nullable().default(null),
        hypertension: z.boolean().nullable().default(null),
        pruritus: z.boolean().nullable().default(null),
        precordialPain: z.boolean().nullable().default(null),
        hypoglycemia: z.boolean().nullable().default(null),
        headache: z.boolean().nullable().default(null),
        lumbalgia: z.boolean().nullable().default(null),
        cramps: z.boolean().nullable().default(null),
        nausea: z.boolean().nullable().default(null),
        pyrogenicCrisis: z.boolean().nullable().default(null),
        bacteremia: z.boolean().nullable().default(null),
        treatment: z.string().default(""),
        other: z.string().default(""),
    }),
    access: z.object({
        fav: z.string().default(""),
        cvc: z.string().default(""),
        functionality: z.string().default(""),
        exam: z.string().default(""),
    }),
    dialysisParams: z.object({
        volemia: z.boolean().nullable().default(null),
        anemia: z.boolean().nullable().default(null),
        nutrition: z.boolean().nullable().default(null),
        metabolism: z.boolean().nullable().default(null),
        lipids: z.boolean().nullable().default(null),
        ktv: z.boolean().nullable().default(null),
    }),
    currentTreatment: z.object({
        vitamins: z.string().default(""),
        epo: z.string().default(""),
        iron: z.string().default(""),
        carnitine: z.string().default(""),
        antihypertensives: z.string().default(""),
        others: z.string().default(""),
    }),
    prescription: z.object({
        time: z.string().default(""),
        filter: z.string().default(""),
        buffer: z.string().default(""),
        sodium: z.string().default(""),
        qb: z.string().default(""),
        qd: z.string().default(""),
        dryWeight: z.string().default(""),
        anticoagulation: z.string().default(""),
        conductivity: z.string().default(""),
        ktvTarget: z.string().default(""),
        temperature: z.string().default(""),
    }),
});

export type MonthlyProgressSchema = typeof monthlyProgressSchema;
