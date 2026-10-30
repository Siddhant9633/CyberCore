"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot, User, Send, Shield, Sparkles, RefreshCw,
  Trash2, HelpCircle, ArrowRight, CheckCircle2, CornerDownLeft
} from "lucide-react";
import { sendAiMessage, AiChatMessage } from "@/lib/api";

const PRESET_QUERIES = [
  "What immediate steps should I take if I entered credentials on a phishing site?",
  "How can I tell if an SMS claiming my bank account is suspended is real?",
  "Why does CYBERCORE check domain age and RDAP when analyzing URLs?",
  "How does k-Anonymity protect my password while checking for breaches?",
];

export default function AiAdvisorPage() {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: "assistant",
      content: `Hello! I am **CYBERCORE AI**, your dedicated cybersecurity advisor and incident triage assistant.

I can help you:
- Evaluate whether a specific email, SMS, or URL seems dangerous
- Recommend immediate incident containment if you clicked a suspicious link
- Explain technical security indicators (DNSSEC, TLS ciphers, SPF/DMARC)
- Provide step-by-step guidance to secure compromised personal or organizational accounts

What digital safety question can I analyze for you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: AiChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await sendAiMessage(text, updatedMessages);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.response },
      ]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Unable to connect to the CYBERCORE AI core. Please verify your connection or ensure the backend server is reachable.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="space-y-4 max-w-5xl h-[calc(100vh-8rem)] flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1F2937] shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">AI Security Assistant</h1>
            <span className="text-[10px] font-mono uppercase bg-[#3B82F6]/10 text-[#38BDF8] border border-[#3B82F6]/25 px-2 py-0.5 rounded">
              Llama-3 SecOps Fine-tuned
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Interactive AI advisor for incident response, threat comprehension, and security recommendations.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1F2937] hover:border-[#334155] text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer w-fit"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset Conversation</span>
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 rounded-xl bg-[#111827] border border-[#1F2937] p-4 sm:p-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 text-xs leading-relaxed ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-[#3B82F6] text-white"
                  : "bg-[#0D121C] border border-[#1F2937] text-[#F8FAFC]"
              }`}
            >
              <div className="whitespace-pre-wrap space-y-2">
                {msg.content}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-[#161F2E] border border-[#1F2937] flex items-center justify-center text-[#94A3B8] shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 text-xs">
            <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-xl bg-[#0D121C] border border-[#1F2937] text-[#94A3B8] flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#38BDF8]" />
              <span>Analyzing incident indicators and consulting threat heuristics...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Inquiries */}
      <div className="shrink-0 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-[#64748B]">Common topics:</span>
        {PRESET_QUERIES.map((preset, i) => (
          <button
            key={i}
            onClick={() => handleSend(preset)}
            className="text-[11px] px-2.5 py-1 rounded bg-[#111827] border border-[#1F2937] hover:border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] transition truncate max-w-xs"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="shrink-0 relative"
      >
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask a security question, paste a suspicious message snippet, or request emergency triage..."
          className="w-full bg-[#111827] border border-[#1F2937] rounded-xl pl-3.5 pr-20 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#3B82F6] resize-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2.5 bottom-3 px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-40 text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <span>Send</span>
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
