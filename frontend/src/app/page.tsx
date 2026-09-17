"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import WelcomeView from "@/components/WelcomeView";
import ChatInterface, { Message } from "@/components/ChatInterface";
import UpgradeModal from "@/components/UpgradeModal";
import SettingsModal from "@/components/SettingsModal";
import HelpModal from "@/components/HelpModal";
import { streamChatFromBackend, checkBackendHealth } from "@/lib/api";

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
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    checkBackendHealth().then((health) => {
      setBackendOnline(health.online);
    });
  }, []);

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
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
    handleSendMessage(prompt, { deepThink: true });
  };

  const handleSendMessage = async (text: string, options?: { deepThink?: boolean; tools?: string[] }) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const assistantMsgId = `ai-${Date.now()}`;
    const initialAssistantMessage: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      deepThink: options?.deepThink ? { thinkingSteps: [] } : undefined,
      sources: [],
    };

    // Update state with user message and placeholder assistant message
    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, initialAssistantMessage]);
    setCurrentChatId("active-session");
    setIsLoading(true);

    const historyForBackend = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    await streamChatFromBackend(historyForBackend, {
      model: selectedModel,
      deepThink: options?.deepThink,
      tools: options?.tools,
      onThinking: (thought: string) => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantMsgId) {
              const currentSteps = msg.deepThink?.thinkingSteps || [];
              return {
                ...msg,
                deepThink: {
                  thinkingSteps: [...currentSteps, thought],
                },
              };
            }
            return msg;
          })
        );
      },
      onToken: (token: string) => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantMsgId) {
              return {
                ...msg,
                content: msg.content + token,
              };
            }
            return msg;
          })
        );
      },
      onSources: (sources) => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantMsgId) {
              return {
                ...msg,
                sources: [...(msg.sources || []), ...sources],
              };
            }
            return msg;
          })
        );
      },
      onError: (errMsg: string) => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantMsgId) {
              return {
                ...msg,
                content:
                  msg.content ||
                  `⚠️ **Notice**: Backend connection message: ${errMsg}\n\nMake sure FastAPI backend is running on \`http://localhost:8000\` and \`GEMINI_API_KEY\` is set in \`.env\`.`,
              };
            }
            return msg;
          })
        );
      },
      onDone: () => {
        setIsLoading(false);
      },
    });
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
