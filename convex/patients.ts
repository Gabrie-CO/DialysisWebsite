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
