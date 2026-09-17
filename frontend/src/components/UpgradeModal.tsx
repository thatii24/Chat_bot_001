"use client";

import React from "react";
import { X, Sparkles, Check, Zap, Shield, Cpu, Flame } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#111724] border border-cyan-500/30 p-6 shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden">
        {/* Glow ambient decoration */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 p-[1.5px] shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            <div className="w-full h-full rounded-2xl bg-[#0F1626] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Upgrade to Syntrix Pro</h3>
            <p className="text-xs text-slate-400">Unlock maximum computing power, reasoning, and multimodal tools</p>
          </div>
        </div>

        {/* Plan Card */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 mb-6">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-2xl font-black text-white">$49</span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold">
              Most Popular
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Unlimited access to <strong>Syntrix v4.2 & Gemini 2.5 Pro</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ultra-deep thinking mode with 2M token context window</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI Video & 8K Image Generation with priority render queue</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Pinecone Vector DB private enterprise connector</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sub-second streaming latency and dedicated high-speed GPU pods</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => {
            alert("Pro membership activated! Enjoy unlimited Syntrix v4.2 access.");
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:opacity-90 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(34,211,238,0.4)] transition"
        >
          Activate Pro Membership
        </button>
      </div>
    </div>
  );
}
