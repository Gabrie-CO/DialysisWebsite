import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update a meeting
export const createOrUpdate = mutation({
    args: {
        patientId: v.id("users"),
        date: v.string(),
        status: v.string(),
        chairId: v.optional(v.string()),
        condition: v.optional(v.string()),
        schedule: v.optional(v.string()),
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
            chairId: args.chairId,
            condition: args.condition,
            schedule: args.schedule,
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
        // Find today's date formatted as YYYY-MM-DD
        const now = new Date();
        // Fallback or explicit today's date assuming server time aligns roughly
        const todayDate = now.toISOString().split("T")[0];

        // 1. Find all meetings for today
        const todayMeetings = await ctx.db
            .query("meetings")
            .withIndex("by_date", (q) => q.eq("date", todayDate))
            .collect();

        // 2. Filter meeting objects that meet Queue requirements:
        //    - Status is "scheduled" or "active"
        //    - Not currently in a chair (no chairId)
        //    - Has a valid block assigned 
        const queueMeetings = todayMeetings.filter(m =>
            (m.status === "scheduled" || m.status === "active") &&
            !m.chairId &&
            m.block !== undefined
        );

        // 3. Fetch user and patient details for those meetings
        const queuePatients = await Promise.all(
            queueMeetings.map(async (meeting) => {
                if (!meeting.patientId) return null;

                const user = await ctx.db.get(meeting.patientId);
                if (!user) return null;

                const patientData = await ctx.db
                    .query("patients")
                    .withIndex("by_user", q => q.eq("userId", meeting.patientId!))
                    .unique();

                if (!patientData) return null;

                return {
                    ...user,
                    ...patientData,
                    _id: meeting.patientId, // Frontend dnd logic expects this to be the userId
                    meetingToday: meeting,
                    block: meeting.block,
                    isAssigned: false
                };
            })
        );

        // 4. Return the entire valid queue array so `+page.svelte` can manage the `activeBlock` slicing
        return queuePatients.filter((p): p is NonNullable<typeof p> => p !== null);
    },
});

export const markPresent = mutation({
    args: {
        patientId: v.id("users"),
        present: v.boolean(),
    },
    handler: async (ctx, args) => {
        const patientData = await ctx.db
            .query("patients")
            .withIndex("by_user", (q) => q.eq("userId", args.patientId))
            .unique();

        if (patientData) {
            await ctx.db.patch(patientData._id, { present: args.present });
        }
    }
});
