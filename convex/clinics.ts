import { query } from "./_generated/server";

export const getDefault = query({
    args: {},
    handler: async (ctx) => {
        // Mock data since no clinics table exists in schema
        return {
            name: "Default Clinic",
            address: "123 Main St",
            settings: {}
        };
    },
});
