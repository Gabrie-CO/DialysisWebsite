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
                    block: patient.block,
                });
            } else {
                await ctx.db.insert("patients", {
                    userId: userId,
                    priority: patient.priority,
                    alert: patient.alert || undefined,
                    block: patient.block,
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
        const todayDate = now.toISOString().split("T")[0]; // YYYY-MM-DD

        let count = 0;
        let historyCount = 0;
        let activeChairs: { chairId: string, patientId: import("./_generated/dataModel").Id<"users"> }[] = [];

        // Distribute patients by block
        const block1 = patients.filter(p => p.block === 1);
        const block2 = patients.filter(p => p.block === 2);
        const block3 = patients.filter(p => p.block === 3);

        // Presence Logic: 
        // Block 1: First 3 present, rest absent
        // Block 2: First 4 present, rest absent
        // Block 3: First 2 present, rest absent
        // Presence Logic: Everyone starts in the queue (no one in a chair)
        const presentPatients: any[] = [];

        let chairCounter = 1;

        for (const patient of patients) {
            const isPresent = presentPatients.some(p => p._id === patient._id);

            // Mark presence in the patient record so the queue query picks them up
            await ctx.db.patch(patient._id, { present: isPresent });

            // 1. Check if meeting exists for today
            const existingMeeting = await ctx.db
                .query("meetings")
                .withIndex("by_patient_date", (q) => q.eq("patientId", patient.userId).eq("date", todayDate))
                .first();

            let chairIdForPatient: string | undefined = undefined;
            if (isPresent) {
                chairIdForPatient = chairCounter.toString();
                activeChairs.push({
                    chairId: chairIdForPatient,
                    patientId: patient.userId,
                });
                chairCounter++;
                if (chairCounter > 12) chairCounter = 1; // reset if overflowing max chairs
            }

            if (!existingMeeting) {
                await ctx.db.insert("meetings", {
                    patientId: patient.userId,
                    date: todayDate,
                    status: isPresent ? "active" : "scheduled",
                    title: "Scheduled Dialysis",
                    condition: "Stable",
                    chairId: chairIdForPatient,
                    block: patient.block,
                    clinicId: clinic._id,
                    weight: isPresent ? { pre: "75.2", post: "73.5" } : undefined
                });
                count++;
            } else {
                await ctx.db.patch(existingMeeting._id, {
                    status: isPresent ? "active" : "scheduled",
                    chairId: chairIdForPatient,
                    block: patient.block,
                    clinicId: clinic._id,
                });
            }

            // 2. Historical meeting clearing or seeding (preventing too much garbage)
            const recentCount = await ctx.db
                .query("meetings")
                .withIndex("by_patient_date", (q) => q.eq("patientId", patient.userId))
                // .filter(q => q.neq(q.field("type"), "pinned_item")) // type field removed from meetings
                .collect();

            if (recentCount.length < 5) {
                for (let i = 1; i <= 4; i++) {
                    const pastDate = new Date();
                    pastDate.setDate(now.getDate() - (i * 2));
                    await ctx.db.insert("meetings", {
                        patientId: patient.userId,
                        date: pastDate.toISOString(),
                        status: "completed",
                        title: "Completed Dialysis",
                        condition: "Stable",
                        chairId: (Math.floor(Math.random() * 10) + 1).toString(),
                        block: patient.block,
                        clinicId: clinic._id,
                        weight: { pre: "76.0", post: "74.2" },
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
                    historyCount++;
                }


            }

            // Ensure patient is marked as present
            if (!patient.present) {
                await ctx.db.patch(patient._id, { present: true });
            }
        }

        return `Seeded ${count} meetings for today, ${historyCount} historical meetings, and pinned items for patients.`;
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
                    block: patientMock.block,
                    priority: patientMock.priority,
                    alert: patientMock.alert || undefined
                });
            } else {
                await ctx.db.insert("patients", {
                    userId,
                    present: true,
                    block: patientMock.block,
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
                    title: "Scheduled Dialysis",
                    condition: "Stable",
                    chairId: undefined,
                    weight: { pre: "0", post: "0" }
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
                    block: patientMock.block,
                    priority: patientMock.priority,
                    alert: patientMock.alert || undefined
                });
            } else {
                await ctx.db.insert("patients", {
                    userId,
                    present: true,
                    block: patientMock.block,
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
                    title: "Scheduled Dialysis",
                    condition: "Stable",
                    chairId: undefined,
                    weight: { pre: "0", post: "0" }
                });
                count++;
            }
        }

        return `Successfully ran seedAll: Created/Updated ${MOCK_PATIENTS_WITH_BLOCKS.length} patients and their meetings.`;
    },
});
