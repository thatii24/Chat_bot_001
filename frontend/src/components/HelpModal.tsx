"use client";

import React from "react";
import { X, HelpCircle, BookOpen, MessageSquare, Terminal, Lightbulb } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#111724] border border-white/10 p-6 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-cyan-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Help & Documentation</h3>
            <p className="text-xs text-slate-400">Quick guide to using Syntrix AI & RAG capabilities</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">Deep Thinking Reasoning</h4>
              <p className="text-slate-400 mt-0.5">
                Toggle the <strong>Deep Think</strong> button in the prompt box to trigger multi-step chain-of-thought logic before answering complex queries.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">Pinecone Vector Knowledge (RAG)</h4>
              <p className="text-slate-400 mt-0.5">
                Enable <strong>Tools → Pinecone RAG</strong> to automatically query indexed documents and receive verifiable citations in your conversation.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
            <Terminal className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">Multimodal & Code Execution</h4>
              <p className="text-slate-400 mt-0.5">
                Use the <strong>+</strong> button to attach codebases, images, or documents, and use <strong>Voice</strong> for hands-free speech queries.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold text-xs transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
