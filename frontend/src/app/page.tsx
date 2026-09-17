"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import WelcomeView from "@/components/WelcomeView";
import ChatInterface, { Message } from "@/components/ChatInterface";
import UpgradeModal from "@/components/UpgradeModal";
import SettingsModal from "@/components/SettingsModal";
import HelpModal from "@/components/HelpModal";

export default function Home() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("Syntrix v4.2");
  const [activeNav, setActiveNav] = useState("Dashboard");

  // Modals state
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    // Populate sample conversation for existing chats
    if (id === "chat-1") {
      setMessages([
        {
          id: "m-1",
          role: "user",
          content: "Can you help me adjust the lighting and background reflections for this futuristic visual concept?",
          timestamp: "2h ago",
        },
        {
          id: "m-2",
          role: "assistant",
          content: "Here are 3 key visual adjustments to enhance the atmosphere:\n\n1. **Subsurface Scattering & Ambient Occlusion**: Increase cyan point light sources behind the subject to generate crisp edge highlights.\n2. **Volumetric Fog & Bloom**: Soften harsh specular glares with a 15% blur radial pass.\n3. **Color Balance**: Shift shadow undertones from pitch black to deep obsidian (#0B0E14) for cinematic depth.",
          timestamp: "2h ago",
          deepThink: {
            thinkingSteps: [
              "Analyzing visual query parameters and artistic style...",
              "Evaluating contrast, lighting curves, and chromatic balance...",
              "Generating concrete aesthetic recommendations...",
            ],
          },
        },
      ]);
    } else {
      setMessages([
        {
          id: "m-init-1",
          role: "user",
          content: `Opening chat: ${id}`,
          timestamp: "Just now",
        },
        {
          id: "m-init-2",
          role: "assistant",
          content: `Loaded conversation session ${id}. How would you like to proceed with Syntrix ${selectedModel}?`,
          timestamp: "Just now",
        },
      ]);
    }
  };

  const handleSelectFeature = (featureName: string) => {
    handleNewChat();
    handleSendMessage(`Explore ${featureName} workflows with AI assistance.`);
  };

  const handleSelectFeatureCard = (featureTitle: string, prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleSendMessage = (text: string, options?: { deepThink?: boolean; tools?: string[] }) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentChatId("active-session");
    setIsLoading(true);

    // Simulate AI response with deep reasoning steps and streaming feel
    setTimeout(() => {
      let responseText = "";
      let thinkingSteps: string[] = [];
      let sources: { title: string; score: number }[] = [];

      if (options?.deepThink) {
        thinkingSteps = [
          "Parsing user intent and semantic context...",
          "Retrieving relevant embeddings from Pinecone knowledge base...",
          "Applying chain-of-thought synthesis and validating structural correctness...",
          "Drafting response with optimal clarity and high precision...",
        ];
      }

      if (options?.tools?.includes("pinecone-rag")) {
        sources = [
          { title: "knowledge_base_rag_v2.pdf", score: 0.94 },
          { title: "gemini_architecture_docs.md", score: 0.89 },
        ];
      }

      if (text.toLowerCase().includes("image") || text.toLowerCase().includes("city") || text.toLowerCase().includes("visual")) {
        responseText = `Here is the conceptual breakdown for your visual request:\n\n✨ **Prompt Formulation:**\n> *"A hyper-detailed futuristic metropolis bathed in iridescent cyan and emerald neon hues, reflections cascading across wet obsidian asphalt, cinematic anamorphic lens, 8k resolution."*\n\n🎨 **Composition Guidelines:**\n- **Color Palette:** Obsidian (#0B0E14), Neon Cyan (#22D3EE), Vibrant Emerald (#10B981)\n- **Lighting Ratio:** 3:1 high-contrast directional key lighting\n- **Focal Length:** 35mm wide-angle for expansive scale.`;
      } else if (text.toLowerCase().includes("code") || text.toLowerCase().includes("rag") || text.toLowerCase().includes("assistant")) {
        responseText = `### Next.js RAG Pipeline Implementation\n\nHere is how you connect Google Gemini 2.5 with Pinecone Vector DB for context-aware responses:\n\n\`\`\`typescript\nimport { GoogleGenAI } from "@google/genai";\nimport { Pinecone } from "@pinecone-database/pinecone";\n\nconst ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });\nconst pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });\n\nexport async function queryRAG(userQuery: string) {\n  // 1. Generate query embedding\n  const embedding = await ai.models.embedContent({\n    model: "text-embedding-004",\n    content: userQuery,\n  });\n\n  // 2. Query Pinecone for top matches\n  const index = pc.index("gemini-rag-index");\n  const queryResponse = await index.query({\n    vector: embedding.embedding.values,\n    topK: 3,\n    includeMetadata: true,\n  });\n\n  return queryResponse.matches;\n}\n\`\`\`\n\n✅ This handles vector retrieval with sub-50ms latency.`;
      } else {
        responseText = `I'm ready to assist you with **"${text}"** using **${selectedModel}**.\n\nHere are some actions we can take:\n- **Analyze & Expand**: Break this task down into structured milestones.\n- **Execute**: Generate production-ready assets, code, or documentation.\n- **Verify**: Cross-check with ground knowledge documents and search benchmarks.\n\nLet me know how you'd like to proceed!`;
      }

      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        deepThink: options?.deepThink ? { thinkingSteps } : undefined,
        sources: sources.length > 0 ? sources : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex h-screen w-screen bg-[#0B0E14] text-slate-100 overflow-hidden relative font-sans select-none">
      {/* Ambient background glows matching the screenshot */}
      <div className="ambient-glow-top-right"></div>
      <div className="ambient-glow-center"></div>

      {/* Sidebar Navigation */}
      <Sidebar
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onSelectFeature={handleSelectFeature}
      />

      {/* Main Content Area Frame */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Navbar */}
        <TopNav
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* Dynamic Center Stage: Welcome View OR Active Chat */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {messages.length === 0 ? (
            <WelcomeView
              onSendMessage={handleSendMessage}
              onSelectFeatureCard={handleSelectFeatureCard}
            />
          ) : (
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              selectedModel={selectedModel}
            />
          )}
        </div>
      </main>

      {/* Interactive Modals */}
      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
