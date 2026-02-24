
const mockPatients = [
    { userId: "u1", block: "1", present: true, name: "P1" },
    { userId: "u2", block: "1", present: true, name: "P2" },
    { userId: "u3", block: "2", present: true, name: "P3" },
    { userId: "u4", block: "3", present: true, name: "P4" },
];

const mockMeetings = [
    { patientId: "u1", chairId: null }, // P1 waiting
    { patientId: "u2", chairId: "c1" }, // P2 assigned
    { patientId: "u3", chairId: null }, // P3 waiting
    { patientId: "u4", chairId: null }, // P4 waiting
];

// Replicate getQueue logic
async function run() {
    console.log("Starting simulation...");

    const presentPatients = mockPatients.filter(p => p.present);

    const allPresent = await Promise.all(
        presentPatients.map(async (patientData) => {
            const userId = patientData.userId;

            const lastMeeting = mockMeetings.find(m => m.patientId === userId);

            const block = patientData.block || "3";
            const isAssigned = lastMeeting?.chairId != null;

            return {
                ...patientData,
                _id: userId,
                meetingToday: lastMeeting,
                block: block,
                isAssigned
            };
        })
    );

    const validPatients = allPresent.filter((p) => p !== null && !p.isAssigned);

    console.log("Valid Patients:", validPatients.map(p => `${p.name} (B${p.block})`));

    const blocks = { "1": [], "2": [], "3": [] };

    validPatients.forEach(p => {
        const b = p.block;
        if (blocks[b]) {
            blocks[b].push(p);
        } else {
            blocks["3"].push(p);
        }
    });

    let result = [];
    if (blocks["1"].length > 0) result = blocks["1"];
    else if (blocks["2"].length > 0) result = blocks["2"];
    else if (blocks["3"].length > 0) result = blocks["3"];

    console.log("Result:", result.map(p => `${p.name} (B${p.block})`));
}

run();
