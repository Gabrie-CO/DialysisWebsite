import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
    args: {
        patientId: v.id("users"),
        month: v.string(),
        year: v.number(),
        type: v.string(),
        data: v.any(),
    },
    handler: async (ctx, args) => {
        // Check if assessment already exists for this month/year/type
        const existing = await ctx.db
            .query("monthlyAssessments")
            .withIndex("by_patient_month", (q) =>
                q
                    .eq("patientId", args.patientId)
                    .eq("month", args.month)
                    .eq("year", args.year)
            )
            .filter((q) => q.eq(q.field("type"), args.type))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { data: args.data });
            return existing._id;
        } else {
            const id = await ctx.db.insert("monthlyAssessments", {
                patientId: args.patientId,
                month: args.month,
                year: args.year,
                type: args.type,
                data: args.data,
            });
            return id;
        }
    },
});

export const get = query({
    args: {
        patientId: v.id("users"),
        month: v.string(),
        year: v.number(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("monthlyAssessments")
            .withIndex("by_patient_month", (q) =>
                q
                    .eq("patientId", args.patientId)
                    .eq("month", args.month)
                    .eq("year", args.year)
            )
            .filter((q) => q.eq(q.field("type"), args.type))
            .first();
    },
});
