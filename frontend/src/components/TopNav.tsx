"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles, Sliders, HelpCircle, LayoutDashboard, Check } from "lucide-react";

interface TopNavProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const models = [
  { id: "Syntrix v4.2", name: "Syntrix v4.2", description: "Flagship multimodal reasoning engine (Default)", tag: "Pro" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", description: "Deep thinking & 2M context window", tag: "Fast & Deep" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", description: "Ultra-fast response with high accuracy", tag: "Turbo" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", description: "Superior coding & nuance generation", tag: "Code" },
];

export default function TopNav({
  selectedModel,
  onSelectModel,
  activeNav,
  setActiveNav,
  onOpenSettings,
  onOpenHelp,
}: TopNavProps) {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  return (
    <header className="h-16 w-full flex items-center justify-between px-6 z-10 select-none">
      {/* Model Selector Pill on Left */}
      <div className="relative">
        <button
          onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{selectedModel}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${modelDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {modelDropdownOpen && (
          <div
            className="absolute top-full left-0 mt-2 w-72 bg-[#121826] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
            onMouseLeave={() => setModelDropdownOpen(false)}
          >
            <div className="px-2 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Select AI Model
            </div>
            <div className="flex flex-col gap-1">
              {models.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onSelectModel(m.name);
                    setModelDropdownOpen(false);
                  }}
                  className={`flex items-start justify-between p-2 rounded-xl text-left transition ${
                    selectedModel === m.name
                      ? "bg-cyan-500/10 border border-cyan-500/20 text-white"
                      : "hover:bg-white/[0.05] text-slate-300"
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{m.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.08] text-cyan-300">
                        {m.tag}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">{m.description}</span>
                  </div>
                  {selectedModel === m.name && (
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Navigation & Profile */}
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-5 text-xs font-medium">
          <button
            onClick={() => setActiveNav("Dashboard")}
            className={`transition relative py-1 ${
              activeNav === "Dashboard"
                ? "text-white font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-cyan-400 after:to-emerald-400 after:rounded-full"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setActiveNav("Settings");
              onOpenSettings();
            }}
            className={`transition ${
              activeNav === "Settings" ? "text-white font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => {
              setActiveNav("Help & Support");
              onOpenHelp();
            }}
            className={`transition ${
              activeNav === "Help & Support" ? "text-white font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Help & Support
          </button>
        </nav>

        {/* User Avatar */}
        <div className="relative cursor-pointer group">
          <div className="w-8 h-8 rounded-full ring-2 ring-emerald-500/40 p-[1px] bg-gradient-to-tr from-cyan-400 to-emerald-400">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0B0E14] rounded-full"></span>
        </div>
      </div>
    </header>
  );
}
