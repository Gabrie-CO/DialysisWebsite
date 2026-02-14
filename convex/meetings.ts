import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update a meeting
export const createOrUpdate = mutation({
    args: {
        patientId: v.id("users"),
        date: v.string(),
        status: v.string(),
        title: v.string(), // e.g. "Hemodialysis Session"
        chairId: v.optional(v.string()),
        weight: v.optional(v.object({ pre: v.string(), post: v.string() })),
        condition: v.optional(v.string()),
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
    },
    handler: async (ctx, args) => {
        // Check if a meeting already exists for this patient on this date (approximate check)
        // For now, we'll just insert a new one to keep history, or update if we had an ID.
        // Since we don't pass an ID, we'll assume this is always log-only or we could check for one today.

        // Simple implementation: Insert everytime. 
        // In a real app we might want to consolidate same-day sessions.

        const id = await ctx.db.insert("meetings", {
            patientId: args.patientId,
            date: args.date,
            status: args.status,
            title: args.title,
            chairId: args.chairId,
            weight: args.weight,
            condition: args.condition,
            patientCardData: args.patientCardData,
        });
        return id;
    },
});

// Get recent meetings for a patient
export const getRecent = query({
    args: {
        patientId: v.id("users"),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 3;
        const meetings = await ctx.db
            .query("meetings")
            .withIndex("by_patient_date", (q) => q.eq("patientId", args.patientId))
            .order("desc") // Most recent first
            .take(limit);

        return meetings;
    },
});

export const pinItem = mutation({
    args: {
        patientId: v.id("users"),
        title: v.string(),
        data: v.any(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("meetings", {
            patientId: args.patientId,
            date: new Date().toISOString(),
            status: "pinned",
            title: args.title,
            type: "pinned_item",
            pinnedData: args.data,
        });
        return id;
    },
});

export const getQueue = query({
    args: {},
    handler: async (ctx) => {
        const now = new Date();
        const startOfDay = new Date(now.setUTCHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(now.setUTCHours(23, 59, 59, 999)).toISOString();

        // 1. Get all meetings for today
        const meetings = await ctx.db
            .query("meetings")
            .withIndex("by_date", (q) => q.gte("date", startOfDay).lte("date", endOfDay))
            .collect();

        const patientIds = new Set(meetings.map((m) => m.patientId).filter(Boolean));

        // 2. Fetch patient details and check presence
        const queue = await Promise.all(
            Array.from(patientIds).map(async (patientId) => {
                if (!patientId) return null;

                const patientData = await ctx.db
                    .query("patients")
                    .withIndex("by_user", (q) => q.eq("userId", patientId))
                    .unique();

                if (!patientData || !patientData.present) return null;

                const user = await ctx.db.get(patientId);
                return {
                    ...user,
                    ...patientData,
                    _id: patientId, // Use user ID as main ID for frontend consistency
                    meetingToday: meetings.find(m => m.patientId === patientId)
                };
            })
        );

        return queue.filter((p) => p !== null);
    },
});
