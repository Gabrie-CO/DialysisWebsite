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

            let chairIdForPatient = undefined;
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
                }
            }

            const existingForm = await ctx.db
                .query("forms")
                .withIndex("by_patient_type", (q) => q.eq("patientId", patient.userId).eq("type", "cidh"))
                .first();

            if (!existingForm) {
                await ctx.db.insert("forms", {
                    patientId: patient.userId,
                    type: "cidh",
                    data: { notes: "Seeded CIDH Form" },
                    updatedAt: now.toISOString()
                });
            }
        }

        // Update active chairs for clinic 1
        await ctx.db.patch(clinic._id, { activeChairs });

        return `Seeded ${patients.length} patients and updated meetings for blocks in Clinic 1. Active chairs: ${activeChairs.length}`;
    },
});
