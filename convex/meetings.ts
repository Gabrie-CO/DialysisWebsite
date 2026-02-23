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
    },
    handler: async (ctx, args) => {
        // Get the 3 most recent dialysis sessions
        const recentSessions = await ctx.db
            .query("meetings")
            .withIndex("by_patient_date", (q) => q.eq("patientId", args.patientId))
            .order("desc")
            .take(3);

        return {
            recentSessions,
        };
    },
});

export const getQueue = query({
    args: {},
    handler: async (ctx) => {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // 1. Get all meetings for today that are active/scheduled
        const todaysMeetings = await ctx.db
            .query("meetings")
            .withIndex("by_date", (q) => q.eq("date", today))
            .filter((q) =>
                q.or(
                    q.eq(q.field("status"), "active"),
                    q.eq(q.field("status"), "scheduled") // or whatever status implies "present"
                )
            )
            .collect();

        // 2. Fetch user details for each patient in today's meetings
        const queue = await Promise.all(
            todaysMeetings.map(async (meeting) => {
                if (!meeting.patientId) return null;

                const user = await ctx.db.get(meeting.patientId);
                if (!user) return null;

                const patientData = await ctx.db
                    .query("patients")
                    .withIndex("by_user", (q) => q.eq("userId", meeting.patientId as import("./_generated/dataModel").Id<"users">))
                    .unique();

                if (!patientData) return null;

                return {
                    ...user,
                    ...patientData,
                    _id: user._id, // Use user ID as main ID for frontend consistency
                    meetingToday: meeting
                };
            })
        );

        return queue.filter((p) => p !== null);
    },
});

export const markPresent = mutation({
    args: {
        patientId: v.id("users"),
        present: v.boolean(),
    },
    handler: async (ctx, args) => {
        const today = new Date().toISOString().split("T")[0];

        const existingMeeting = await ctx.db
            .query("meetings")
            .withIndex("by_patient_date", (q) => q.eq("patientId", args.patientId).eq("date", today))
            .first();

        if (args.present) {
            if (!existingMeeting) {
                // Create a new meeting for today to mark them as present
                await ctx.db.insert("meetings", {
                    patientId: args.patientId,
                    date: today,
                    status: "scheduled", // default status
                    title: "Hemodialysis Session",
                });
            } else if (existingMeeting.status === "cancelled") {
                // Re-activate
                await ctx.db.patch(existingMeeting._id, { status: "scheduled" });
            }
        } else {
            // Un-mark present (cancel or delete the meeting if it was just created)
            if (existingMeeting) {
                await ctx.db.patch(existingMeeting._id, { status: "cancelled" });
            }
        }
    }
});
