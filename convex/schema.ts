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

        // Patient specific fields
        dateOfBirth: v.optional(v.string()), // ISO date string
        gender: v.optional(v.string()),
        dryWeight: v.optional(v.number()),
        code: v.optional(v.string()), // e.g. "PT-123"
        alerts: v.optional(v.array(v.string())),
        currentAccess: v.optional(
            v.object({
                type: v.string(),
                location: v.string(),
            })
        ),
    }).index("by_token", ["tokenIdentifier"]),

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
