import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { createClient } from "@prismicio/client";
import * as prismic from "@prismicio/client";

const http = httpRouter();

http.route({
  path: "/api/prismic-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Optional: Parse request body (useful for logging or checking event type)
      try {
        const body = await request.json();
        console.log("Received Prismic webhook:", body);
      } catch (e) {
        console.log("Prismic webhook payload was not valid JSON or was empty");
      }
      
      // Initialize Prismic client
      const repoName = process.env.PRISMIC_REPOSITORY_NAME || "dentamix-v30"; 
      const client = createClient(repoName);
      
      // Fetch all translation variants of the configuration document
      const documents = await client.getAllByType("chat_config", { lang: "*" });
      
      if (documents && documents.length > 0) {
        for (const document of documents) {
          const locale = document.lang;
          
          // Serialize RichText fields to Plain Text strings for Gemini ingestion
          const serializedPrompt = prismic.asText(document.data.system_prompt) || "";
          const serializedContacts = prismic.asText(document.data.core_contacts) || "";
          const serializedVoiceInstruction = prismic.asText(document.data.voice_system_instruction) || undefined;
          const voiceModel = document.data.voice_model || undefined;
          const voiceName = document.data.voice_name || undefined;
          const chatAvatarUrl = document.data.chat_avatar?.url || undefined;
          const voiceAvatarUrl = document.data.voice_avatar?.url || undefined;

          // Parse suggestions group list
          const parsedSuggestions = (document.data.suggestions || []).map((item: any) => ({
            label: item.label || "",
            promptText: item.prompt_text || "",
          }));

          // Trigger internal mutation to cache values locally in Convex database
          await ctx.runMutation(internal.assistant.updateConfig, {
            locale,
            assistantName: document.data.assistant_name || "Ieva",
            systemPrompt: serializedPrompt,
            coreContacts: serializedContacts,
            voiceSystemInstruction: serializedVoiceInstruction || undefined,
            voiceModel: voiceModel || undefined,
            voiceName: voiceName || undefined,
            chatAvatarUrl: chatAvatarUrl || undefined,
            voiceAvatarUrl: voiceAvatarUrl || undefined,
            suggestions: parsedSuggestions,
          });
          
          console.log(`Cached latest Prismic chat configuration for locale '${locale}' successfully`);
        }
      } else {
        console.warn("No 'chat_config' documents found in Prismic");
      }

      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("Prismic Webhook error:", error);
      return new Response(JSON.stringify({ error: "Webhook handler failed", details: error.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

export default http;
