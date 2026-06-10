import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const getByIds = query({
  args: {
    ids: v.array(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const docs = [];
    for (const id of args.ids) {
      const doc = await ctx.db.get(id);
      if (doc) {
        docs.push(doc);
      }
    }
    return docs;
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});

export const insert = mutation({
  args: {
    text: v.string(),
    source: v.string(),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("documents", {
      text: args.text,
      source: args.source,
      embedding: args.embedding,
    });
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("documents").collect();
    for (const doc of docs) {
      await ctx.db.delete(doc._id);
    }
  },
});

export const ingest = action({
  args: {
    chunks: v.array(
      v.object({
        text: v.string(),
        source: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // 1. Clear existing documents
    await ctx.runMutation(api.documents.clear);

    // 2. Initialize Credentials
    const apiKey = process.env.DENTAMIX_AI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        count: 0,
        errors: ["DENTAMIX_AI_API_KEY is not set in Convex environment"],
      };
    }

    const embedUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`;

    // 3. Process each chunk
    let count = 0;
    const errors: string[] = [];

    for (const chunk of args.chunks) {
      let embedding: number[] | null = null;
      let success = false;
      let retries = 3;

      while (retries > 0 && !success) {
        try {
          const embedRes = await fetch(embedUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: {
                parts: [{ text: chunk.text }]
              },
              outputDimensionality: 768
            }),
          });

          if (!embedRes.ok) {
            const errText = await embedRes.text();
            throw new Error(`Embedding API status ${embedRes.status}: ${errText}`);
          }

          const embedData = await embedRes.json();
          if (embedData.embedding && embedData.embedding.values) {
            embedding = embedData.embedding.values;
            success = true;
          } else {
            throw new Error(`Invalid embedding response: no values found`);
          }
        } catch (err: any) {
          retries--;
          if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          } else {
            errors.push(`[Source: ${chunk.source}] ${err.message || String(err)}`);
          }
        }
      }

      if (success && embedding) {
        try {
          await ctx.runMutation(api.documents.insert, {
            text: chunk.text,
            source: chunk.source,
            embedding,
          });
          count++;
        } catch (err: any) {
          errors.push(`[Source: ${chunk.source}] Database insert error: ${err.message || String(err)}`);
        }
      }
    }

    return { success: true, count, errors };
  },
});
