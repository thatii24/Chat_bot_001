import { Bot, Sparkles, Send } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <div className="flex items-center gap-2 font-semibold text-emerald-400">
          <Bot className="w-6 h-6" />
          <span>Gemini RAG Chatbot</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Next.js + TypeScript + Tailwind</span>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center text-center max-w-2xl my-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Conversational AI with RAG
        </h1>
        <p className="mt-4 text-slate-400 text-base md:text-lg">
          Powered by Google Gemini, Pinecone Vector DB, and PostgreSQL.
        </p>

        <div className="w-full mt-8 flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-2 shadow-2xl focus-within:border-emerald-500/50 transition">
          <input
            type="text"
            placeholder="Ask anything or upload documents..."
            className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium p-2.5 rounded-lg transition">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <footer className="text-xs text-slate-600">
        Dockerized Full-Stack Architecture
      </footer>
    </main>
  );
}
