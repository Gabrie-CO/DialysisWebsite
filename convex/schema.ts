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
        condition: v.optional(v.string()), // critical, warning, stable (sync with priority if needed, but keeping separate for form)

        // Critical Info Form Fields
        bodyWeight: v.optional(v.number()),
        preWeight: v.optional(v.number()),
        infected: v.optional(v.boolean()),
        preExistingConditions: v.optional(v.string()),
        treatmentType: v.optional(v.string()),
        observations: v.optional(v.string()),

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
        criticalInfo: v.optional(v.object({
            elderly80_90: v.boolean(),
            malnutrition: v.boolean(),
            preservedDiuresis: v.boolean(),
            time: v.string(),
            qd: v.string(),
            bodyWeight: v.number(),
            preWeight: v.optional(v.number()),
            condition: v.string(),
            infected: v.boolean(),
            preExistingConditions: v.string(),
            treatmentType: v.string(),
            observations: v.optional(v.string()),
            updatedAt: v.optional(v.string()),
        })),
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
        generalInfo: v.optional(v.object({
            name: v.string(),
            age: v.string(),
            sex: v.string(),
            civilStatus: v.string(),
            occupation: v.string(),
            birthPlace: v.string(),
            birthDate: v.string(),
            residence: v.string(),
            phone: v.string(),
            updatedAt: v.optional(v.string()),
        })),
        pinnedSections: v.optional(v.array(v.string())), // List of pinned section IDs
        block: v.optional(v.number()), // Shift/Block the patient belongs to
        present: v.optional(v.boolean()), // Whether the patient is currently in the queue/clinic
    }).index("by_user", ["userId"]),

    forms: defineTable({
        patientId: v.id("users"),
        type: v.union(
            v.literal("cidh"),
            v.literal("clinicHistoryOld"),
            v.literal("fistula"),
            v.literal("hemodialysis"),
            v.literal("medicationSheet"),
            v.literal("examControls"),
            v.literal("monthlyProgress")
        ),
        data: v.any(),
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
        title: v.string(),
        patientId: v.optional(v.id("users")), // Made optional to support legacy/empty meetings
        chairId: v.optional(v.string()), // Store chair number/ID
        weight: v.optional(v.object({ pre: v.string(), post: v.string() })),
        condition: v.optional(v.string()), // e.g. "Stable", "Critical"
        block: v.optional(v.number()), // Indicates what block they attended
        clinicId: v.optional(v.id("clinics")), // Indicates which hospital they are in
        clinicName: v.optional(v.string()),
        schedule: v.optional(v.string()),
        shift: v.optional(v.string()),
        type: v.optional(v.string()),
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
});
