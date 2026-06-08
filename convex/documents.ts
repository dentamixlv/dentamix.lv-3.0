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
    const aiUrl = process.env.DENTAMIX_AI_URL || "https://dentamix-ai-chat.girts-kizenbahs.workers.dev";
    const apiKey = process.env.DENTAMIX_AI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        count: 0,
        errors: ["DENTAMIX_AI_API_KEY is not set in Convex environment"],
      };
    }

    const embedUrl = `${aiUrl.replace(/\/$/, "")}/embeddings`;

    // 3. Process each chunk
    let count = 0;
    const errors: string[] = [];

    for (const chunk of args.chunks) {
      let res = null;
      let data: any = null;
      let success = false;
      let retries = 3;

      while (retries > 0 && !success) {
        try {
          res = await fetch(embedUrl, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: chunk.text,
            }),
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Embedding API status ${res.status}: ${errText}`);
          }

          data = await res.json();
          if (!data.data || data.data.length === 0) {
            throw new Error(`Invalid response structure: ${JSON.stringify(data)}`);
          }

          success = true;
        } catch (err: any) {
          retries--;
          if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          } else {
            errors.push(`[Source: ${chunk.source}] ${err.message || String(err)}`);
          }
        }
      }

      if (success && data) {
        try {
          const embedding: number[] = data.data[0];
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
