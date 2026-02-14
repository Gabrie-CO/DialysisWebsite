import { mutation } from "./_generated/server";
import { v } from "convex/values";

const MOCK_PATIENTS = [
    {
        name: "Juan Perez",
        priority: "critical",
        alert: "Blood pressure drop detected",
    },
    {
        name: "Maria Garcia",
        priority: "warning",
        alert: "Treatment time exceeded",
    },
    {
        name: "Carlos Rodriguez",
        priority: "stable",
        alert: null,
    },
    {
        name: "Ana Martinez",
        priority: "stable",
        alert: null,
    },
    {
        name: "Luis Hernandez",
        priority: "stable",
        alert: null,
    },
    {
        name: "Elena Gomez",
        priority: "stable",
        alert: null,
    },
    {
        name: "Miguel Torres",
        priority: "warning",
        alert: "High heart rate",
    },
    {
        name: "Sofia Ramirez",
        priority: "stable",
        alert: null,
    },
    {
        name: "Diego Lopez",
        priority: "critical",
        alert: "Low saturation",
    },
    {
        name: "Lucia Fernandez",
        priority: "stable",
        alert: null,
    },
];

export const seedPatients = mutation({
    args: {},
    handler: async (ctx) => {
        for (const patient of MOCK_PATIENTS) {
            // Create a fake email for the user
            const email = `${patient.name.toLowerCase().replace(" ", ".")}@example.com`;

            // Check if user exists
            const existingUser = await ctx.db
                .query("users")
                .withIndex("by_token", (q) => q.eq("tokenIdentifier", email))
                .unique();

            let userId;

            if (!existingUser) {
                userId = await ctx.db.insert("users", {
                    email: email,
                    tokenIdentifier: email,
                    role: "patient",
                    firstName: patient.name.split(" ")[0],
                    lastName: patient.name.split(" ")[1],
                });
            } else {
                userId = existingUser._id;
            }

            // Check if patient record exists
            const existingPatient = await ctx.db
                .query("patients")
                .withIndex("by_user", (q) => q.eq("userId", userId))
                .unique();

            if (existingPatient) {
                await ctx.db.patch(existingPatient._id, {
                    priority: patient.priority,
                    alert: patient.alert || undefined,
                });
            } else {
                await ctx.db.insert("patients", {
                    userId: userId,
                    priority: patient.priority,
                    alert: patient.alert || undefined,
                });
            }
        }
        return "Seeding complete!";
    },
});
