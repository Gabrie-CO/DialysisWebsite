import { z } from "zod";

export const clinicalHistory2Schema = z.object({
    exp: z.string().default(""),
    date: z.string().default(""),
    startDateHD: z.string().default(""),

    // Demographics
    name: z.string().default(""),
    age: z.string().default(""),
    sex: z.string().default(""),
    civilStatus: z.string().default(""),
    occupation: z.string().default(""),
    birthPlace: z.string().default(""),
    birthDate: z.string().default(""),
    residence: z.string().default(""),
    phone: z.string().default(""),

    // Etiology (ERC-5)
    etiology: z.object({
        diabetes: z.boolean().default(false),
        glomerulonephritis: z.boolean().default(false),
        hypertension: z.boolean().default(false),
        primaryGlomerulo: z.boolean().default(false),
        ischemic: z.boolean().default(false),
        lupus: z.boolean().default(false),
        mesoamerican: z.boolean().default(false),
        erpad: z.boolean().default(false),
        undetermined: z.boolean().default(false),
        obstructive: z.boolean().default(false),
        prostatic: z.boolean().default(false),
        nephrolithiasis: z.boolean().default(false),
        preeclampsia: z.boolean().default(false),
        other: z.boolean().default(false),
        otherText: z.string().default(""),
    }),

    // Dialysis Dosing
    frequency: z.string().default(""),
    sessionTime: z.string().default(""),
    membrane: z.string().default(""),
    anticoagulation: z.string().default(""),
    dryWeight: z.string().default(""),
    heparinDose: z.string().default(""),

    // Vascular Access
    access: z.object({
        tempCatheter: z.boolean().default(false),
        tunneledCatheter: z.boolean().default(false),
        fav: z.boolean().default(false),
        observation: z.string().default(""),
    }),

    // Viral Panel
    viral: z.object({
        hbsag: z.string().default(""),
        acvhc: z.string().default(""),
        vih: z.string().default(""),
        updated: z.boolean().nullable().default(null),
    }),

    // History Text Blocks
    currentIllness: z.string().default(""),
    personalPathology: z.string().default(""),
    familyHistory: z.string().default(""),
    surgicalHistory: z.string().default(""),

    // Physical Exam
    exam: z.object({
        mucosas: z.string().default(""),
        tcs: z.string().default(""),
        respiratory: z.string().default(""),
        fr: z.string().default(""),
        cardiovascular: z.string().default(""),
        ta: z.string().default(""),
        fc: z.string().default(""),
        abdomen: z.string().default(""),
        snc: z.string().default(""),
        residualRenal: z.string().default(""),
        cc: z.string().default(""),
    }),

    // Pharmacology
    meds: z.object({
        erythropoietin: z.string().default(""),
        caco3: z.string().default(""),
        ferrousSulfate: z.string().default(""),
        folicAcid: z.string().default(""),
        other: z.string().default(""),
    }),

    observations: z.string().default(""),

    // Labs
    labs: z.object({
        hb: z.string().default(""),
        hto: z.string().default(""),
        leuco: z.string().default(""),
        plaq: z.string().default(""),
        na: z.string().default(""),
        k: z.string().default(""),
        calcio: z.string().default(""),
        fosforo: z.string().default(""),
        productoPC: z.string().default(""),
        pth: z.string().default(""),
        albumina: z.string().default(""),
        glucosa: z.string().default(""),
    }),

    updatedAt: z.string().optional(),
});

export type ClinicalHistory2Schema = typeof clinicalHistory2Schema;
