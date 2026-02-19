import { z } from "zod";

export const clinicHistorySchema = z.object({
    general: z.object({
        name: z.string().default(""),
        occupation: z.string().default(""),
        date: z.string().default(""),
    }),
    history: z.object({
        ageRange: z.string().default(""),
        sex: z.string().default(""),
        comorbidities: z.object({
            hta: z.boolean().default(false),
            dm2: z.boolean().default(false),
            cardiopathy: z.boolean().default(false),
            other: z.string().default(""),
        }),
        timeInHd: z.string().default(""),
        accessType: z.object({
            favAutologous: z.boolean().default(false),
            favProsthetic: z.boolean().default(false),
            cvcPermanent: z.boolean().default(false),
            cvcTemporal: z.boolean().default(false),
            other: z.string().default(""),
        }),
        placementDate: z.object({
            exact: z.string().default(""),
            approx: z.string().default(""),
            dontRemember: z.boolean().default(false),
        }),
        location: z.object({
            radioCephalicL: z.boolean().default(false),
            radioCephalicR: z.boolean().default(false),
            brachialL: z.boolean().default(false),
            brachialR: z.boolean().default(false),
            subclavianL: z.boolean().default(false),
            subclavianR: z.boolean().default(false),
            femoralL: z.boolean().default(false),
            femoralR: z.boolean().default(false),
            jugularL: z.boolean().default(false),
            jugularR: z.boolean().default(false),
        }),
        functionality: z.object({
            arterial: z.boolean().default(false),
            venous: z.boolean().default(false),
            both: z.boolean().default(false),
        }),
        dysfunction: z.object({
            mechanicalObstruction: z.object({
                active: z.boolean().default(false),
                type: z.enum(["partial", "total"]).nullable().default(null),
            }),
            clots: z.boolean().default(false),
            fibrin: z.boolean().default(false),
            kinking: z.boolean().default(false),
            other: z.string().default(""),
        }),
        seals: z.object({
            heparin: z.boolean().default(false),
            duralock: z.boolean().default(false),
        }),
        thrombolysis: z.object({
            active: z.boolean().nullable().default(null),
            count: z.string().default(""),
            timeAgo: z.string().default(""),
        }),
        previousAV: z.string().default(""),
        previousLocation: z.object({
            femoral: z.boolean().default(false),
            jugular: z.boolean().default(false),
            subclavian: z.boolean().default(false),
            fav: z.boolean().default(false),
        }),
    }),
    physicalExam: z.object({
        inspection: z.object({
            skinIntact: z.boolean().default(false),
            hematoma: z.boolean().default(false),
            shinySkin: z.boolean().default(false),
            ecchymosis: z.boolean().default(false),
            redness: z.boolean().default(false),
            collaterals: z.boolean().default(false),
            flatSpots: z.boolean().default(false),
            edema: z.boolean().default(false),
            cyanosis: z.boolean().default(false),
            aneurysms: z.boolean().default(false),
        }),
        palpation: z.object({
            tempChanges: z.boolean().default(false),
            thrillSoft: z.boolean().default(false),
            thrillPulsatile: z.boolean().default(false),
        }),
        auscultation: z.object({
            murmurSoft: z.boolean().default(false),
            murmurPathological: z.boolean().default(false),
        }),
        matureCharacteristics: z.object({
            hemostasisTime: z.enum(["5-10", ">10"]).nullable().default(null),
            stenosis: z.boolean().nullable().default(null),
            aneurysms: z.enum(["1", "2", ">3"]).nullable().default(null),
            stealSyndrome: z.boolean().nullable().default(null),
            tortuous: z.boolean().nullable().default(null),
            thrombosis: z.object({
                active: z.boolean().default(false),
                type: z.enum(["partial", "total"]).nullable().default(null),
                observation: z.string().default(""),
            }),
            siteRotation: z.boolean().nullable().default(null),
        }),
        observations: z.string().default(""),
    }),
    followUp: z
        .array(
            z.object({
                date: z.string().default(""),
                obs: z.string().default(""),
            }),
        )
        .default([]),
    updatedAt: z.string().optional(),
});

export type ClinicHistorySchema = typeof clinicHistorySchema;
