import { mutation } from "./_generated/server";
import { v } from "convex/values";

const MOCK_PATIENTS = [
    // Block 1
    { name: "Juan Perez", priority: "critical", alert: "Blood pressure drop detected", block: 1 },
    { name: "Maria Garcia", priority: "warning", alert: "Treatment time exceeded", block: 1 },
    { name: "Carlos Rodriguez", priority: "stable", alert: null, block: 1 },
    { name: "Ana Martinez", priority: "stable", alert: null, block: 1 },
    { name: "Luis Hernandez", priority: "stable", alert: null, block: 1 },
    // Block 2
    { name: "Elena Gomez", priority: "stable", alert: null, block: 2 },
    { name: "Miguel Torres", priority: "warning", alert: "High heart rate", block: 2 },
    { name: "Sofia Ramirez", priority: "stable", alert: null, block: 2 },
    { name: "Diego Lopez", priority: "critical", alert: "Low saturation", block: 2 },
    { name: "Lucia Fernandez", priority: "stable", alert: null, block: 2 },
    // Block 3
    { name: "Gabriel Silva", priority: "stable", alert: null, block: 3 },
    { name: "Isabella Castro", priority: "warning", alert: "Missed medication", block: 3 },
    { name: "Mateo Ortiz", priority: "stable", alert: null, block: 3 },
    { name: "Valentina Ruiz", priority: "stable", alert: null, block: 3 },
    { name: "Sebastian Morales", priority: "critical", alert: "Access flow issues", block: 3 },
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

export const seedClinicsAndMeetings = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Get or Create Clinic 1
        let clinic = await ctx.db.query("clinics").first();
        if (!clinic) {
            const clinicId = await ctx.db.insert("clinics", {
                name: "Clinic 1",
                address: "123 Main St",
                settings: {},
                activeChairs: [],
            });
            clinic = (await ctx.db.get(clinicId))!;
        } else if (clinic.name !== "Clinic 1") {
            await ctx.db.patch(clinic._id, { name: "Clinic 1" });
        }

        const patients = await ctx.db.query("patients").collect();
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
        const tomorrowDate = new Date(now);
        tomorrowDate.setDate(now.getDate() + 1);
        const tomorrowStr = tomorrowDate.toISOString().split("T")[0]; // YYYY-MM-DD

        const yesterdayDate = new Date(now);
        yesterdayDate.setDate(now.getDate() - 1);
        const yesterdayStr = yesterdayDate.toISOString().split("T")[0]; // YYYY-MM-DD

        let count = 0;
        let todayQueueCount = 0; // Track how many patients are added to today's queue

        for (const patient of patients) {
            // Give them a past meeting
            const pastMeeting = await ctx.db
                .query("meetings")
                .withIndex("by_patient_date", (q) => q.eq("patientId", patient.userId).eq("date", yesterdayStr))
                .first();

            if (!pastMeeting) {
                await ctx.db.insert("meetings", {
                    patientId: patient.userId,
                    date: yesterdayStr,
                    status: "completed",
                    condition: "Stable",
                    chairId: undefined, // ensure no chair id for past queue
                    clinicId: clinic._id,
                    patientCardData: {
                        elderly80_90: false,
                        malnutrition: false,
                        preservedDiuresis: true,
                        time: "4:00",
                        qd: "500",
                        qb: "300",
                        ktvt: "1.4",
                        filter: "FX80",
                        observations: "Patient responded well to treatment.",
                        signature: "Dr. Smith",
                    }
                });
                count++;
            }

            // Give them a future meeting
            const futureMeeting = await ctx.db
                .query("meetings")
                .withIndex("by_patient_date", (q) => q.eq("patientId", patient.userId).eq("date", tomorrowStr))
                .first();

            if (!futureMeeting) {
                await ctx.db.insert("meetings", {
                    patientId: patient.userId,
                    date: tomorrowStr,
                    status: "scheduled",
                    condition: "Stable",
                    chairId: undefined, // ensure no chair id for future queue
                    clinicId: clinic._id,
                });
                count++;
            }

            // Give 3 patients a meeting for today to place them in the queue
            if (todayQueueCount < 3) {
                const todayMeeting = await ctx.db
                    .query("meetings")
                    .withIndex("by_patient_date", (q) => q.eq("patientId", patient.userId).eq("date", todayStr))
                    .first();

                if (!todayMeeting) {
                    await ctx.db.insert("meetings", {
                        patientId: patient.userId,
                        date: todayStr,
                        status: "scheduled",    // Needs to be active or scheduled to be in queue
                        condition: "Stable",
                        chairId: undefined,     // Ensure NO chair ID is set
                        clinicId: clinic._id,
                        block: 1,               // Queue constraint
                    });
                    count++;
                } else if (todayMeeting.chairId || todayMeeting.block !== 1) {
                    // if they had a chairId previously or wrong block, update to put them back in the queue
                    await ctx.db.patch(todayMeeting._id, { chairId: undefined, status: "scheduled", block: 1 });
                }
                todayQueueCount++;
            }
        }

        return `Seeded ${count} meetings (past, future, and ${todayQueueCount} for today's queue).`;
    },
});

