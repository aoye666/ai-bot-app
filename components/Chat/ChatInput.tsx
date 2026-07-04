"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { FileUploader } from "./FileUploader";

export function ChatInput() {
  const { sendMessage, uploads, isLoading, inputValue, setInputValue } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && uploads.length === 0) return;
    await sendMessage(inputValue, uploads);
    setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const hasContent = inputValue.trim() || uploads.length > 0;

  return (
    <div className="px-6 pb-5 pt-3">
      <div className="max-w-3xl mx-auto">
        {/* File uploads */}
        <FileUploader />

        {/* Input container */}
        <form onSubmit={handleSubmit} className="relative">
          <div className={`flex items-end gap-2 p-2 rounded-2xl border transition-all duration-200 ${
            hasContent
              ? "bg-bg-elevated/80 border-accent/30 shadow-lg shadow-accent/5"
              : "bg-bg-elevated/50 border-border-subtle hover:border-border-default"
          }`}>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              className="flex-1 px-3 py-2.5 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none min-h-[40px] max-h-[160px] leading-relaxed"
              rows={1}
              disabled={isLoading}
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!hasContent || isLoading}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                hasContent
                  ? "text-white shadow-lg shadow-accent/30 hover:scale-105 active:scale-95"
                  : "bg-bg-elevated text-text-muted cursor-not-allowed"
              }`}
              style={hasContent ? { background: 'var(--user-bubble)' } : undefined}
            >
              <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Bottom hint */}
          <p className="text-center text-[11px] text-text-muted/40 mt-2">
            Enter 发送 · Shift+Enter 换行
          </p>
        </form>
      </div>
    </div>
  );
}
