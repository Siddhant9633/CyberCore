"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, X, ArrowUp, RefreshCw, Bot, User, Trash2,
  Shield, Globe, MessageSquare, Lock, HelpCircle
} from "lucide-react";
import { sendAiMessage, AiChatMessage } from "@/lib/api";

const SUGGESTED_QUESTIONS = [
  "Is this website safe?",
  "Is this email a scam?",
  "How strong is my password?",
  "How do phishing attacks work?",
  "What should I do if I clicked a suspicious link?",
  "How can I protect my online accounts?",
];

export function FloatingAIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I’m CYBERCORE AI. I can help you understand cybersecurity threats, analyze suspicious activity, and improve your digital safety.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : input).trim();
    if (!text || loading) return;

    const userMsg: AiChatMessage = { role: "user", content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await sendAiMessage(text, newHistory);
      setMessages((prev) => [...prev, { role: "assistant", content: res.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered an error communicating with the CYBERCORE security core. Please verify your backend server is active.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I’m CYBERCORE AI. I can help you understand cybersecurity threats, analyze suspicious activity, and improve your digital safety.",
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Trigger Button (Bottom-Right Corner, Closed by default) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-lg transition-all duration-150 cursor-pointer ${
            open
              ? "bg-[#1B2430] text-[#F8FAFC] border border-[#1E2633]"
              : "bg-[#3B82F6] hover:bg-[#2563EB] text-white"
          }`}
          aria-label="Toggle CYBERCORE AI Assistant"
        >
          {open ? (
            <X className="w-4 h-4" />
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-xs font-medium">CYBERCORE AI</span>
            </>
          )}
        </button>
      </div>

      {/* Floating Chat Modal Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed bottom-20 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] h-[520px] max-h-[calc(100vh-7rem)] rounded-2xl bg-[#10151D] border border-[#1E2633] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Proper Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E2633] bg-[#10151D]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#F8FAFC] block leading-none">
                    CYBERCORE AI
                  </span>
                  <span className="text-[10px] text-[#22C55E] flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    Online
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151C26] transition cursor-pointer"
                  title="Reset conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151C26] transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-2 text-xs leading-relaxed ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-md bg-[#151C26] border border-[#1E2633] flex items-center justify-center text-[#3B82F6] shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-[#3B82F6] text-white"
                        : "bg-[#151C26] border border-[#1E2633] text-[#F8FAFC]"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 text-xs items-center text-[#94A3B8]">
                  <div className="w-6 h-6 rounded-md bg-[#151C26] border border-[#1E2633] flex items-center justify-center text-[#3B82F6] shrink-0">
                    <Sparkles className="w-3 h-3 animate-spin" />
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-[#151C26] border border-[#1E2633] flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin text-[#3B82F6]" />
                    <span>Analyzing...</span>
                  </div>
                </div>
              )}

              {/* Suggested Questions (shown below welcome message) */}
              {messages.length === 1 && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[10px] text-[#64748B] uppercase tracking-wider block font-medium">
                    Suggested Questions
                  </span>
                  <div className="flex flex-col gap-1">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-left text-xs text-[#94A3B8] hover:text-[#F8FAFC] bg-[#151C26] hover:bg-[#1B2430] border border-[#1E2633] px-3 py-2 rounded-lg transition cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-[#1E2633] bg-[#10151D]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a security question..."
                  className="w-full bg-[#151C26] border border-[#1E2633] focus:border-[#3B82F6] rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none transition"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-1.5 w-7 h-7 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-30 disabled:hover:bg-[#3B82F6] text-white flex items-center justify-center transition cursor-pointer"
                  title="Send"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
