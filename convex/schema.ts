import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  conversations: defineTable({
    title: v.string(),
    createdAt: v.number(),
    userName: v.optional(v.string()),
  }),
  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
    source: v.optional(v.string()),
  }).index("by_conversation", ["conversationId"]),
  documents: defineTable({
    text: v.string(),
    source: v.string(),
    embedding: v.array(v.float64()),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 768,
  }),
  chatConfig: defineTable({
    locale: v.string(),
    assistantName: v.string(),
    systemPrompt: v.string(),
    coreContacts: v.string(),
    voiceSystemInstruction: v.optional(v.string()),
    voiceModel: v.optional(v.string()),
    voiceName: v.optional(v.string()),
    chatAvatarUrl: v.optional(v.string()),
    voiceAvatarUrl: v.optional(v.string()),
    suggestions: v.array(
      v.object({
        label: v.string(),
        promptText: v.string(),
      })
    ),
    updatedAt: v.number(),
  }).index("by_locale", ["locale"]),
});
