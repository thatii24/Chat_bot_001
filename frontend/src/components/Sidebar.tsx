"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Image as ImageIcon,
  Video,
  Code2,
  LayoutGrid,
  FolderKanban,
  Sparkles,
  MessageSquare,
  Trash2,
  ChevronRight,
  Zap,
} from "lucide-react";

interface SidebarProps {
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onOpenUpgrade: () => void;
  onSelectFeature: (featureName: string) => void;
}

export const initialChats = [
  { id: "chat-1", title: "Image Editing Request", time: "2h ago", preview: "Add futuristic lighting to the background" },
  { id: "chat-2", title: "Replace characters request", time: "Yesterday", preview: "Swap the protagonist avatar" },
  { id: "chat-3", title: "Shorten Notification Message", time: "2 days ago", preview: "Make push notifications concise" },
  { id: "chat-4", title: "Image Concept Creation", time: "3 days ago", preview: "Cyberpunk neon city concept art" },
  { id: "chat-5", title: "Design Enhancement Guide", time: "5 days ago", preview: "Tips for dark mode contrast & glassmorphism" },
];

export default function Sidebar({
  currentChatId,
  onSelectChat,
  onNewChat,
  onOpenUpgrade,
  onSelectFeature,
}: SidebarProps) {
  const [chats, setChats] = useState(initialChats);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    { id: "images", label: "Images", icon: ImageIcon, prompt: "Generate high-resolution photorealistic images and digital artwork." },
    { id: "videos", label: "Videos", icon: Video, prompt: "Create cinematic short-form AI video scenes from text prompts." },
    { id: "codes", label: "Codes", icon: Code2, prompt: "Write, debug, refactor, and explain full-stack code and algorithms." },
    { id: "apps", label: "Apps", icon: LayoutGrid, prompt: "Design micro-apps, UI components, and modern interactive prototypes." },
    { id: "projects", label: "Projects", icon: FolderKanban, prompt: "Manage multi-step development pipelines and workspace repos." },
  ];

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChats(chats.filter((c) => c.id !== id));
  };

  return (
    <aside className="w-[280px] min-w-[280px] h-screen bg-[#0D111A]/95 backdrop-blur-2xl border-r border-white/[0.07] flex flex-col justify-between p-4 select-none z-20 transition-all duration-300">
      {/* Top Header & Brand */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={onNewChat}>
            {/* Glowing Mini Orb Logo */}
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-emerald-400 to-sky-300 p-[1.5px] shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:shadow-[0_0_22px_rgba(34,211,238,0.8)] transition-all">
              <div className="w-full h-full rounded-full bg-[#0B0E14] flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 via-emerald-500/20 to-transparent"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 blur-[1px]"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold tracking-wide text-white text-base leading-tight">
                Syntrix
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition"
            title="Search chats"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar Collapsible */}
        {showSearch && (
          <div className="px-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                autoFocus
                className="w-full bg-[#141B29] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        )}

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="group relative w-full py-2.5 px-4 rounded-xl flex items-center gap-2.5 text-sm font-medium text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300"
        >
          <div className="w-5 h-5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span>New Chat</span>
        </button>

        {/* FEATURES Section */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="px-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Features
          </span>
          <div className="flex flex-col gap-0.5">
            {features.map((f) => {
              const Icon = f.icon;
              const isActive = activeFeature === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFeature(f.id);
                    onSelectFeature(f.label);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white/[0.08] text-white border border-white/10 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* YOUR CHATS Section */}
        <div className="flex flex-col gap-1 pt-2">
          <span className="px-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Your Chats
          </span>
          <div className="flex flex-col gap-0.5 max-h-[190px] overflow-y-auto pr-1">
            {filteredChats.map((chat) => {
              const isCurrent = currentChatId === chat.id;
              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                    isCurrent
                      ? "bg-cyan-950/40 text-cyan-200 border border-cyan-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="truncate pr-2">{chat.title}</span>
                  <button
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 transition"
                    title="Delete chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
            {filteredChats.length === 0 && (
              <span className="text-xs text-slate-600 px-3 py-2">No chats found</span>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade to Pro Card */}
      <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-b from-[#131B2A] to-[#0E1522] border border-white/[0.09] shadow-xl group">
        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/15 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/25 transition-all"></div>

        <div className="relative flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-300 to-sky-400 p-[1.5px] shadow-[0_0_12px_rgba(34,211,238,0.4)] shrink-0">
            <div className="w-full h-full rounded-full bg-[#0F1626] flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-300" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">Upgrade to Pro</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Get more tools, faster AI, and exclusive features
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-lg font-bold text-white">$49</span>
          <span className="text-xs text-slate-500">/month</span>
        </div>

        <button
          onClick={onOpenUpgrade}
          className="mt-3 w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-900" />
          <span>Upgrade Now</span>
        </button>
      </div>
    </aside>
  );
}
