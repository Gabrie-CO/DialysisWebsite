
import { query } from "./_generated/server";

export const debugQueue = query({
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

                const lastMeeting = await ctx.db
                    .query("meetings")
                    .withIndex("by_patient_date", (q) => q.eq("patientId", userId))
                    .order("desc")
                    .first();

                const block = patientData.block || "3";
                const isAssigned = lastMeeting?.chairId != null;

                return {
                    name: user.firstName + " " + user.lastName,
                    block: block,
                    originalBlock: patientData.block,
                    isAssigned
                };
            })
        );

        const validPatients = allPresent.filter((p) => p !== null && !p.isAssigned);

        const blocks = { "1": [], "2": [], "3": [] } as Record<string, typeof validPatients>;

        validPatients.forEach(p => {
            const b = p!.block as string;
            if (blocks[b]) {
                blocks[b].push(p);
            } else {
                blocks["3"].push(p);
            }
        });

        return {
            validPatientsCount: validPatients.length,
            validPatients,
            blocks,
            block1Count: blocks["1"].length,
            block2Count: blocks["2"].length,
            block3Count: blocks["3"].length
        };
    },
});
