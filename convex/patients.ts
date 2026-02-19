import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        const patients = await ctx.db.query("patients").collect();

        const patientsMap = new Map(patients.map((p) => [p.userId, p]));

        return users
            .filter((u) => u.role === "patient")
            .map((u) => {
                const patientData = patientsMap.get(u._id);
                return { ...u, ...patientData, _id: u._id }; // Start with user _id for frontend compatibility
            });
    },
});

export const getById = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id);
        if (!user) return null;

        const patientData = await ctx.db
            .query("patients")
            .withIndex("by_user", (q) => q.eq("userId", args.id))
            .unique();

        return { ...user, ...patientData, _id: user._id };
    },
});

export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        const q = args.query.toLowerCase();

        const matchingUsers = users.filter(
            (u) =>
                u.role === "patient" &&
                ((u.firstName && u.firstName.toLowerCase().includes(q)) ||
                    (u.lastName && u.lastName.toLowerCase().includes(q)))
        );

        // Fetch patient data for matching users to check code
        const results = await Promise.all(
            matchingUsers.map(async (u) => {
                const patientData = await ctx.db
                    .query("patients")
                    .withIndex("by_user", (q) => q.eq("userId", u._id))
                    .unique();

                // Check code match if provided in query
                if (patientData?.code && patientData.code.toLowerCase().includes(q)) {
                    return { ...u, ...patientData, _id: u._id };
                }

                // Return if name matched earlier
                if (u.firstName?.toLowerCase().includes(q) || u.lastName?.toLowerCase().includes(q)) {
                    return { ...u, ...patientData, _id: u._id };
                }

                return null;
            })
        );

        return results.filter((r) => r !== null);
    },
});

// Helper to upsert patient data
async function upsertPatientData(ctx: any, userId: any, data: any) {
    const patientDoc = await ctx.db
        .query("patients")
        .withIndex("by_user", (q: any) => q.eq("userId", userId))
        .unique();

    if (patientDoc) {
        await ctx.db.patch(patientDoc._id, data);
    } else {
        await ctx.db.insert("patients", { userId, ...data });
    }
}

export const updatePatientCard = mutation({
    args: {
        patientId: v.id("users"),
        patientCardData: v.object({
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
        }),
    },
    handler: async (ctx, args) => {
        await upsertPatientData(ctx, args.patientId, {
            patientCard: { ...args.patientCardData, updatedAt: new Date().toISOString() },
        });
    },
});

export const updateFichas = mutation({
    args: {
        patientId: v.id("users"),
        fichasData: v.record(v.string(), v.array(v.number())),
    },
    handler: async (ctx, args) => {
        await upsertPatientData(ctx, args.patientId, {
            fichas: args.fichasData,
        });
    },
});

