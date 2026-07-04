"use client";
import { useEffect, useRef } from "react";
import { Sparkles, Zap, Globe } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/context/ChatContext";

export function ChatContainer() {
  const { messages, isLoading, isMounted } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Content area */}
      <main className="flex-1 overflow-y-auto">
        {!isMounted ? (
          <WelcomeScreen />
        ) : messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 animate-fade-in">
                <img 
                  src="/logo.jpg" 
                  alt="AI" 
                  className="w-8 h-8 rounded-xl object-cover flex-shrink-0"
                />
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-bg-elevated border border-border-subtle">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" style={{ animation: 'pulse-dot 1.4s infinite' }} />
                    <span className="w-2 h-2 rounded-full bg-accent" style={{ animation: 'pulse-dot 1.4s 0.2s infinite' }} />
                    <span className="w-2 h-2 rounded-full bg-accent" style={{ animation: 'pulse-dot 1.4s 0.4s infinite' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input area */}
      <div className="border-t border-border-subtle">
        <ChatInput />
      </div>
    </div>
  );
}

function WelcomeScreen() {
  const { setInputValue } = useChat();

  const presets = [
    { 
      icon: Zap, 
      label: "快速问答", 
      desc: "即时回答问题",
      prompt: "请帮我快速解答一个问题："
    },
    { 
      icon: Globe, 
      label: "知识探索", 
      desc: "了解世界万物",
      prompt: "请为我详细介绍一下"
    },
    { 
      icon: Sparkles, 
      label: "创意写作", 
      desc: "激发灵感创作",
      prompt: "请帮我写一段关于"
    },
  ];

  const handlePresetClick = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      {/* Floating icon */}
      <div className="relative mb-8 animate-float">
        <img 
          src="/logo.jpg" 
          alt="Logo" 
          className="w-20 h-20 rounded-3xl object-cover animate-glow"
        />
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">
        你好，有什么可以帮你？
      </h2>
      <p className="text-sm text-text-muted max-w-md text-center leading-relaxed mb-10">
        我是基于 AstrBot 的 AI 助手，支持对话交流、文件分析等功能。
      </p>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3 max-w-lg w-full">
        {presets.map((item) => (
          <button
            key={item.label}
            onClick={() => handlePresetClick(item.prompt)}
            className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-bg-elevated/50 border border-border-subtle
              hover:border-accent/30 hover:bg-bg-elevated transition-all duration-200 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center
              group-hover:bg-accent/10 transition-colors">
              <item.icon className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-medium text-text-primary">{item.label}</span>
            <span className="text-xs text-text-muted">{item.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
