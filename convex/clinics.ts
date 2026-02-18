import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const DEFAULT_CHAIR_COUNT = 100;

/** Returns all clinics. */
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("clinics").collect();
    },
});

/**
 * Returns the chair count for the default (first) clinic.
 * Falls back to DEFAULT_CHAIR_COUNT (100) if no clinic record exists yet.
 */
export const getDefault = query({
    args: {},
    handler: async (ctx) => {
        const clinic = await ctx.db.query("clinics").first();
        return clinic?.chairCount ?? DEFAULT_CHAIR_COUNT;
    },
});

/**
 * Creates or updates the default clinic's chair count.
 * If no clinic exists, one is created with the given count.
 */
export const upsertDefault = mutation({
    args: {
        name: v.optional(v.string()),
        chairCount: v.number(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("clinics").first();
        if (existing) {
            await ctx.db.patch(existing._id, {
                chairCount: args.chairCount,
                ...(args.name ? { name: args.name } : {}),
            });
            return existing._id;
        } else {
            return await ctx.db.insert("clinics", {
                name: args.name ?? "Default Clinic",
                chairCount: args.chairCount,
            });
        }
    },
});
