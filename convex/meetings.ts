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

export const assignChair = mutation({
    args: {
        patientId: v.id("users"),
        chairId: v.optional(v.string()) // null to unassign
    },
    handler: async (ctx, args) => {
        // Find today's meeting for this patient
        const today = new Date().toISOString().split('T')[0];

        // We look for a meeting created today
        // Ideally we'd have a better date query but for now let's scan recent
        const meetings = await ctx.db
            .query("meetings")
            .withIndex("by_patient_date", (q) => q.eq("patientId", args.patientId))
            .order("desc")
            .take(5);

        const meetingToday = meetings.find(m => m.date.startsWith(today));

        if (meetingToday) {
            await ctx.db.patch(meetingToday._id, { chairId: args.chairId });
        } else if (args.chairId) {
            // Create new meeting if assigning to chair and none exists
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
        // 1. Get all patients who are marked as present
        // Note: In a large production app, we should add an index on 'present'
        const presentPatients = await ctx.db
            .query("patients")
            .filter((q) => q.eq(q.field("present"), true))
            .collect();

        // 2. Fetch user details and latest meeting for each present patient
        const queue = await Promise.all(
            presentPatients.map(async (patientData) => {
                const userId = patientData.userId;
                if (!userId) return null;

                const user = await ctx.db.get(userId);
                if (!user) return null;

                // Find the latest meeting for this patient (today or most recent)
                // We'll simplisticly take the most recent one created
                const lastMeeting = await ctx.db
                    .query("meetings")
                    .withIndex("by_patient_date", (q) => q.eq("patientId", userId))
                    .order("desc")
                    .first();

                // Start of today for filtering if strictly needed, but if they are present, 
                // we probably want to show their relevant meeting regardless or create one.
                // For now, let's attach the last meeting if it looks relevant (e.g. status scheduled)

                return {
                    ...user,
                    ...patientData,
                    _id: userId, // Use user ID as main ID for frontend consistency
                    meetingToday: lastMeeting
                };
            })
        );

        return queue.filter((p) => p !== null);
    },
});

export const getDailyChairs = query({
    args: {},
    handler: async (ctx) => {
        // Get all meetings from today (or very recent) that have a chair Assigned
        // In a real app, filtering by date would be more precise with an index
        const meetings = await ctx.db
            .query("meetings")
            .order("desc")
            .take(100); // Reasonable limit for now

        const today = new Date().toISOString().split('T')[0];

        const activeMeetings = meetings.filter(m =>
            m.date.startsWith(today) &&
            m.chairId !== undefined &&
            m.chairId !== null
        );

        // Fetch user details for these meetings
        const chairsWithPatients = await Promise.all(
            activeMeetings.map(async (m) => {
                if (!m.patientId) return null;
                const user = await ctx.db.get(m.patientId);
                const patientData = await ctx.db
                    .query("patients")
                    .withIndex("by_user", (q) => q.eq("userId", m.patientId!))
                    .unique();

                if (!user) return null;

                return {
                    chairId: m.chairId, // "0", "1", etc. (index as string)
                    patient: {
                        _id: user._id,
                        id: user._id,
                        name: user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : "Unknown",
                        priority: patientData?.priority || "stable",
                        alert: patientData?.alert,
                        chairNumber: String(Number(m.chairId) + 1).padStart(2, "0")
                    }
                };
            })
        );

        return chairsWithPatients.filter(Boolean);
    }
});