const MOCK_PATIENTS_WITH_BLOCKS = [
    { name: "Juan Perez", priority: "critical", alert: "Blood pressure drop", block: 1 },
    { name: "Maria Garcia", priority: "warning", alert: "Tx time exceeded", block: 1 },
    { name: "Carlos Rodriguez", priority: "stable", alert: null, block: 1 },
    { name: "Ana Martinez", priority: "stable", alert: null, block: 2 },
    { name: "Luis Hernandez", priority: "stable", alert: null, block: 2 },
    { name: "Elena Gomez", priority: "stable", alert: null, block: 2 },
    { name: "Miguel Torres", priority: "warning", alert: "High HR", block: 3 },
    { name: "Sofia Ramirez", priority: "stable", alert: null, block: 3 },
    { name: "Diego Lopez", priority: "critical", alert: "Low sat", block: 3 },
    { name: "Lucia Fernandez", priority: "stable", alert: null, block: 3 },
];

export const seedQueuePatients = mutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date();
        const startOfDay = new Date(new Date(now).setUTCHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(new Date(now).setUTCHours(23, 59, 59, 999)).toISOString();

        let count = 0;

        for (const patientMock of MOCK_PATIENTS_WITH_BLOCKS) {
            // 1. Find or Create User/Patient
            const email = `${patientMock.name.toLowerCase().replace(" ", ".")}@example.com`;
            let user = await ctx.db.query("users").withIndex("by_token", q => q.eq("tokenIdentifier", email)).unique();

            let userId;
            if (!user) {
                userId = await ctx.db.insert("users", {
                    email,
                    tokenIdentifier: email,
                    role: "patient",
                    firstName: patientMock.name.split(" ")[0],
                    lastName: patientMock.name.split(" ")[1],
                });
            } else {
                userId = user._id;
            }

            let patient = await ctx.db.query("patients").withIndex("by_user", q => q.eq("userId", userId)).unique();
            if (patient) {
                await ctx.db.patch(patient._id, {
                    present: true,
                    priority: patientMock.priority,
                    alert: patientMock.alert || undefined
                });
            } else {
                await ctx.db.insert("patients", {
                    userId,
                    present: true,
                    priority: patientMock.priority,
                    alert: patientMock.alert || undefined
                });
            }

            // Seed Critical Info Form
            const criticalInfoData = {
                bodyWeight: 75.5,
                preWeight: 76.2,
                dryWeight: 74.0, // Added dry weight for header display
                condition: patientMock.priority,
                infected: false,
                preExistingConditions: "Hypertension",
                treatmentType: "HD",
                observations: "Stable on arrival.",
                updatedAt: now.toISOString()
            };

            const existingForm = await ctx.db
                .query("forms")
                .withIndex("by_patient_type", (q) => q.eq("patientId", userId).eq("type", "criticalInfo"))
                .unique();

            if (existingForm) {
                await ctx.db.patch(existingForm._id, { data: criticalInfoData, updatedAt: now.toISOString() });
            } else {
                await ctx.db.insert("forms", {
                    patientId: userId,
                    type: "criticalInfo",
                    data: criticalInfoData,
                    updatedAt: now.toISOString()
                });
            }

            // 2. Ensure Meeting Exists (Scheduled, No Chair)
            const existingMeeting = await ctx.db
                .query("meetings")
                .withIndex("by_patient_date", (q) => q.eq("patientId", userId))
                .filter((q) => q.gte(q.field("date"), startOfDay) && q.lte(q.field("date"), endOfDay))
                .first();

            if (existingMeeting) {
                if (existingMeeting.chairId) {
                    await ctx.db.patch(existingMeeting._id, { chairId: undefined });
                    count++;
                }
            } else {
                await ctx.db.insert("meetings", {
                    patientId: userId,
                    date: now.toISOString(),
                    status: "scheduled",
                    condition: "Stable",
                    chairId: undefined,
                });
                count++;
            }
        }

        return `Seeded/Updated ${MOCK_PATIENTS_WITH_BLOCKS.length} patients in Queue (Blocks assigned).`;
    },
});

