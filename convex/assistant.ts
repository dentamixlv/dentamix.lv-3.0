import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

export const respond = action({
  args: {
    conversationId: v.id("conversations"),
    userMessageText: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"messages">> => {
    // 1. Save the user's message
    await ctx.runMutation(api.messages.send, {
      conversationId: args.conversationId,
      role: "user",
      content: args.userMessageText,
    });

    // 2. Fetch conversation history with type annotation to avoid circular imports
    const dbMessages: Doc<"messages">[] = await ctx.runQuery(api.messages.list, {
      conversationId: args.conversationId,
    });

    // 3. Initialize client env checks
    const aiUrl = process.env.DENTAMIX_AI_URL || "https://dentamix-ai-chat.girts-kizenbahs.workers.dev";
    const apiKey = process.env.DENTAMIX_AI_API_KEY;
    if (!apiKey) {
      throw new Error("DENTAMIX_AI_API_KEY is not set in Convex environment");
    }

    // 4. Generate user message embedding and perform vector search for RAG context
    let retrievedContext = "";
    try {
      const embedUrl = `${aiUrl.replace(/\/$/, "")}/embeddings`;
      const embedRes = await fetch(embedUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: args.userMessageText,
        }),
      });

      if (embedRes.ok) {
        const embedData: any = await embedRes.json();
        if (embedData.data && embedData.data.length > 0) {
          const queryVector: number[] = embedData.data[0];

          const searchResults: { _id: Id<"documents">; _score: number }[] = await ctx.vectorSearch("documents", "by_embedding", {
            vector: queryVector,
            limit: 3,
          });

          if (searchResults.length > 0) {
            const docIds = searchResults.map((r) => r._id);
            const docs: Doc<"documents">[] = await ctx.runQuery(api.documents.getByIds, { ids: docIds });
            retrievedContext = docs.map((doc) => `[Source: ${doc.source}]\n${doc.text}`).join("\n\n");
          }
        }
      } else {
        const errText = await embedRes.text();
        console.error(`Embedding API returned status ${embedRes.status}: ${errText}`);
      }
    } catch (error) {
      console.error("Failed to generate embedding or perform vector search:", error);
    }

    // 5. Create the empty assistant message in the database (acts as a placeholder for streaming)
    const assistantMessageId: Id<"messages"> = await ctx.runMutation(api.messages.send, {
      conversationId: args.conversationId,
      role: "assistant",
      content: "",
    });

    const systemPrompt = `You are a helpful, professional, and friendly AI assistant for Dentamix, a premium dental clinic in Latvia.
Your goal is to answer client questions in a helpful way, explain services, share pricing info, and guide them to book an appointment.

${retrievedContext ? `Here is relevant information found on our website to help you answer this question:\n${retrievedContext}\n\nUse this information to provide accurate and specific details. If the answer cannot be found in the context, use your general dental knowledge, but do not make up specific facts about Dentamix (like prices or schedules) that aren't mentioned in the text.` : ''}

Clinic General Info:
- Name: Dentamix
- Website: dentamix.lv
- Services: General dentistry (terapija), dental hygiene (higiēna), implants (implanti), prosthetics (protezēšana), orthodontics (ortodontija), teeth whitening (balināšana), and pediatric dentistry (bērnu zobārstniecība).
- Contacts: Clients can book appointments online using the booking button in the header, or call +371 29222222, or email info@dentamix.lv.
- Tone: Warm, professional, clean, polite, reassuring.
- Response Language: Respond in the language the user speaks (Latvian, English, or Russian). If the user starts in Latvian, reply in Latvian. If in English, reply in English.
- Formatting: Use clear, readable paragraphs or bullet points. Avoid overly technical jargon. Be empathetic to patients who might feel dental anxiety.`;

    // Prepare history:
    const priorMessages = dbMessages.slice(0, -2);
    const history = priorMessages.map((msg) => ({
      role: msg.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: msg.content,
    }));

    // 6. Send message and stream the response using Custom Cloudflare Worker
    const chatUrl = `${aiUrl.replace(/\/$/, "")}/api/chat`;
    let accumulatedContent = "";

    try {
      const res = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: args.userMessageText }
          ],
          model: "@cf/google/gemma-4-26b-a4b-it",
          stream: true,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Cloudflare Worker API returned ${res.status}: ${errText}`);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable");
      }

      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data:")) {
            const dataStr = trimmed.substring(5).trim();
            if (dataStr === "[DONE]") continue;
            try {
              const data = JSON.parse(dataStr);
              // Handle both direct response format (data.response) and OpenAI choices format (data.choices[0].delta.content)
              let text = "";
              if (data.response !== undefined) {
                text = data.response;
              } else if (data.choices && data.choices[0] && data.choices[0].delta) {
                text = data.choices[0].delta.content || "";
              }

              if (text) {
                accumulatedContent += text;
                await ctx.runMutation(api.messages.updateContent, {
                  messageId: assistantMessageId,
                  content: accumulatedContent,
                });
              }
            } catch (parseError) {
              // Ignore incomplete lines
            }
          }
        }
      }

      // Process any trailing buffer contents
      if (buffer.trim().startsWith("data:")) {
        const dataStr = buffer.trim().substring(5).trim();
        try {
          const data = JSON.parse(dataStr);
          let text = "";
          if (data.response !== undefined) {
            text = data.response;
          } else if (data.choices && data.choices[0] && data.choices[0].delta) {
            text = data.choices[0].delta.content || "";
          }

          if (text) {
            accumulatedContent += text;
            await ctx.runMutation(api.messages.updateContent, {
              messageId: assistantMessageId,
              content: accumulatedContent,
            });
          }
        } catch (e) {}
      }

    } catch (error) {
      console.error("Error streaming response from Cloudflare Worker API:", error);
      accumulatedContent += "\n\n(Atvainojiet, radās kļūda saziņā ar serveri. Lūdzu, mēģiniet vēlreiz. / Sorry, an error occurred while connecting to the server. Please try again.)";
      await ctx.runMutation(api.messages.updateContent, {
        messageId: assistantMessageId,
        content: accumulatedContent,
      });
    }

    return assistantMessageId;
  },
});
