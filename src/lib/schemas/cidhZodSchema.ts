import { z } from "zod";

const accessSchema = z.object({
    active: z.boolean().default(false),
    date: z.string().optional(),
    unknownDate: z.boolean().default(false),
});

const symptomSchema = z.object({
    active: z.boolean().default(false),
    start: z.string().optional(),
    char: z.string().optional(),
    desc: z.string().optional(),
});

export const cidhZodSchema = z.object({
    access: z.object({
        fistula: accessSchema,
        graft: accessSchema,
        permCatheter: accessSchema,
        tempCatheter: accessSchema,
    }),
    nursing: z.object({
        fever: z.boolean().default(false),
        chills: z.boolean().default(false),
        cough: z.boolean().default(false),
        hypotension: z.boolean().default(false),
        pus: z.boolean().default(false),
        cellulitis: z.boolean().default(false),
        wound: z.boolean().default(false),
        other: z.string().optional(),
    }),
    // Simplified for brevity, extend as needed based on original model
    medical: z.object({
        symptoms: z.object({
            general: symptomSchema,
            fever: symptomSchema,
            cough: symptomSchema,
            sputum: symptomSchema,
            dyspnea: symptomSchema,
            sweats: symptomSchema,
            upperResp: symptomSchema,
            other: symptomSchema
        }),
        diagnosis: z.object({
            vascularInfection: z.boolean().default(false),
            pneumonia: z.boolean().default(false),
            cellulitis: z.boolean().default(false),
            uti: z.boolean().default(false),
            cold: z.boolean().default(false),
            tb: z.boolean().default(false),
            diabeticFoot: z.boolean().default(false),
            other: z.string().optional()
        }),
        tests: z.object({
            bloodCulture: z.boolean().default(false),
            urineCulture: z.boolean().default(false),
            hemogram: z.boolean().default(false),
            other: z.string().optional()
        }),
        referral: z.object({
            sent: z.boolean().default(false),
            where: z.string().optional()
        })
    }),
    followUp: z.object({
        date: z.string().optional(),
        hospitalized: z.boolean().default(false),
        result: z.object({
            hemoculture: z.boolean().default(false),
            positive: z.boolean().default(false),
            negative: z.boolean().default(false),
            pathogen: z.object({
                staphAureus: z.boolean().default(false),
                other: z.string().optional()
            }),
            sensitivity: z.object({
                vancomycin: z.boolean().default(false),
                other: z.string().optional()
            }),

        }),
        treatmentStart: z.object({
            ivVancomycin: z.boolean().default(false),
            dose: z.string().optional(),
            everyXDays: z.string().optional()

        }),
        outcomes: z.object({
            completed: z.enum(["SI", "NO"]).optional().nullable(),
            abandoned: z.enum(["SI", "NO"]).optional().nullable(),
            whyAbandoned: z.string().optional(),
            continuingFever: z.enum(["SI", "NO"]).optional().nullable(),
            referredAgain: z.enum(["SI", "NO"]).optional().nullable(),
            finalComment: z.string().optional()
        }),
        logs: z.array(z.object({
            date: z.string().optional(),
            patientBrought: z.boolean().default(false),
            doseIndicated: z.string().optional(),
            doseAdmin: z.string().optional(),
            route: z.string().optional(),
            comment: z.string().optional()
        })).default([])
    }),
    updatedAt: z.string().optional(),
});
