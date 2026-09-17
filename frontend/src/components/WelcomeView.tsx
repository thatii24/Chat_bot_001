"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  Plus,
  Wrench,
  Lightbulb,
  Mic,
  Send,
  ArrowUpRight,
  Image as ImageIcon,
  Video,
  Code2,
  Globe,
  Database,
  Terminal,
  Paperclip,
  Check,
  ChevronDown,
  Volume2,
} from "lucide-react";

interface WelcomeViewProps {
  onSendMessage: (message: string, options?: { deepThink?: boolean; tools?: string[] }) => void;
  onSelectFeatureCard: (featureTitle: string, prompt: string) => void;
}

export default function WelcomeView({ onSendMessage, onSelectFeatureCard }: WelcomeViewProps) {
  const [inputVal, setInputVal] = useState("");
  const [deepThinkActive, setDeepThinkActive] = useState(false);
  const [deepThinkMenuOpen, setDeepThinkMenuOpen] = useState(false);
  const [deepThinkMode, setDeepThinkMode] = useState<"standard" | "extended">("extended");

  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [activeTools, setActiveTools] = useState<string[]>(["web-search", "pinecone-rag"]);

  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTool = (toolId: string) => {
    if (activeTools.includes(toolId)) {
      setActiveTools(activeTools.filter((t) => t !== toolId));
    } else {
      setActiveTools([...activeTools, toolId]);
    }
  };

  const handleSend = () => {
    if (!inputVal.trim() && attachedFiles.length === 0) return;
    onSendMessage(inputVal, {
      deepThink: deepThinkActive,
      tools: activeTools,
    });
    setInputVal("");
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setAttachedFiles((prev) => [...prev, fileName]);
    }
  };

  const toggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate speech-to-text
      setTimeout(() => {
        setInputVal("Build a modern high-performance RAG agent with Gemini 2.5 and Pinecone");
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const featureCards = [
    {
      id: "image-gen",
      title: "Image Generator",
      description: "Turn ideas into stunning visuals in seconds.",
      icon: ImageIcon,
      prompt: "Generate a futuristic cyberpunk city with neon reflections in 8k cinematic lighting",
    },
    {
      id: "video-gen",
      title: "Video Generator",
      description: "Create cinematic videos from simple prompts.",
      prompt: "Create a 5-second cinematic drone shot flying over Nordic misty mountains at sunrise",
      icon: Video,
    },
    {
      id: "dev-assistant",
      title: "Dev Assistant",
      description: "Accelerate development with intelligent assistance.",
      prompt: "Explain how to implement streaming RAG with Gemini 2.5 and Pinecone Vector DB in Next.js",
      icon: Code2,
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full relative z-10 py-6">
      {/* 3D Glowing Sphere / Orb Centerpiece */}
      <div className="mb-6 flex flex-col items-center">
        <div className="orb-container">
          <div className="orb-shadow-ground"></div>
          <div className="orb-sphere">
            <div className="orb-inner-swirl"></div>
            <div className="orb-highlight"></div>
            <div className="orb-secondary-highlight"></div>
          </div>
        </div>
      </div>

      {/* Hero Welcome Typography */}
      <div className="text-center mb-8">
        <h2 className="text-xs md:text-sm font-bold tracking-[0.25em] text-slate-400 uppercase mb-2">
          Welcome Back
        </h2>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.15)]">
          Bring your ideas to life today
        </h1>
      </div>

      {/* Main Glassmorphic Input Box */}
      <div className="w-full max-w-2xl relative mb-8">
        <div className="relative rounded-2xl bg-[#121826]/80 backdrop-blur-2xl border border-white/[0.09] shadow-[0_10px_40px_rgba(0,0,0,0.5)] focus-within:border-cyan-500/40 focus-within:shadow-[0_0_35px_rgba(34,211,238,0.15)] transition-all duration-300 p-3.5">
          {/* File attachments badge list */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 px-1">
              {attachedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs"
                >
                  <Paperclip className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">{file}</span>
                  <button
                    onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                    className="hover:text-red-400 ml-1 text-slate-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input text row */}
          <div className="flex items-center gap-2.5 px-1 py-1">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening to your voice..." : "Ask me anything..."}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-normal"
            />
          </div>

          {/* Bottom Action Controls Bar */}
          <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-2 relative">
              {/* Add Attachment Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileAttach}
                className="hidden"
                multiple
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-slate-300 flex items-center justify-center hover:text-white transition"
                title="Attach document or image"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {/* Tools Pill Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setToolsMenuOpen(!toolsMenuOpen);
                    setDeepThinkMenuOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                    activeTools.length > 0
                      ? "bg-white/[0.05] border-white/10 text-slate-300 hover:text-white"
                      : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Wrench className="w-3 h-3 text-cyan-400" />
                  <span>Tools</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {toolsMenuOpen && (
                  <div
                    className="absolute bottom-full left-0 mb-2 w-64 bg-[#121826] border border-white/10 rounded-xl p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
                    onMouseLeave={() => setToolsMenuOpen(false)}
                  >
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                      Enabled Tools
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <button
                        onClick={() => toggleTool("web-search")}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/[0.05] text-xs text-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Web Search</span>
                        </div>
                        {activeTools.includes("web-search") && <Check className="w-3 h-3 text-cyan-400" />}
                      </button>
                      <button
                        onClick={() => toggleTool("pinecone-rag")}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/[0.05] text-xs text-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Pinecone RAG</span>
                        </div>
                        {activeTools.includes("pinecone-rag") && <Check className="w-3 h-3 text-emerald-400" />}
                      </button>
                      <button
                        onClick={() => toggleTool("code-interpreter")}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/[0.05] text-xs text-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <Terminal className="w-3.5 h-3.5 text-amber-400" />
                          <span>Code Interpreter</span>
                        </div>
                        {activeTools.includes("code-interpreter") && <Check className="w-3 h-3 text-amber-400" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Deep Think Pill Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setDeepThinkMenuOpen(!deepThinkMenuOpen);
                    setToolsMenuOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                    deepThinkActive
                      ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                      : "bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Lightbulb className={`w-3 h-3 ${deepThinkActive ? "text-cyan-300 fill-cyan-400/20" : "text-slate-400"}`} />
                  <span>Deep Think</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {deepThinkMenuOpen && (
                  <div
                    className="absolute bottom-full left-0 mb-2 w-56 bg-[#121826] border border-white/10 rounded-xl p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
                    onMouseLeave={() => setDeepThinkMenuOpen(false)}
                  >
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                      Reasoning Effort
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <button
                        onClick={() => {
                          setDeepThinkActive(true);
                          setDeepThinkMode("extended");
                          setDeepThinkMenuOpen(false);
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs transition ${
                          deepThinkActive && deepThinkMode === "extended"
                            ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20"
                            : "hover:bg-white/[0.05] text-slate-300"
                        }`}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-semibold">Deep Thinking</span>
                          <span className="text-[10px] text-slate-400">Step-by-step logic chains</span>
                        </div>
                        {deepThinkActive && deepThinkMode === "extended" && <Check className="w-3 h-3 text-cyan-400" />}
                      </button>

                      <button
                        onClick={() => {
                          setDeepThinkActive(false);
                          setDeepThinkMenuOpen(false);
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs transition ${
                          !deepThinkActive
                            ? "bg-white/[0.08] text-white"
                            : "hover:bg-white/[0.05] text-slate-300"
                        }`}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-semibold">Standard Speed</span>
                          <span className="text-[10px] text-slate-400">Fast direct generation</span>
                        </div>
                        {!deepThinkActive && <Check className="w-3 h-3 text-cyan-400" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls: Voice & Send */}
            <div className="flex items-center gap-2">
              {/* Voice Button */}
              <button
                onClick={toggleVoice}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  isRecording
                    ? "bg-red-500/20 border-red-500/40 text-red-300 animate-pulse"
                    : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.07] text-slate-300 hover:text-white"
                }`}
              >
                {isRecording ? (
                  <>
                    <Volume2 className="w-3 h-3 text-red-400 animate-bounce" />
                    <span>Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3 h-3 text-slate-400" />
                    <span>Voice</span>
                  </>
                )}
              </button>

              {/* Circular Send Button */}
              <button
                onClick={handleSend}
                disabled={!inputVal.trim() && attachedFiles.length === 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  inputVal.trim() || attachedFiles.length > 0
                    ? "bg-white hover:bg-slate-200 text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.4)] cursor-pointer"
                    : "bg-white/20 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-3.5 h-3.5 -translate-x-[0.5px] translate-y-[0.5px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Bottom Quick Feature Cards */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {featureCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectFeatureCard(card.title, card.prompt)}
              className="group relative cursor-pointer rounded-2xl p-4 bg-[#111724]/70 hover:bg-[#151D2D]/90 border border-white/[0.07] hover:border-cyan-500/30 backdrop-blur-xl shadow-lg hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col justify-between h-[110px]"
            >
              {/* Header row with Icon and Arrow */}
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              {/* Title & Description */}
              <div className="mt-2">
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-200 transition">
                  {card.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
