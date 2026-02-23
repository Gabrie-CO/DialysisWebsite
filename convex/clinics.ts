import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get the default clinic, creating one if it doesn't exist.
export const getDefault = mutation({
    args: {},
    handler: async (ctx) => {
        let clinic = await ctx.db.query("clinics").first();
        if (!clinic) {
            const clinicId = await ctx.db.insert("clinics", {
                name: "Default Clinic",
                address: "123 Main St",
                settings: {},
                activeChairs: [],
            });
            clinic = (await ctx.db.get(clinicId))!;
        }
        return clinic;
    },
});

export const getDailyChairs = query({
    args: {},
    handler: async (ctx) => {
        const clinic = await ctx.db.query("clinics").first();
        if (!clinic) return [];

        const chairs = await Promise.all(
            clinic.activeChairs.map(async (chair) => {
                const user = await ctx.db.get(chair.patientId);
                if (!user) return null;

                const patientData = await ctx.db
                    .query("patients")
                    .withIndex("by_user", (q) => q.eq("userId", chair.patientId))
                    .unique();

                return {
                    chairId: chair.chairId,
                    patient: {
                        ...user,
                        ...(patientData || {}),
                        id: user._id, // match frontend expectation
                        name: (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : "Unknown Patient",
                    }
                };
            })
        );
        return chairs.filter(c => c !== null);
    }
});

export const assignChair = mutation({
    args: {
        patientId: v.id("users"),
        chairId: v.optional(v.string()) // null/undefined to unassign
    },
    handler: async (ctx, args) => {
        let clinic = await ctx.db.query("clinics").first();
        if (!clinic) {
            const clinicId = await ctx.db.insert("clinics", {
                name: "Default Clinic",
                address: "123 Main St",
                settings: {},
                activeChairs: [],
            });
            clinic = (await ctx.db.get(clinicId))!;
        }

        // Remove patient from any existing chair
        let updatedChairs = clinic.activeChairs.filter(c => c.patientId !== args.patientId);

        // If assigning to a new chair
        if (args.chairId) {
            // Remove anyone else in this new chair
            updatedChairs = updatedChairs.filter(c => c.chairId !== args.chairId);
            updatedChairs.push({ chairId: args.chairId, patientId: args.patientId });
        }

        await ctx.db.patch(clinic._id, { activeChairs: updatedChairs });

        // Also update meetings to track history (same as old logic)
        const today = new Date().toISOString().split('T')[0];
        const meetings = await ctx.db
            .query("meetings")
            .withIndex("by_patient_date", (q) => q.eq("patientId", args.patientId))
            .order("desc")
            .take(5);

        const meetingToday = meetings.find(m => m.date.startsWith(today));

        if (meetingToday) {
            await ctx.db.patch(meetingToday._id, { chairId: args.chairId });
        } else if (args.chairId) {
            await ctx.db.insert("meetings", {
                patientId: args.patientId,
                date: new Date().toISOString(),
                status: "in-progress",
                title: "Hemodialysis Session",
                chairId: args.chairId
            });
        }
    }
});
