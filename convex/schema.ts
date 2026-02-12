import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        email: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        profilePictureUrl: v.optional(v.string()),
        role: v.optional(
            v.union(
                v.literal("patient"),
                v.literal("admin"),
                v.literal("nutritionist"),
                v.literal("psychologist")
            )
        ),
        tokenIdentifier: v.string(),
        dateOfBirth: v.optional(v.string()), // ISO date string
        gender: v.optional(v.string()),
    }).index("by_token", ["tokenIdentifier"]),

    patients: defineTable({
        userId: v.id("users"), // Link config
        // Patient specific fields
        dryWeight: v.optional(v.number()),
        code: v.optional(v.string()), // e.g. "PT-123"
        alerts: v.optional(v.array(v.string())),
        currentAccess: v.optional(
            v.object({
                type: v.string(),
                location: v.string(),
            })
        ),
        patientCard: v.optional(v.object({
            elderly80_90: v.boolean(),
            malnutrition: v.boolean(),
            preservedDiuresis: v.boolean(),
            time: v.string(),
            qd: v.string(),
            qb: v.string(),
            ktvt: v.string(),
            filter: v.string(),
            observations: v.string(),
            signature: v.string(),
            updatedAt: v.optional(v.string()),
        })),
        // Fichas (Checklists)
        fichas: v.optional(v.record(v.string(), v.array(v.number()))),

        // Infections
        infections: v.optional(v.object({
            name: v.string(),
            antibiotic: v.string(),
            dose: v.string(),
            route: v.string(),
            pps: v.union(v.literal("negative"), v.literal("positive"), v.null()),
            startDate: v.string(),
            endDate: v.string(),
            observations: v.string(),
            updatedAt: v.optional(v.string()),
        })),
        // Clinical History
        clinicalHistory: v.optional(v.any()), // ClinicalHistory2
        // New Forms
        cidh: v.optional(v.any()),
        clinicHistoryOld: v.optional(v.any()), // ClinicHistory.svelte
        fistula: v.optional(v.any()),
        hemodialysis: v.optional(v.any()),
        medicationSheet: v.optional(v.any()),
        examControls: v.optional(v.any()),
        monthlyProgress: v.optional(v.any()),
    }).index("by_user", ["userId"]),

    monthlyAssessments: defineTable({
        patientId: v.id("users"),
        month: v.string(),
        year: v.number(),
        type: v.string(), // e.g. "patientCard"
        data: v.any(), // Flexible JSON storage for form data
    })
        .index("by_patient_month", ["patientId", "month", "year"])
        .index("by_patient_type", ["patientId", "type"]),
});
