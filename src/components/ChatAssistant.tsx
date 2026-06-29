"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { ConvexError } from "convex/values";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Trash2, Bot, User, Loader2, Sparkles, Phone, MessageCircle, Mic, MicOff } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useGeminiLive } from "../hooks/useGeminiLive";

// Custom helper to parse basic markdown (**bold**, [links](url), and newlines)
function formatMessageContent(content: string) {
  if (!content) return "";
  
  // Split by newlines
  const lines = content.split("\n");
  
  return lines.map((line, lineIdx) => {
    // Look for **bold text** and [markdown links](url)
    const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    
    const elements = parts.map((part, partIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={partIdx} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={partIdx}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--main-color)] underline hover:opacity-90 font-medium"
          >
            {linkMatch[1]}
          </a>
        );
      }
      
      return part;
    });
    
    return (
      <React.Fragment key={lineIdx}>
        {lineIdx > 0 && <br />}
        {elements}
      </React.Fragment>
    );
  });
}

export default function ChatAssistant() {
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [optimisticMessage, setOptimisticMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Convex mutations, queries, actions
  const createConversation = useMutation(api.conversations.create);
  const removeConversation = useMutation(api.conversations.remove);
  const dbMessages = useQuery(
    api.messages.list,
    conversationId ? { conversationId } : "skip"
  );
  const chatConfig = useQuery(
    api.assistant.getChatConfig,
    { locale: isEn ? "en-us" : "lv" }
  );
  const fallbackAvatarUrl = "https://images.prismic.io/dentamix-v30/aie7BweQX7-eW__g_zobarsts-riga-chat.png";
  const chatAvatarUrl = chatConfig?.chatAvatarUrl || fallbackAvatarUrl;
  const voiceAvatarUrl = chatConfig?.voiceAvatarUrl || fallbackAvatarUrl;
  const respondAction = useAction(api.assistant.respond);

  const {
    isCallActive,
    isConnecting,
    isMuted,
    volumeLevel,
    isAgentSpeaking,
    error: voiceError,
    startCall,
    endCall,
    toggleMute
  } = useGeminiLive({
    conversationId,
    locale: isEn ? "en" : "lv"
  });

  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isCallActive) {
      setCallDuration(0);
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVoiceClick = async () => {
    if (isCallActive || isConnecting || voiceError) {
      endCall();
      return;
    }

    let activeId = conversationId;
    if (!activeId) {
      try {
        const newId = await createConversation({ title: isEn ? "Voice Call" : "Balss saruna" });
        activeId = newId;
        setConversationId(newId);
        localStorage.setItem("dentamix_chat_conv_id", newId);
      } catch (err) {
        console.error("Failed to start conversation for voice call:", err);
        return;
      }
    }
    
    startCall(activeId);
  };

  // Merge database messages with our optimistic pending user message
  const displayMessages = React.useMemo(() => {
    const list = dbMessages ? [...dbMessages] : [];
    if (optimisticMessage) {
      const alreadyInDb = list.some(
        (m) => m.role === "user" && m.content === optimisticMessage
      );
      if (!alreadyInDb) {
        list.push({
          _id: "optimistic-temp-id" as any,
          role: "user",
          content: optimisticMessage,
          _creationTime: Date.now(),
        } as any);
      }
    }
    return list;
  }, [dbMessages, optimisticMessage]);

  // Localization strings
  const strings = {
    online: "Online",
    placeholder: isEn ? "Type a message..." : "Rakstīt ziņu...",
    clearTooltip: isEn ? "Clear conversation" : "Dzēst saraksti",
    clearConfirm: isEn 
      ? "Are you sure you want to delete this chat history?" 
      : "Vai tiešām vēlaties dzēst šo saraksti?"
  };

  // Dynamic configuration values from database cache or fallback
  const assistantName = chatConfig?.assistantName || "Ieva";
  const chatTitle = isEn 
    ? `${assistantName}, dental assistant` 
    : `${assistantName}, zobārsta palīgs`;
  const welcomeMessage = isEn 
    ? `Hello! I am ${assistantName}. I can help you and answer questions about:\n\n- dental services\n- prices\n- dentists\n- booking\n\nFeel free to ask me, call, or write on WhatsApp!` 
    : `Sveiki! Esmu ${assistantName}. Varu Jums palīdzēt un atbildēt par:\n\n- pakalpojumiem\n- cenām\n- zobārstiem\n- pierakstu\n\nDroši jautājiet man, zvaniet vai rakstiet WhatsApp!`;

  // Dynamic suggestions from database cache or fallback
  const suggestions = React.useMemo(() => {
    if (chatConfig?.suggestions && chatConfig.suggestions.length > 0) {
      return chatConfig.suggestions.map((s) => ({
        text: s.label,
        prompt: s.promptText,
      }));
    }
    return isEn 
      ? [
          { text: "How can I book an appointment?", prompt: "How can I book an appointment?" },
          { text: "Where are the clinics located?", prompt: "Where are the clinics located?" },
          { text: "What are the working hours?", prompt: "What are the working hours?" }
        ]
      : [
          { text: "Kā pieteikties vizītei?", prompt: "Kā pieteikties vizītei?" },
          { text: "Kur atrodas klīnikas?", prompt: "Kur atrodas klīnikas?" },
          { text: "Kāds ir darba laiks?", prompt: "Kāds ir darba laiks?" }
        ];
  }, [chatConfig, isEn]);

  // Load conversation ID from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem("dentamix_chat_conv_id");
    if (savedId) {
      setConversationId(savedId as Id<"conversations">);
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages, isSending]);

  // Clear optimistic message once it has been saved and synced from the database
  useEffect(() => {
    if (optimisticMessage && dbMessages) {
      const alreadyInDb = dbMessages.some(
        (m) => m.role === "user" && m.content === optimisticMessage
      );
      if (alreadyInDb) {
        setOptimisticMessage(null);
      }
    }
  }, [dbMessages, optimisticMessage]);

  // Handle message send
  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;
    if (textToSend.length > 140) return;

    setIsSending(true);
    setOptimisticMessage(textToSend); // Set optimistic message
    setInputValue("");

    try {
      let activeId = conversationId;

      // 1. If no conversation exists, create it lazily
      if (!activeId) {
        let title = textToSend.trim();
        if (title.length > 60) {
          title = title.substring(0, 57) + "...";
        }
        
        const newId = await createConversation({ title });
        activeId = newId;
        setConversationId(newId);
        localStorage.setItem("dentamix_chat_conv_id", newId);
      }

      // 2. Call the Convex action to handle message sending and Gemini response streaming
      await respondAction({
        conversationId: activeId,
        userMessageText: textToSend,
        locale: isEn ? "en" : "lv",
      });

      // Play sound notification when the answer is fully typed/received
      try {
        const audio = new Audio("https://dentamix-v30.cdn.prismic.io/dentamix-v30/aigVAAeQX7-eXDrC_chat.mp3");
        audio.volume = 0.4;
        audio.play().catch((e) => console.log("Audio playback blocked by autoplay rules:", e));
      } catch (audioErr) {
        console.error("Failed to play notification audio:", audioErr);
      }

    } catch (error) {
      if (error instanceof ConvexError) {
        alert(error.data);
        setOptimisticMessage(null); // Clear immediately on validation failure
      } else {
        console.error("Failed to send message:", error);
        setOptimisticMessage(null); // Clear immediately on failure
        // Clean up potentially stale/nonexistent conversation ID so the next try creates a new conversation
        setConversationId(null);
        localStorage.removeItem("dentamix_chat_conv_id");
      }
    } finally {
      setIsSending(false);
      // Safety timeout: if the database doesn't sync the message within 3 seconds, clear it anyway
      setTimeout(() => {
        setOptimisticMessage((current) => current === textToSend ? null : current);
      }, 3000);
    }
  };

  // Clear current conversation history
  const handleClear = async () => {
    if (!conversationId) return;
    if (window.confirm(strings.clearConfirm)) {
      try {
        await removeConversation({ id: conversationId });
      } catch (err) {
        console.error("Failed to delete conversation:", err);
      }
      setConversationId(null);
      localStorage.removeItem("dentamix_chat_conv_id");
    }
  };

  // Check if assistant is currently typing (streaming)
  const isTyping = dbMessages && dbMessages.length > 0 && 
    dbMessages[dbMessages.length - 1].role === "assistant" && 
    dbMessages[dbMessages.length - 1].content === "" && 
    isSending;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-96 max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-6rem)] rounded-2xl shadow-2xl flex flex-col bg-white border border-gray-100 overflow-hidden fixed bottom-24 left-1/2 -translate-x-1/2 sm:relative sm:bottom-0 sm:left-auto sm:translate-x-0 sm:mb-4"
          >
            
            {/* Header */}
            <div className="bg-[var(--main-color)] text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border border-white/20 bg-white/10">
                  {chatConfig === undefined ? (
                    <Bot size={20} className="text-white/60 animate-pulse" />
                  ) : (
                    <img 
                      src={chatAvatarUrl} 
                      alt="Dentamix AI" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">{chatTitle}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-white/80">{strings.online}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {conversationId && (
                  <button
                    onClick={handleClear}
                    title={strings.clearTooltip}
                    className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Body & Call Overlay */}
            {(isCallActive || isConnecting || voiceError) ? (
              <div className="flex-grow flex flex-col items-center justify-center bg-[#fbf9f8] p-6 space-y-8 relative overflow-hidden">
                {/* Voice Call Visualizer Animation */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Fluid pulsating rings */}
                  <motion.div
                    animate={
                      isConnecting
                        ? { scale: [1, 1.1, 1], opacity: [0.08, 0.18, 0.08] }
                        : isAgentSpeaking
                          ? { scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }
                          : { scale: [1, 1 + volumeLevel * 0.3, 1], opacity: [0.08, 0.2, 0.08] }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: isConnecting ? 2.5 : isAgentSpeaking ? 0.6 : 0.8,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full border border-[var(--main-color)]/25"
                  />
                  <motion.div
                    animate={
                      isConnecting
                        ? { scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }
                        : isAgentSpeaking
                          ? { scale: [1, 1.28, 1], opacity: [0.06, 0.16, 0.06] }
                          : { scale: [1, 1 + volumeLevel * 0.5, 1], opacity: [0.05, 0.12, 0.05] }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: isConnecting ? 2.5 : isAgentSpeaking ? 0.6 : 0.8,
                      delay: isAgentSpeaking ? 0.15 : 0.2,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full border border-[var(--main-color)]/15"
                  />
                  <motion.div
                    animate={
                      isConnecting
                        ? { scale: [1, 1.3, 1], opacity: [0.02, 0.06, 0.02] }
                        : isAgentSpeaking
                          ? { scale: [1, 1.38, 1], opacity: [0.03, 0.09, 0.03] }
                          : { scale: [1, 1 + volumeLevel * 0.7, 1], opacity: [0.02, 0.06, 0.02] }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: isConnecting ? 2.5 : isAgentSpeaking ? 0.6 : 0.8,
                      delay: isAgentSpeaking ? 0.3 : 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full border border-[var(--main-color)]/8"
                  />

                  {/* Profile image inside call ring */}
                  <div className={`relative w-24 h-24 rounded-full overflow-hidden border-2 shadow-lg bg-white flex items-center justify-center z-10 transition-all duration-300 ${
                    isAgentSpeaking 
                      ? 'border-[var(--main-color)] scale-105 shadow-[var(--main-color)]/30 shadow-xl' 
                      : 'border-white scale-100'
                  }`}>
                    {chatConfig === undefined ? (
                      <Bot size={40} className="text-gray-300 animate-pulse" />
                    ) : (
                      <img
                        src={voiceAvatarUrl}
                        alt="Ieva"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Call Status Text */}
                <div className="text-center z-10">
                  <h4 className="text-[#511B29] font-serif font-bold text-base leading-tight">
                    {assistantName}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 font-medium font-mono tracking-wider">
                    {isConnecting
                      ? (isEn ? "Connecting..." : "Savieno...")
                      : isMuted
                        ? (isEn ? `Muted (${formatDuration(callDuration)})` : `Izslēgta skaņa (${formatDuration(callDuration)})`)
                        : formatDuration(callDuration)}
                  </p>
                  {voiceError && (
                    <p className="text-[11px] text-rose-500 mt-2 max-w-xs font-semibold">
                      {voiceError}
                    </p>
                  )}
                </div>

                {/* Call Control Tactile Buttons */}
                <div className="flex items-center gap-6 z-10">
                  {/* Mute Button */}
                  <button
                    onClick={toggleMute}
                    disabled={isConnecting}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md active:scale-90 ${
                      isMuted
                        ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50 cursor-pointer`}
                    title={isMuted ? (isEn ? "Unmute" : "Ieslēgt mikrofonu") : (isEn ? "Mute" : "Izslēgt mikrofonu")}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>

                  {/* End Call Button */}
                  <button
                    onClick={endCall}
                    className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                    title={isEn ? "End Call" : "Beigt sarunu"}
                  >
                    <Phone size={24} className="rotate-[135deg]" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                
                {/* Welcome Message */}
                <div className="flex gap-2.5 items-start max-w-[85%]">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-gray-100 border border-gray-100">
                    {chatConfig === undefined ? (
                      <Bot size={16} className="text-gray-400 animate-pulse" />
                    ) : (
                      <img 
                        src={chatAvatarUrl} 
                        alt="Dentamix AI" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm text-sm text-gray-800 leading-relaxed">
                      {formatMessageContent(welcomeMessage)}
                    </div>
                    
                    {/* Call and WhatsApp Buttons for Welcome Message */}
                    {(!displayMessages || displayMessages.length === 0) && (
                      <div className="flex justify-center gap-2">
                        <a
                          href="tel:+37129419999"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#de7c8a]/30 text-xs font-semibold text-[#511B29] transition-all hover:bg-[#de7c8a]/10 active:scale-95 shadow-sm"
                        >
                          <Phone className="w-3 h-3 text-[#de7c8a] shrink-0" />
                          <span>{isEn ? "Call" : "Zvanīt"}</span>
                        </a>
                        <a
                          href="https://wa.me/37129419999"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 transition-all hover:bg-emerald-100 active:scale-95 shadow-sm"
                        >
                          <svg className="w-3 h-3 fill-emerald-500 shrink-0" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Suggestions (only show when there is no message history yet) */}
                {(!displayMessages || displayMessages.length === 0) && (
                  <div className="pl-10 space-y-2 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-1.5">
                      <Sparkles size={12} className="text-[var(--main-color)]" />
                      <span>Ieteikumi / Suggestions:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(sug.prompt)}
                          className="text-xs text-left bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 px-3.5 py-2 rounded-full transition-all duration-200 hover:border-gray-300 shadow-sm cursor-pointer"
                        >
                          {sug.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message History */}
                {displayMessages && displayMessages.map((msg, index) => {
                  const isAssistant = msg.role === "assistant";
                  const isLast = index === displayMessages.length - 1;
                  return (
                    <div
                      key={msg._id}
                      className={`flex gap-2.5 items-start max-w-[85%] ${
                        isAssistant ? "" : "ml-auto flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ${
                          isAssistant ? "bg-gray-100 border border-gray-100" : "bg-[var(--main-color)] text-white"
                        }`}
                      >
                        {isAssistant ? (
                          chatConfig === undefined ? (
                            <Bot size={16} className="text-gray-400 animate-pulse" />
                          ) : (
                            <img 
                              src={chatAvatarUrl} 
                              alt="Dentamix AI" 
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <User size={15} />
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div
                          className={`rounded-2xl p-3 shadow-sm text-sm leading-relaxed ${
                            isAssistant
                              ? "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                              : "bg-[var(--main-color)] text-white rounded-tr-none"
                          }`}
                        >
                          {/* Show loading indicator if assistant message is empty and we are sending */}
                          {isAssistant && msg.content === "" ? (
                            <div className="flex items-center gap-1.5 py-1.5 px-1">
                              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                            </div>
                          ) : (
                            formatMessageContent(msg.content)
                          )}
                        </div>

                        {/* Call and WhatsApp Buttons for the latest Assistant message */}
                        {isAssistant && isLast && msg.content !== "" && (
                          <div className="flex justify-center gap-2">
                            <a
                              href="tel:+37129419999"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#de7c8a]/30 text-xs font-semibold text-[#511B29] transition-all hover:bg-[#de7c8a]/10 active:scale-95 shadow-sm"
                            >
                              <Phone className="w-3 h-3 text-[#de7c8a] shrink-0" />
                              <span>{isEn ? "Call" : "Zvanīt"}</span>
                            </a>
                            <a
                              href="https://wa.me/37129419999"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 transition-all hover:bg-emerald-100 active:scale-95 shadow-sm"
                            >
                              <svg className="w-3 h-3 fill-emerald-500 shrink-0" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator when waiting for Gemini response */}
                {isSending && (!displayMessages || displayMessages.length === 0 || displayMessages[displayMessages.length - 1].role !== "assistant") && (
                  <div className="flex gap-2.5 items-start max-w-[85%]">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-gray-100 border border-gray-100">
                      {chatConfig === undefined ? (
                        <Bot size={16} className="text-gray-400 animate-pulse" />
                      ) : (
                        <img 
                          src={chatAvatarUrl} 
                          alt="Dentamix AI" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm text-sm text-gray-400 flex items-center justify-center">
                      <div className="flex items-center gap-1.5 py-1 px-0.5">
                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input Footer */}
            {!(isCallActive || isConnecting || voiceError) && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputValue);
                }}
                className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
              >
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    maxLength={140}
                    placeholder={strings.placeholder}
                    disabled={isSending}
                    className="w-full border border-gray-200 rounded-full pl-4 pr-16 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  {inputValue.length > 0 && (
                    <span 
                      className={`absolute right-4 text-[10px] font-semibold pointer-events-none select-none transition-colors duration-150 ${
                        inputValue.length >= 125 
                          ? "text-rose-500 font-bold" 
                          : inputValue.length >= 100 
                            ? "text-amber-500" 
                            : "text-gray-400"
                      }`}
                    >
                      {inputValue.length}/140
                    </span>
                  )}
                </div>

                {/* Voice Call Microphone Trigger Button */}
                <button
                  type="button"
                  onClick={handleVoiceClick}
                  disabled={isSending}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all duration-200 shadow-md hover:scale-105 active:scale-95 flex-shrink-0 cursor-pointer disabled:opacity-50"
                  title={isEn ? "Start voice conversation" : "Sākt balss sarunu"}
                >
                  <Mic size={15} />
                </button>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isSending}
                  className="w-9 h-9 rounded-full bg-[var(--main-color)] hover:bg-[color-mix(in_srgb,var(--main-color)_90%,black)] text-white flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:hover:bg-[var(--main-color)] shadow-md hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <Send size={15} />
                </button>
              </form>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full relative border-2 border-[#de7c8a] flex items-center justify-center shadow-lg focus:outline-none select-none overflow-visible"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        
        {/* Inner circle wrapper to clip and display image or X */}
        <div className="w-full h-full rounded-full overflow-hidden bg-[var(--main-color)] relative z-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={24} className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {chatConfig === undefined ? (
                  <MessageSquare size={24} className="text-white" />
                ) : (
                  <img 
                    src={chatAvatarUrl} 
                    alt="Chat assistant" 
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Online Status Indicator (placed outside overflow-hidden inner circle to sit on top of the border) */}
        {!isOpen && (
          <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-500 z-30 flex items-center justify-center shadow-md">
            <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping" />
          </div>
        )}
      </motion.button>

    </div>
  );
}
