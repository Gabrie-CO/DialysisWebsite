import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update a meeting
export const createOrUpdate = mutation({
  args: {
    patientId: v.id("users"),
    date: v.string(),
    status: v.string(),
    chairId: v.optional(v.string()),
    condition: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("meetings", {
      patientId: args.patientId,
      date: args.date,
      status: args.status,
      chairId: args.chairId,
      condition: args.condition,
    });
    return id;
  },
});

export const getRecent = query({
  args: {
    patientId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const recentSessions = await ctx.db
      .query("meetings")
      .withIndex("by_patient_date", (q) => q.eq("patientId", args.patientId))
      .order("desc")
      .take(3);

    return {
      recentSessions,
    };
  },
});

export const getQueue = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const todayDate = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Tegucigalpa"
    })
    const todayMeetings = await ctx.db
      .query("meetings")
      .withIndex("by_date", (q) => q.eq("date", todayDate))
      .collect();
    const queueMeetings = todayMeetings.filter(m =>
      (m.status === "scheduled" || m.status === "active") &&
      !m.chairId &&
      m.block !== undefined &&
      m.present === true
    );
    const queuePatients = await Promise.all(
      queueMeetings.map(async (meeting) => {
        if (!meeting.patientId) return null;

        const user = await ctx.db.get(meeting.patientId);
        if (!user) return null;

        const patientData = await ctx.db
          .query("patients")
          .withIndex("by_user", q => q.eq("userId", meeting.patientId!))
          .unique();

        if (!patientData) return null;
        return {
          ...user,
          ...patientData,
          _id: meeting.patientId, // Frontend dnd logic expects this to be the userId
          meetingToday: meeting,
          block: meeting.block,
          isAssigned: false
        };
      })
    );
    return queuePatients.filter((p): p is NonNullable<typeof p> => p !== null);
  },
});

export const markPresent = mutation({
  args: {
    patientId: v.id("users"),
    present: v.boolean(),
  },
  handler: async (ctx, args) => {
    const todayDate = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Tegucigalpa"
    })
    const meetings = await ctx.db
      .query("meetings")
      .withIndex("by_patient_date", (q) => q.eq("patientId", args.patientId).eq("date", todayDate))
      .collect();

    if (meetings.length > 0) {
      await ctx.db.patch(meetings[0]._id, { present: args.present });
    }
  }
});
