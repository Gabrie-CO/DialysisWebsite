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
        present: v.optional(v.boolean()), // Whether the patient is currently in the queue/clinic
    }).index("by_user", ["userId"]),

    forms: defineTable({
        patientId: v.id("users"),
        type: v.string(), // "generalInfo", "clinicalHistory", "criticalInfo", etc.
        data: v.any(), // Flexible JSON storage for form data
        updatedAt: v.string(),
    })
        .index("by_patient", ["patientId"])
        .index("by_patient_type", ["patientId", "type"]),

    monthlyAssessments: defineTable({
        patientId: v.id("users"),
        month: v.string(),
        year: v.number(),
        type: v.string(), // e.g. "patientCard"
        data: v.any(), // Flexible JSON storage for form data
    })
        .index("by_patient_month", ["patientId", "month", "year"])
        .index("by_patient_type", ["patientId", "type"]),

    clinics: defineTable({
        name: v.string(),
        address: v.optional(v.string()),
        settings: v.optional(v.any()),
        activeChairs: v.array(
            v.object({
                chairId: v.string(),
                patientId: v.id("users"),
            })
        ),
    }),

    meetings: defineTable({
        date: v.string(),
        status: v.string(),
        patientId: v.optional(v.id("users")), // Made optional to support legacy/empty meetings
        chairId: v.optional(v.string()),
        condition: v.optional(v.string()),
        block: v.optional(v.number()), // Indicates what block they attended
        clinicId: v.optional(v.id("clinics")), // Indicates which hospital they are in
        schedule: v.optional(v.string()),
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
    }).index("by_patient_date", ["patientId", "date"])
        .index("by_date", ["date"]),

    chairs: defineTable({
        chairId: v.string(), // "1", "2", ... "12"
        status: v.string(), // "cleaning", "occupied", "available" (though occupied is derived from meetings usually)
        startTime: v.string(), // ISO date
        endTime: v.optional(v.string()), // ISO date
        notes: v.optional(v.string()),
    }).index("by_chairId", ["chairId"]),
});
