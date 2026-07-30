import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const conversationId = await ctx.db.insert("conversations", {
      title: args.title,
      createdAt: Date.now(),
    });
    return conversationId;
  },
});

export const list = internalQuery({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("conversations")
      .order("desc")
      .take(limit);
  },
});

export const remove = mutation({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    // Delete all messages belonging to this conversation
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.id))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the conversation itself
    await ctx.db.delete(args.id);
  },
});

export const get = internalQuery({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateUserName = internalMutation({
  args: {
    id: v.id("conversations"),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { userName: args.userName });
  },
});
