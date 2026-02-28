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
        schedule: v.optional(v.string()), // migrated from meetings, but kept here for validation
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
        numChairs: v.number(),
        activeChairs: v.array(
            v.object({
                chairId: v.string(),
                patientId: v.id("users"),
            })
        ),
    }),

    meetings: defineTable({
        block: v.optional(v.float64()),
        chairId: v.optional(v.string()),
        clinicId: v.optional(v.id("clinics")),
        condition: v.optional(v.string()),
        date: v.string(),
        patientId: v.optional(v.id("users")),
        present: v.optional(v.boolean()),
        status: v.string(),
    })
        .index("by_date", ["date"])
        .index("by_patient_date", ["patientId", "date"]),

    chairs: defineTable({
        chairId: v.string(), // "1", "2", ... "12"
        status: v.string(), // "cleaning", "occupied", "available" (though occupied is derived from meetings usually)
        startTime: v.string(), // ISO date
        endTime: v.optional(v.string()), // ISO date
        notes: v.optional(v.string()),
    }).index("by_chairId", ["chairId"]),

    specialistAvailability: defineTable({
        specialistId: v.id("users"),
        dayOfWeek: v.number(),
        startTime: v.string(),
        endTime: v.string(),
    }).index("by_specialist", ["specialistId"]),

    specialistAppointments: defineTable({
        patientId: v.id("users"),
        specialistId: v.id("users"),
        type: v.union(v.literal("nutrition"), v.literal("psychology")),
        startTime: v.string(),
        endTime: v.string(),
        status: v.string(),
        meetingLink: v.optional(v.string()),
    })
        .index("by_specialist_time", ["specialistId", "startTime"])
        .index("by_patient", ["patientId"]),
});
