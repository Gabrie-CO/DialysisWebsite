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

                const user = await ctx.db.get(meeting.patientId);
                if (!user) return null;

                // Find the latest meeting for this patient (today or most recent)
                const lastMeeting = await ctx.db
                    .query("meetings")
                    .withIndex("by_patient_date", (q) => q.eq("patientId", userId))
                    .order("desc")
                    .first();

                const block = patientData.block || "3"; // Default to last block if missing

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
            const b = p!.block as string;
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
        const today = new Date().toISOString().split("T")[0];

        const existingMeeting = await ctx.db
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

        // Fetch chair statuses
        const chairStatuses = await ctx.db.query("chairs").collect();
        const cleaningMap = new Map();

        chairStatuses.forEach(c => {
            if (c.status === "cleaning") {
                cleaningMap.set(c.chairId, c);
            }
        });

        // Combine logic: 
        // We need to return an array that the frontend can map to 12 chairs.
        // The frontend currently expects an array of active meetings/assignments.
        // We should enrich this or return a full 12-item array if possible, 
        // but to minimize frontend breakage, let's just piggyback on the existing structure 
        // OR add a new return field. 

        // Let's modify the return to include 'cleaning' chairs as pseudo-patients or a separate list?
        // The frontend iterates `chairs` array (derived from dailyChairsQuery).

        // Let's allow the query to return "cleaning" as a patient-like object with priority="cleaning"
        // This matches how the frontend currently handles local state.

        const combinedResult = [...chairsWithPatients.filter(Boolean)];

        cleaningMap.forEach((chairData, chairId) => {
            // Only add if not already occupied (though it shouldn't be if logic is correct)
            // If a chair is cleaning, it shouldn't have an active meeting ideally.
            // Check if this chairId is already in combinedResult
            const isOccupied = combinedResult.some((item: any) => item.chairId === chairId);

            if (!isOccupied) {
                combinedResult.push({
                    chairId: chairId,
                    patient: {
                        _id: "cleaning-" + chairId,
                        id: "cleaning-" + chairId,
                        name: "Cleaning Required",
                        priority: "cleaning",
                        alert: "Needs disinfection",
                        chairNumber: String(Number(chairId) + 1).padStart(2, "0"),
                        startTime: chairData.startTime // Pass this for "how long"
                    } as any
                });
            }
        });

        return combinedResult;
    }
});
