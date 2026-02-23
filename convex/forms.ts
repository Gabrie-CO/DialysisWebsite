import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Define form types to match exactly what's in schema
const formTypes = v.union(
    v.literal("cidh"),
    v.literal("clinicHistoryOld"),
    v.literal("fistula"),
    v.literal("hemodialysis"),
    v.literal("medicationSheet"),
    v.literal("examControls"),
    v.literal("monthlyProgress")
);

export const getForm = query({
    args: {
        patientId: v.id("users"),
        type: formTypes,
    },
    handler: async (ctx, args) => {
        const form = await ctx.db
            .query("forms")
            .withIndex("by_patient_type", (q) =>
                q.eq("patientId", args.patientId).eq("type", args.type)
            )
            .first();

        return form ? form : null;
    },
});

export const saveForm = mutation({
    args: {
        patientId: v.id("users"),
        type: formTypes,
        data: v.any(),
    },
    handler: async (ctx, args) => {
        const existingForm = await ctx.db
            .query("forms")
            .withIndex("by_patient_type", (q) =>
                q.eq("patientId", args.patientId).eq("type", args.type)
            )
            .first();

        const updatedAt = new Date().toISOString();

        if (existingForm) {
            await ctx.db.patch(existingForm._id, {
                data: args.data,
                updatedAt
            });
            return existingForm._id;
        } else {
            return await ctx.db.insert("forms", {
                patientId: args.patientId,
                type: args.type,
                data: args.data,
                updatedAt
            });
        }
    },
});
