import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const store = mutation({
    args: {
        tokenIdentifier: v.string(),
        email: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        profilePictureUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if user exists
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique();

        if (user !== null) {
            // Update existing user
            await ctx.db.patch(user._id, {
                email: args.email,
                firstName: args.firstName,
                lastName: args.lastName,
                profilePictureUrl: args.profilePictureUrl,
            });
            return user._id;
        }

        // Create new user
        const newUserId = await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            email: args.email,
            firstName: args.firstName,
            lastName: args.lastName,
            profilePictureUrl: args.profilePictureUrl,
            role: "patient", // Default role
        });

        return newUserId;
    },
});
