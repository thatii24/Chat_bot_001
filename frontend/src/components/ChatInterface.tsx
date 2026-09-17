"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Wrench,
  Lightbulb,
  Mic,
  Send,
  Plus,
  ChevronDown,
  ChevronRight,
  Globe,
  Database,
  Terminal,
  Paperclip,
  Share2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  deepThink?: {
    thinkingSteps: string[];
    durationMs?: number;
  };
  sources?: { title: string; score: number }[];
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string, options?: { deepThink?: boolean; tools?: string[] }) => void;
  selectedModel: string;
}

export default function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  selectedModel,
}: ChatInterfaceProps) {
  const [inputVal, setInputVal] = useState("");
  const [deepThinkActive, setDeepThinkActive] = useState(true);
  const [activeTools, setActiveTools] = useState<string[]>(["web-search", "pinecone-rag"]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<{ [key: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleThinking = (id: string) => {
    setExpandedThinking((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSend = () => {
    if (!inputVal.trim() || isLoading) return;
    onSendMessage(inputVal, {
      deepThink: deepThinkActive,
      tools: activeTools,
    });
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-3xl mx-auto w-full group animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 mb-1.5 px-1 text-xs text-slate-400">
                {isUser ? (
                  <>
                    <span className="font-medium text-slate-300">You</span>
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                      <User className="w-3 h-3" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 p-[1px]">
                      <div className="w-full h-full rounded-full bg-[#0E1522] flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-cyan-300" />
                      </div>
                    </div>
                    <span className="font-semibold text-slate-200">{selectedModel}</span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </>
                )}
              </div>

              {/* Message Body */}
              <div
                className={`rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? "bg-[#1E293B]/80 text-white border border-white/10 rounded-tr-sm max-w-[85%]"
                    : "bg-[#121826]/70 text-slate-200 border border-white/[0.07] backdrop-blur-xl rounded-tl-sm w-full"
                }`}
              >
                {/* Deep Think reasoning accordion for Assistant */}
                {!isUser && msg.deepThink && (
                  <div className="mb-3.5 pb-3 border-b border-white/[0.07]">
                    <button
                      onClick={() => toggleThinking(msg.id)}
                      className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Reasoning Process ({msg.deepThink.thinkingSteps.length} steps)</span>
                      {expandedThinking[msg.id] ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {expandedThinking[msg.id] && (
                      <div className="mt-2.5 pl-4 border-l-2 border-cyan-500/30 space-y-1.5 text-xs text-slate-400 font-mono">
                        {msg.deepThink.thinkingSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-cyan-500/70 shrink-0">›</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Content rendering */}
                <div className="whitespace-pre-wrap font-sans text-slate-100">
                  {msg.content}
                </div>

                {/* Sources & Citations if available */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-wrap gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Grounding Citations:
                    </span>
                    {msg.sources.map((src, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-slate-300 flex items-center gap-1"
                      >
                        <Database className="w-2.5 h-2.5 text-emerald-400" />
                        {src.title} ({(src.score * 100).toFixed(0)}%)
                      </span>
                    ))}
                  </div>
                )}

                {/* Action buttons on hover */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-white/[0.05] flex items-center justify-between text-slate-400 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-white p-1 rounded hover:bg-white/[0.06] transition flex items-center gap-1"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[10px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        className="hover:text-white p-1 rounded hover:bg-white/[0.06] transition"
                        title="Good response"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="hover:text-white p-1 rounded hover:bg-white/[0.06] transition"
                        title="Bad response"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Streaming Indicator */}
        {isLoading && (
          <div className="flex flex-col items-start max-w-3xl mx-auto w-full animate-in fade-in">
            <div className="flex items-center gap-2 mb-1.5 px-1 text-xs text-slate-400">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 p-[1px]">
                <div className="w-full h-full rounded-full bg-[#0E1522] flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-cyan-300 animate-spin" />
                </div>
              </div>
              <span className="font-semibold text-slate-200">{selectedModel} is thinking...</span>
            </div>
            <div className="rounded-2xl p-4 bg-[#121826]/70 border border-white/[0.07] backdrop-blur-xl w-full flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse delay-300"></span>
              </div>
              <span className="text-xs text-slate-400">Synthesizing context and formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Bottom Prompt Input in Chat Mode */}
      <div className="p-4 md:px-12 pb-6 max-w-3xl mx-auto w-full relative z-20">
        <div className="rounded-2xl bg-[#121826]/90 backdrop-blur-2xl border border-white/[0.09] shadow-[0_10px_35px_rgba(0,0,0,0.5)] focus-within:border-cyan-500/40 p-3">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up question..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeepThinkActive(!deepThinkActive)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                  deepThinkActive
                    ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                    : "bg-white/[0.03] border-white/[0.07] text-slate-400"
                }`}
              >
                <Lightbulb className="w-3 h-3" />
                <span>Deep Think</span>
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={!inputVal.trim() || isLoading}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                inputVal.trim() && !isLoading
                  ? "bg-white text-slate-950 shadow-md cursor-pointer hover:bg-slate-200"
                  : "bg-white/20 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
