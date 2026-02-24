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
        clinicName: v.optional(v.string()),
        schedule: v.optional(v.string()),
        shift: v.optional(v.string()),
        type: v.optional(v.string()),
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
            clinicName: args.clinicName,
            schedule: args.schedule,
            shift: args.shift,
            type: args.type,
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
        // 1. Get all patients who are marked as present
        const presentPatients = await ctx.db
            .query("patients")
            .filter((q) => q.eq(q.field("present"), true))
            .collect();

        // 2. Fetch user details and latest meeting for each present patient
        const allPresent = await Promise.all(
            presentPatients.map(async (patientData) => {
                const userId = patientData.userId;
                if (!userId) return null;

                const user = await ctx.db.get(userId);
                if (!user) return null;

                // Find the latest meeting for this patient (today or most recent)
                const lastMeeting = await ctx.db
                    .query("meetings")
                    .withIndex("by_patient_date", (q) => q.eq("patientId", userId))
                    .order("desc")
                    .first();

                const block = patientData.block || 3; // Default to last block if missing

                // Check if they are currently assigned to a chair
                const isAssigned = lastMeeting?.chairId != null;

                return {
                    ...user,
                    ...patientData,
                    _id: userId,
                    meetingToday: lastMeeting,
                    block: block,
                    isAssigned
                };
            })
        );

        const validPatients = allPresent.filter((p) => p !== null && !p.isAssigned);

        // 3. Group by Block
        const blocks = { "1": [], "2": [], "3": [] } as Record<string, typeof validPatients>;

        validPatients.forEach(p => {
            const b = String(p!.block);
            if (blocks[b]) {
                blocks[b].push(p);
            } else {
                // Handle unexpected block names by grouping them in '3' or a default
                blocks["3"].push(p);
            }
        });

        // 4. Find the first block that has waiting patients
        console.log("Queue Status:", {
            totalValid: validPatients.length,
            B1: blocks["1"].length,
            B2: blocks["2"].length,
            B3: blocks["3"].length
        });

        if (blocks["1"].length > 0) {
            console.log("Returning Block 1");
            return blocks["1"];
        }
        if (blocks["2"].length > 0) {
            console.log("Returning Block 2");
            return blocks["2"];
        }
        if (blocks["3"].length > 0) {
            console.log("Returning Block 3");
            return blocks["3"];
        }

        return [];
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
