import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const respond = action({
  args: {
    conversationId: v.id("conversations"),
    userMessageText: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Save the user's message
    await ctx.runMutation(api.messages.send, {
      conversationId: args.conversationId,
      role: "user",
      content: args.userMessageText,
    });

    // 2. Fetch conversation history
    const dbMessages = await ctx.runQuery(api.messages.list, {
      conversationId: args.conversationId,
    });

    // 3. Create the empty assistant message in the database (acts as a placeholder for streaming)
    const assistantMessageId = await ctx.runMutation(api.messages.send, {
      conversationId: args.conversationId,
      role: "assistant",
      content: "",
    });

    // 4. Initialize Gemini client
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set in Convex");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a helpful, professional, and friendly AI assistant for Dentamix, a premium dental clinic in Latvia.
Your goal is to answer client questions in a helpful way, explain services, share pricing info, and guide them to book an appointment.

Clinic Information:
- Name: Dentamix
- Website: dentamix.lv
- Services: General dentistry (terapija), dental hygiene (higiēna), implants (implanti), prosthetics (protezēšana), orthodontics (ortodontija), teeth whitening (balināšana), and pediatric dentistry (bērnu zobārstniecība).
- Contacts: Clients can book appointments online using the booking button in the header, or call +371 29222222, or email info@dentamix.lv.
- Tone: Warm, professional, clean, polite, reassuring.
- Response Language: Respond in the language the user speaks (Latvian, English, or Russian). If the user starts in Latvian, reply in Latvian. If in English, reply in English.
- Formatting: Use clear, readable paragraphs or bullet points. Avoid overly technical jargon. Be empathetic to patients who might feel dental anxiety.`,
    });

    // Prepare history for Gemini:
    // Gemini chat history should contain alternate user/model roles, excluding the last message (the empty assistant message)
    // and excluding the very latest user message since it will be passed to sendMessageStream.
    const priorMessages = dbMessages.slice(0, -2);
    const history = priorMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Start chat session
    const chat = model.startChat({ history });

    // 5. Send message and stream the response
    let accumulatedContent = "";
    try {
      const resultStream = await chat.sendMessageStream(args.userMessageText);

      for await (const chunk of resultStream.stream) {
        const text = chunk.text();
        accumulatedContent += text;
        
        // Update database with accumulated content in real-time
        await ctx.runMutation(api.messages.updateContent, {
          messageId: assistantMessageId,
          content: accumulatedContent,
        });
      }
    } catch (error) {
      console.error("Error streaming response from Gemini:", error);
      accumulatedContent += "\n\n(Atvainojiet, radās kļūda saziņā ar serveri. Lūdzu, mēģiniet vēlreiz. / Sorry, an error occurred while connecting to the server. Please try again.)";
      await ctx.runMutation(api.messages.updateContent, {
        messageId: assistantMessageId,
        content: accumulatedContent,
      });
    }

    return assistantMessageId;
  },
});
