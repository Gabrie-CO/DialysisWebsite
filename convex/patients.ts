import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        // In a real app, you might only return patients if the user is an admin/doctor
        const users = await ctx.db.query("users").collect();
        // Filter by role "patient" if strictly needed, or return all for now
        return users.filter((u) => u.role === "patient");
    },
});

export const getById = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        // Simple client-side filtering on server for now since full-text search requires more setup
        const users = await ctx.db.query("users").collect();
        const q = args.query.toLowerCase();
        return users.filter(
            (u) =>
                u.role === "patient" &&
                ((u.firstName && u.firstName.toLowerCase().includes(q)) ||
                    (u.lastName && u.lastName.toLowerCase().includes(q)) ||
                    (u.code && u.code.toLowerCase().includes(q)))
        );
    },
});
