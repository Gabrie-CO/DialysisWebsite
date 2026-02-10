import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        // In a real app, you might only return patients if the user is an admin/doctor
        const users = await ctx.db.query("users").collect();
        // Filter by role "patient" if strictly needed, or return all for now
        return users.filter((u) => u.role === "patient");
    },
});

export const getById = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        // Simple client-side filtering on server for now since full-text search requires more setup
        const users = await ctx.db.query("users").collect();
        const q = args.query.toLowerCase();
        return users.filter(
            (u) =>
                u.role === "patient" &&
                ((u.firstName && u.firstName.toLowerCase().includes(q)) ||
                    (u.lastName && u.lastName.toLowerCase().includes(q)) ||
                    (u.code && u.code.toLowerCase().includes(q)))
        );
    },
});

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
        await ctx.db.patch(args.patientId, {
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
        await ctx.db.patch(args.patientId, {
            fichas: args.fichasData, // Fichas is a record, handling updatedAt might be tricky within the record. Skipping for now as user asked for forms.
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
        await ctx.db.patch(args.patientId, {
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
        await ctx.db.patch(args.patientId, {
            clinicalHistory: { ...args.clinicalHistoryData, updatedAt: new Date().toISOString() },
        });
    },
});

export const updateCIDH = mutation({
    args: { patientId: v.id("users"), cidhData: v.any() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.patientId, { cidh: { ...args.cidhData, updatedAt: new Date().toISOString() } });
    },
});

export const updateClinicHistoryOld = mutation({
    args: { patientId: v.id("users"), data: v.any() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.patientId, { clinicHistoryOld: { ...args.data, updatedAt: new Date().toISOString() } });
    },
});

export const updateFistula = mutation({
    args: { patientId: v.id("users"), data: v.any() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.patientId, { fistula: { ...args.data, updatedAt: new Date().toISOString() } });
    },
});

export const updateHemodialysis = mutation({
    args: { patientId: v.id("users"), data: v.any() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.patientId, { hemodialysis: { ...args.data, updatedAt: new Date().toISOString() } });
    },
});

export const updateMedicationSheet = mutation({
    args: { patientId: v.id("users"), data: v.any() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.patientId, { medicationSheet: { ...args.data, updatedAt: new Date().toISOString() } });
    },
});

export const updateExamControls = mutation({
    args: { patientId: v.id("users"), data: v.any() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.patientId, { examControls: { ...args.data, updatedAt: new Date().toISOString() } });
    },
});

export const updateMonthlyProgress = mutation({
    args: { patientId: v.id("users"), data: v.any() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.patientId, { monthlyProgress: { ...args.data, updatedAt: new Date().toISOString() } });
    },
});
