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
        return "Patient seeding complete!";
    },
});

export const seedTodayMeetings = mutation({
    args: {},
    handler: async (ctx) => {
        const patients = await ctx.db.query("patients").collect();
        const now = new Date();
        const isoDate = now.toISOString();
        const startOfDay = new Date(now.setUTCHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(now.setUTCHours(23, 59, 59, 999)).toISOString();

        let count = 0;

        for (const patient of patients) {
            // Check if meeting exists for today
            const existingMeeting = await ctx.db
                .query("meetings")
                .withIndex("by_patient_date", (q) => q.eq("patientId", patient.userId))
                .filter((q) => q.gte(q.field("date"), startOfDay) && q.lte(q.field("date"), endOfDay))
                .first();

            if (!existingMeeting) {
                await ctx.db.insert("meetings", {
                    patientId: patient.userId,
                    date: isoDate,
                    status: "scheduled",
                    title: "Scheduled Dialysis",
                    condition: "Stable",
                });
                count++;
            }

            // Ensure patient is marked as present
            if (!patient.present) {
                await ctx.db.patch(patient._id, { present: true });
            }
        }

        return `Seeded ${count} meetings for today and updated presence.`;
    },
});
