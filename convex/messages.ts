import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();
    return messages.filter((m) => m.source !== "voice");
  },
});

export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify conversation exists
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error(`Conversation ${args.conversationId} not found`);
    }

    // Rate limiting: check last 11 messages in this conversation
    if (args.role === "user") {
      const recent = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
        .order("desc")
        .take(11);

      const oneMinuteAgo = Date.now() - 60000;
      const spamCount = recent.filter((m: any) => m._creationTime > oneMinuteAgo).length;

      if (spamCount >= 10) {
        throw new ConvexError(
          "Ziņu sūtīšanas biežums pārsniegts. Lūdzu, uzgaidiet minūti. / Rate limit exceeded. Please wait a minute."
        );
      }
    }

    // If this is the first user message in the conversation, update the conversation title
    if (args.role === "user") {
      const existing = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
        .collect();
      
      if (existing.length === 0) {
        let title = args.content.trim();
        if (title.length > 60) {
          title = title.substring(0, 57) + "...";
        }
        await ctx.db.patch(args.conversationId, { title });
      }
    }

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: args.role,
      content: args.content,
      createdAt: Date.now(),
      source: args.source,
    });
    return messageId;
  },
});

export const updateContent = mutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      content: args.content,
    });
  },
});