export const seedAll = mutation({
    args: {},
    handler: async (ctx) => {
        // reuse the logic from seedQueuePatients since it does everything (users, patients, meetings)
        // We can just call the same logic or duplicate it.
        // For clarity and to ensure it works even if we change the other one, I'll duplicate the core logic here
        // but refined for a "Reset/Init" state.

        const now = new Date();
        const startOfDay = new Date(new Date(now).setUTCHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(new Date(now).setUTCHours(23, 59, 59, 999)).toISOString();

        let count = 0;

        for (const patientMock of MOCK_PATIENTS_WITH_BLOCKS) {
            // 1. Find or Create User/Patient
            const email = `${patientMock.name.toLowerCase().replace(" ", ".")}@example.com`;
            let user = await ctx.db.query("users").withIndex("by_token", q => q.eq("tokenIdentifier", email)).unique();

            let userId;
            if (!user) {
                userId = await ctx.db.insert("users", {
                    email,
                    tokenIdentifier: email,
                    role: "patient",
                    firstName: patientMock.name.split(" ")[0],
                    lastName: patientMock.name.split(" ")[1],
                });
            } else {
                userId = user._id;
            }

            let patient = await ctx.db.query("patients").withIndex("by_user", q => q.eq("userId", userId)).unique();
            if (patient) {
                await ctx.db.patch(patient._id, {
                    present: true,
                    priority: patientMock.priority,
                    alert: patientMock.alert || undefined
                });
            } else {
                await ctx.db.insert("patients", {
                    userId,
                    present: true,
                    priority: patientMock.priority,
                    alert: patientMock.alert || undefined
                });
            }

            // Seed Critical Info Form
            const criticalInfoData = {
                bodyWeight: 75.5,
                preWeight: 76.2,
                dryWeight: 74.0, // Added dry weight for header display
                condition: patientMock.priority,
                infected: false,
                preExistingConditions: "Hypertension",
                treatmentType: "HD",
                observations: "Stable on arrival.",
                updatedAt: now.toISOString()
            };

            const existingForm = await ctx.db
                .query("forms")
                .withIndex("by_patient_type", (q) => q.eq("patientId", userId).eq("type", "criticalInfo"))
                .unique();

            if (existingForm) {
                await ctx.db.patch(existingForm._id, { data: criticalInfoData, updatedAt: now.toISOString() });
            } else {
                await ctx.db.insert("forms", {
                    patientId: userId,
                    type: "criticalInfo",
                    data: criticalInfoData,
                    updatedAt: now.toISOString()
                });
            }

            // 2. Ensure Meeting Exists (Scheduled, No Chair)
            const existingMeeting = await ctx.db
                .query("meetings")
                .withIndex("by_patient_date", (q) => q.eq("patientId", userId))
                .filter((q) => q.gte(q.field("date"), startOfDay) && q.lte(q.field("date"), endOfDay))
                .first();

            if (existingMeeting) {
                if (existingMeeting.chairId) {
                    await ctx.db.patch(existingMeeting._id, { chairId: undefined });
                    count++;
                }
            } else {
                await ctx.db.insert("meetings", {
                    patientId: userId,
                    date: now.toISOString(),
                    status: "scheduled",
                    condition: "Stable",
                    chairId: undefined,
                });
                count++;
            }
        }

        return `Successfully ran seedAll: Created/Updated ${MOCK_PATIENTS_WITH_BLOCKS.length} patients and their meetings.`;
    },
});
