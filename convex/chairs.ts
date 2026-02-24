
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("chairs").collect();
    },
});

export const getByChairId = query({
    args: { chairId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("chairs")
            .withIndex("by_chairId", (q) => q.eq("chairId", args.chairId))
            .first();
    },
});

export const startCleaning = mutation({
    args: {
        chairId: v.string(),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("chairs")
            .withIndex("by_chairId", (q) => q.eq("chairId", args.chairId))
            .first();

        const now = new Date().toISOString();

        if (existing) {
            await ctx.db.patch(existing._id, {
                status: "cleaning",
                startTime: now,
                endTime: undefined, // Reset end time
                notes: args.notes,
            });
        } else {
            await ctx.db.insert("chairs", {
                chairId: args.chairId,
                status: "cleaning",
                startTime: now,
                notes: args.notes,
            });
        }
    },
});

export const finishCleaning = mutation({
    args: {
        chairId: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("chairs")
            .withIndex("by_chairId", (q) => q.eq("chairId", args.chairId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                status: "available",
                endTime: new Date().toISOString(),
            });
        }
    },
});

// Helper to reset a chair if needed
export const setStatus = mutation({
    args: {
        chairId: v.string(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("chairs")
            .withIndex("by_chairId", (q) => q.eq("chairId", args.chairId))
            .first();

        const now = new Date().toISOString();

        if (existing) {
            await ctx.db.patch(existing._id, {
                status: args.status,
                startTime: now,
            });
        } else {
            await ctx.db.insert("chairs", {
                chairId: args.chairId,
                status: args.status,
                startTime: now,
            });
        }
    }
})
