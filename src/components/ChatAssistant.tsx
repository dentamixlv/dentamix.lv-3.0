"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Trash2, Bot, User, Loader2, Sparkles, Phone, MessageCircle } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Custom helper to parse basic markdown (**bold** and newlines)
function formatMessageContent(content: string) {
  if (!content) return "";
  
  // Split by newlines
  const lines = content.split("\n");
  
  return lines.map((line, lineIdx) => {
    // Look for **bold text**
    const parts = line.split(/(\*\*.*?\*\*)/g);
    
    const elements = parts.map((part, partIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={partIdx} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
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
  const respondAction = useAction(api.assistant.respond);

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
    title: isEn ? "Dentamix assistant" : "Dentamix palīgs",
    online: isEn ? "Online" : "Tiešsaistē",
    welcome: isEn 
      ? "Hello! I am Ieva. How can I help you? You can ask me anything about dental services, prices, or dentists!" 
      : "Sveiki! Esmu Ieva. Kā varu Jums palīdzēt? Varat man jautāt jebko par zobārstniecības pakalpojumiem, cenām, zobārstiem!",
    placeholder: isEn ? "Type a message..." : "Rakstīt ziņu...",
    clearTooltip: isEn ? "Clear conversation" : "Dzēst saraksti",
    clearConfirm: isEn 
      ? "Are you sure you want to delete this chat history?" 
      : "Vai tiešām vēlaties dzēst šo saraksti?",
    suggestions: isEn 
      ? [
          { text: "How can I book an appointment?", prompt: "How can I book an appointment?" },
          { text: "Where are you located?", prompt: "Where are you located?" },
          { text: "What are your prices?", prompt: "What are your dental prices?" }
        ]
      : [
          { text: "Kā pieteikties vizītei?", prompt: "Kā pieteikties vizītei?" },
          { text: "Kur jūs atrodaties?", prompt: "Kur jūs atrodaties?" },
          { text: "Kādas ir pakalpojumu cenas?", prompt: "Kādas ir jūsu pakalpojumu cenas?" }
        ]
  };

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
      });

    } catch (error) {
      console.error("Failed to send message:", error);
      setOptimisticMessage(null); // Clear immediately on failure
      // Clean up potentially stale/nonexistent conversation ID so the next try creates a new conversation
      setConversationId(null);
      localStorage.removeItem("dentamix_chat_conv_id");
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
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border border-white/20">
                  <img 
                    src="https://images.prismic.io/dentamix-v30/aie7BweQX7-eW__g_zobarsts-riga-chat.png" 
                    alt="Dentamix AI" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">{strings.title}</h3>
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

            {/* Chat Body */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              
              {/* Welcome Message */}
              <div className="flex gap-2.5 items-start max-w-[85%]">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img 
                    src="https://images.prismic.io/dentamix-v30/aie7BweQX7-eW__g_zobarsts-riga-chat.png" 
                    alt="Dentamix AI" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm text-sm text-gray-800 leading-relaxed">
                    {strings.welcome}
                  </div>
                  
                  {/* Call and WhatsApp Buttons for Welcome Message */}
                  {(!displayMessages || displayMessages.length === 0) && (
                    <div className="flex gap-2 pl-1">
                      <a
                        href="tel:+37129419999"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#de7c8a]/30 text-xs font-semibold text-[#511B29] transition-all hover:bg-[#de7c8a]/10 active:scale-95 shadow-sm"
                      >
                        <Phone size={12} className="text-[#de7c8a]" />
                        <span>{isEn ? "Call" : "Zvanīt"}</span>
                      </a>
                      <a
                        href="https://wa.me/37129419999"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 transition-all hover:bg-emerald-100 active:scale-95 shadow-sm"
                      >
                        <MessageCircle size={12} className="text-emerald-500 fill-emerald-500" />
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
                    {strings.suggestions.map((sug, idx) => (
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
                        isAssistant ? "" : "bg-[var(--main-color)] text-white"
                      }`}
                    >
                      {isAssistant ? (
                        <img 
                          src="https://images.prismic.io/dentamix-v30/aie7BweQX7-eW__g_zobarsts-riga-chat.png" 
                          alt="Dentamix AI" 
                          className="w-full h-full object-cover"
                        />
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
                        <div className="flex gap-2 pl-1">
                          <a
                            href="tel:+37129419999"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#de7c8a]/30 text-xs font-semibold text-[#511B29] transition-all hover:bg-[#de7c8a]/10 active:scale-95 shadow-sm"
                          >
                            <Phone size={12} className="text-[#de7c8a]" />
                            <span>{isEn ? "Call" : "Zvanīt"}</span>
                          </a>
                          <a
                            href="https://wa.me/37129419999"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 transition-all hover:bg-emerald-100 active:scale-95 shadow-sm"
                          >
                            <MessageCircle size={12} className="text-emerald-500 fill-emerald-500" />
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
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img 
                      src="https://images.prismic.io/dentamix-v30/aie7BweQX7-eW__g_zobarsts-riga-chat.png" 
                      alt="Dentamix AI" 
                      className="w-full h-full object-cover"
                    />
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

            {/* Input Footer */}
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
              <button
                type="submit"
                disabled={!inputValue.trim() || isSending}
                className="w-9 h-9 rounded-full bg-[var(--main-color)] hover:bg-[color-mix(in_srgb,var(--main-color)_90%,black)] text-white flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:hover:bg-[var(--main-color)] shadow-md hover:scale-105 active:scale-95 flex-shrink-0"
              >
                <Send size={15} />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full relative p-[2px] flex items-center justify-center shadow-lg focus:outline-none select-none overflow-visible"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Rotating border gradient layer (clipped to circle wrapper) */}
        <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center pointer-events-none">
          <div className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#de7c8a,#de7c8a_30%,#10b981_60%,#de7c8a)] animate-[spin_4s_linear_infinite]" />
        </div>
        
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
                className="relative w-full h-full"
              >
                <img 
                  src="https://images.prismic.io/dentamix-v30/aie7BweQX7-eW__g_zobarsts-riga-chat.png" 
                  alt="Chat assistant" 
                  className="w-full h-full object-cover"
                />
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