export const updateInfections = mutation({
    args: {
        patientId: v.id("users"),
        infectionsData: v.object({
            name: v.string(),
            antibiotic: v.string(),
            dose: v.string(),
            route: v.string(),
            pps: v.union(v.literal("negative"), v.literal("positive"), v.null()),
            startDate: v.string(),
            endDate: v.string(),
            observations: v.string(),
            updatedAt: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        await upsertPatientData(ctx, args.patientId, {
            infections: { ...args.infectionsData, updatedAt: new Date().toISOString() },
        });
    },
});

export const updateClinicalHistory = mutation({
    args: {
        patientId: v.id("users"),
        clinicalHistoryData: v.any(),
    },
    handler: async (ctx, args) => {
        await upsertPatientData(ctx, args.patientId, {
            clinicalHistory: { ...args.clinicalHistoryData, updatedAt: new Date().toISOString() },
        });
    },
});

export const updateCIDH = mutation({
    args: { patientId: v.id("users"), cidhData: v.any() },
    handler: async (ctx, args) => {
        await upsertPatientData(ctx, args.patientId, {
            cidh: { ...args.cidhData, updatedAt: new Date().toISOString() },
        });
    },
});

export const updateClinicHistoryOld = mutation({
    args: { patientId: v.id("users"), data: v.any() },
    handler: async (ctx, args) => {
        await upsertPatientData(ctx, args.patientId, {
            clinicHistoryOld: { ...args.data, updatedAt: new Date().toISOString() },
        });
    },
});

export const updateFistula = mutation({
    args: { patientId: v.id("users"), data: v.any() },
    handler: async (ctx, args) => {
        await upsertPatientData(ctx, args.patientId, {
            fistula: { ...args.data, updatedAt: new Date().toISOString() },
        });
    },
});

export const updateHemodialysis = mutation({
    args: { patientId: v.id("users"), data: v.any() },
    handler: async (ctx, args) => {
        await upsertPatientData(ctx, args.patientId, {
            hemodialysis: { ...args.data, updatedAt: new Date().toISOString() },
        });
    },
});

export const updateMedicationSheet = mutation({
    args: { patientId: v.id("users"), data: v.any() },
    handler: async (ctx, args) => {
        await upsertPatientData(ctx, args.patientId, {
            medicationSheet: { ...args.data, updatedAt: new Date().toISOString() },
        });
    },
});

export const updateExamControls = mutation({
    args: { patientId: v.id("users"), data: v.any() },
    handler: async (ctx, args) => {
        await upsertPatientData(ctx, args.patientId, {
            examControls: { ...args.data, updatedAt: new Date().toISOString() },
        });
    },
});

export const updateMonthlyProgress = mutation({
    args: { patientId: v.id("users"), data: v.any() },
    handler: async (ctx, args) => {
        await upsertPatientData(ctx, args.patientId, {
            monthlyProgress: { ...args.data, updatedAt: new Date().toISOString() },
        });
    },
});

export const setPresence = mutation({
    args: {
        patientId: v.id("users"),
        present: v.boolean(),
    },
    handler: async (ctx, args) => {
        await upsertPatientData(ctx, args.patientId, {
            present: args.present,
        });
    },
});

export const togglePin = mutation({
    args: {
        patientId: v.id("users"),
        section: v.string(),
    },
    handler: async (ctx, args) => {
        const patientData = await ctx.db
            .query("patients")
            .withIndex("by_user", (q) => q.eq("userId", args.patientId))
            .unique();

        let pinnedSections = patientData?.pinnedSections || [];

        if (pinnedSections.includes(args.section)) {
            pinnedSections = pinnedSections.filter((s) => s !== args.section);
        } else {
            pinnedSections.push(args.section);
        }

        await upsertPatientData(ctx, args.patientId, {
            pinnedSections,
        });
    },
});

export const updateCriticalInfo = mutation({
    args: {
        patientId: v.id("users"),
        criticalInfo: v.object({
            bodyWeight: v.number(),
            preWeight: v.optional(v.number()),
            condition: v.string(),
            infected: v.boolean(),
            preExistingConditions: v.string(),
            treatmentType: v.string(),
            observations: v.optional(v.string()),
            updatedAt: v.optional(v.string())
        })
    },
    handler: async (ctx, args) => {
        // 1. Sync condition to priority for Dashboard/Clinic Overview
        // Map condition to priority (assuming 1:1 mapping for stable/warning/critical)
        const priority = args.criticalInfo.condition;

        await upsertPatientData(ctx, args.patientId, {
            ...args.criticalInfo,
            priority: priority,
            condition: priority
        });

        // 2. Update or Create Meeting Record for Timeline History ("when they exited")
        const today = new Date().toISOString().split('T')[0];

        // Find existing meeting for today
        const recentMeetings = await ctx.db
            .query("meetings")
            .withIndex("by_patient_date", (q) => q.eq("patientId", args.patientId))
            .order("desc")
            .take(5);

        const meetingToday = recentMeetings.find(m => m.date.startsWith(today));

        const newWeight = {
            pre: args.criticalInfo.preWeight ? String(args.criticalInfo.preWeight) : "",
            post: String(args.criticalInfo.bodyWeight) // Map bodyWeight to post-weight (Dry Weight)
        };

        const newObservations = args.criticalInfo.observations || "";

        if (meetingToday) {
            await ctx.db.patch(meetingToday._id, {
                weight: {
                    pre: newWeight.pre || meetingToday.weight?.pre || "",
                    post: newWeight.post
                },
                condition: priority,
                patientCardData: {
                    ...meetingToday.patientCardData,
                    elderly80_90: meetingToday.patientCardData?.elderly80_90 ?? false,
                    malnutrition: meetingToday.patientCardData?.malnutrition ?? false,
                    preservedDiuresis: meetingToday.patientCardData?.preservedDiuresis ?? false,
                    time: meetingToday.patientCardData?.time ?? "",
                    qd: meetingToday.patientCardData?.qd ?? "",
                    qb: meetingToday.patientCardData?.qb ?? "",
                    ktvt: meetingToday.patientCardData?.ktvt ?? "",
                    filter: meetingToday.patientCardData?.filter ?? "",
                    signature: meetingToday.patientCardData?.signature ?? "",
                    observations: newObservations || meetingToday.patientCardData?.observations || ""
                }
            });
        } else {
            // Create new meeting if none exists for today
            await ctx.db.insert("meetings", {
                patientId: args.patientId,
                date: new Date().toISOString(),
                status: "completed",
                title: "Dialysis Session",
                weight: newWeight,
                condition: priority,
                patientCardData: {
                    elderly80_90: false,
                    malnutrition: false,
                    preservedDiuresis: false,
                    time: "",
                    qd: "",
                    qb: "",
                    ktvt: "",
                    filter: "",
                    signature: "",
                    observations: newObservations
                }
            });
        }
    }
});

export const updateGeneralInfo = mutation({
    args: {
        patientId: v.id("users"),
        generalInfoData: v.object({
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
        }),
    },
    handler: async (ctx, args) => {
        // 1. Update patients table
        await upsertPatientData(ctx, args.patientId, {
            generalInfo: { ...args.generalInfoData, updatedAt: new Date().toISOString() },
        });

        // 2. Sync core fields to users table
        const updates: any = {};
        if (args.generalInfoData.sex) updates.gender = args.generalInfoData.sex;
        if (args.generalInfoData.birthDate) updates.dateOfBirth = args.generalInfoData.birthDate;
        // Optionally sync name -> firstName/lastName, but avoiding for now to prevent overwrite issues

        if (Object.keys(updates).length > 0) {
            await ctx.db.patch(args.patientId, updates);
        }
    },
});
