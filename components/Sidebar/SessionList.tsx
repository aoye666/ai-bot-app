"use client";
import { MessageSquare, Plus, Hash } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import type { Session } from "@/types";

export function SessionList() {
  const { sessions, currentSession, setCurrentSession, createNewSession, isMounted } =
    useChat();

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex flex-col h-full pt-3">
      {/* New chat button */}
      <div className="px-3 mb-3">
        <button
          onClick={createNewSession}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl font-semibold text-sm
            text-bg-primary transition-all duration-200
            hover:shadow-lg hover:shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--user-bubble)' }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>新建对话</span>
        </button>
      </div>

      {/* Session items */}
      <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {!isMounted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-bg-elevated flex items-center justify-center mb-3">
              <Hash className="w-5 h-5 text-text-muted" />
            </div>
            <p className="text-sm text-text-muted font-medium">暂无对话记录</p>
            <p className="text-xs text-text-muted/60 mt-1">点击上方按钮开始</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-bg-elevated flex items-center justify-center mb-3">
              <Hash className="w-5 h-5 text-text-muted" />
            </div>
            <p className="text-sm text-text-muted font-medium">暂无对话记录</p>
            <p className="text-xs text-text-muted/60 mt-1">点击上方按钮开始</p>
          </div>
        ) : (
          sessions.map((session: Session) => (
            <button
              key={session.id}
              onClick={() => setCurrentSession(session.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                currentSession === session.id
                  ? "bg-accent/10 border border-accent/20"
                  : "hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  currentSession === session.id
                    ? "bg-accent/20 text-accent"
                    : "bg-bg-elevated text-text-muted group-hover:text-text-secondary"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  currentSession === session.id ? "text-text-primary" : "text-text-secondary"
                }`}>
                  {session.name || "未命名对话"}
                </p>
                <p className="text-xs text-text-muted truncate mt-0.5">
                  {session.lastMessage || "暂无消息"}
                </p>
              </div>
              <span className="text-[10px] text-text-muted/60 flex-shrink-0 tabular-nums">
                {formatDate(session.createdAt)}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
