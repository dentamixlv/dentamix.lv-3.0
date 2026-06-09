import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    const apiKey = process.env.DENTAMIX_AI_API_KEY;
    if (!apiKey) {
      throw new Error("DENTAMIX_AI_API_KEY is not set in Convex environment");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 4. Generate user message embedding and perform vector search for RAG context
    let retrievedContext = "";
    try {
      const embedUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;
      const embedRes = await fetch(embedUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: {
            parts: [{ text: args.userMessageText }]
          },
          outputDimensionality: 768
        }),
      });

      if (embedRes.ok) {
        const embedData: any = await embedRes.json();
        if (embedData.embedding && embedData.embedding.values) {
          const queryVector: number[] = embedData.embedding.values;

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

    const systemPrompt = `You are Ieva, a helpful, professional, and friendly AI assistant for Dentamix, a premium dental clinic in Latvia.
Your goal is to answer client questions in a helpful way, explain services, share pricing info, and guide them to book an appointment.
If asked about who you are or your name, state that you are Ieva, the Dentamix website assistant (mājas lapas palīgs).

${retrievedContext ? `Here is relevant information found on our website to help you answer this question:\n${retrievedContext}\n\nUse this information to provide accurate and specific details. If the answer cannot be found in the context, use your general dental knowledge, but do not make up specific facts about Dentamix (like prices or schedules) that aren't mentioned in the text.` : ''}

Clinic General Info:
- Name: Dentamix
- Website: dentamix.lv
- IMPORTANT: Do NOT write out markdown links (e.g. '[text](url)'), hyperlinked texts, or URL paths (like '/kontakti' or 'https://...') in your responses. If referring users to contacts, prices, dentists, or services, tell them in plain text and guide them to use the Call/WhatsApp buttons at the bottom of the chat bubble.
- Prices: Do not chat about prices proactive. Look and chat prices exact prices user asks.
- Services: General dentistry (terapija), dental hygiene (higiēna), implants (implanti), prosthetics (protezēšana), orthodontics (ortodontija), teeth whitening (balināšana), and pediatric dentistry (bērnu zobārstniecība).
- Contacts: 
  - Riga Clinic: Phone +371 29419999, Email info@dentamix.lv, Address Brīvības iela 97, 3. stāvs, Rīga
  - Adazi Clinic: Phone +371 29419999, Email info@dentamix.lv, Address Gaujas iela 20, Ādaži
  - Contact/Booking Methods: Phone call (+371 29419999) or WhatsApp message. 
  - IMPORTANT: Do NOT write out raw WhatsApp link URLs (e.g. do not write 'https://wa.me/...') in your responses, as the chat widget already provides clickable Call and WhatsApp buttons directly below your message bubble. Just instruct them to call or message us on WhatsApp (optionally pointing them to the buttons in the chat).
  - IMPORTANT: Do NOT offer or suggest filling out any online contact forms. We only use phone calls and WhatsApp.
- Tone: Warm, professional, clean, polite, reassuring. Do NOT end responses with boilerplate taglines like "Gaidīsim Jūs Dentamix!" or "We look forward to seeing you at Dentamix!". Instead, close by kindly inviting the client to contact the clinic (either by calling or sending us a message on WhatsApp using the buttons provided in this chat) to ask questions or schedule an appointment.
- Response Language: You MUST reply in the EXACT SAME language that the user writes their message in. If the user writes in Latvian, you MUST respond in Latvian. If the user writes in Russian, you MUST respond in Russian. If the user writes in English, you MUST respond in English. Never reply in a different language than the user's input.
- Formatting: Use clear, readable paragraphs or bullet points. Avoid overly technical jargon. Be empathetic to patients who might feel dental anxiety.`;


    // Prepare history:
    const priorMessages = dbMessages.slice(0, -2);
    const history = priorMessages.map((msg) => ({
      role: msg.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: msg.content,
    }));

    // 6. Send message and stream the response using Google Gemini API
    let accumulatedContent = "";

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: systemPrompt,
      });

      // Map chat history to Google Gemini format (role must be 'user' or 'model')
      const contents = [
        ...history.map((msg) => ({
          role: msg.role === "assistant" ? ("model" as const) : ("user" as const),
          parts: [{ text: msg.content }],
        })),
        { role: "user" as const, parts: [{ text: args.userMessageText }] },
      ];

      const result = await model.generateContentStream({
        contents,
      });

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          accumulatedContent += text;
          await ctx.runMutation(api.messages.updateContent, {
            messageId: assistantMessageId,
            content: accumulatedContent,
          });
        }
      }

    } catch (error) {
      console.error("Error streaming response from Google Gemini API:", error);
      accumulatedContent += "\n\n(Atvainojiet, radās kļūda saziņā ar serveri. Lūdzu, mēģiniet vēlreiz. / Sorry, an error occurred while connecting to the server. Please try again.)";
      await ctx.runMutation(api.messages.updateContent, {
        messageId: assistantMessageId,
        content: accumulatedContent,
      });
    }

    return assistantMessageId;
  },
});
