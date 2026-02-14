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
        priority: v.optional(v.string()), // critical, warning, stable
        alert: v.optional(v.string()), // Single alert message from dashboard
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

    meetings: defineTable({
        date: v.string(),
        status: v.string(),
        title: v.string(),
        patientId: v.optional(v.id("users")), // Made optional to support legacy/empty meetings
        type: v.optional(v.string()), // "session" | "pinned_item"
        pinnedData: v.optional(v.any()), // Snapshot of data
        chairId: v.optional(v.string()), // Store chair number/ID
        weight: v.optional(v.object({ pre: v.string(), post: v.string() })),
        condition: v.optional(v.string()), // e.g. "Stable", "Critical"
        // Snapshot of patient card at the time of meeting
        patientCardData: v.optional(v.object({
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
        })),
    }).index("by_patient_date", ["patientId", "date"]),
});
