import { query } from "./_generated/server";

export const debugUser = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        const juan = users.find(u => u.firstName === "Juan" && u.lastName === "Perez");
        if (!juan) return { message: "Juan Perez not found" };

        const meetings = await ctx.db
            .query("meetings")
            .withIndex("by_patient_date", q => q.eq("patientId", juan._id))
            .collect();

        return { juan, meetings };
    }
});
