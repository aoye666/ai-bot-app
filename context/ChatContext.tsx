"use client";
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import type { Message, Session, Attachment } from "@/types";
import { buildMessagePayload, handleStreamResponse } from "@/lib/chat";

interface ChatContextType {
  messages: Message[];
  sessions: Session[];
  currentSession: string | null;
  isLoading: boolean;
  isMounted: boolean;
  uploads: Attachment[];
  inputValue: string;
  addMessage: (message: Message) => void;
  sendMessage: (content: string, attachments?: Attachment[]) => void;
  uploadFile: (file: File) => Promise<Attachment>;
  clearUploads: () => void;
  setCurrentSession: (sessionId: string) => void;
  createNewSession: () => void;
  setInputValue: (value: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // quota exceeded or storage unavailable
  }
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSessionState] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState<Attachment[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  // 使用 ref 追踪 currentSession，避免闭包陈旧问题
  const currentSessionRef = useRef<string | null>(null);
  
  // 客户端挂载后从 localStorage 加载数据
  useEffect(() => {
    const savedSessions = localStorage.getItem("chat_sessions");
    const savedCurrentSession = localStorage.getItem("chat_current_session");
    
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch {
        setSessions([]);
      }
    }
    if (savedCurrentSession) {
      setCurrentSessionState(savedCurrentSession);
      currentSessionRef.current = savedCurrentSession;
      // 加载当前会话的消息
      const savedMessages = localStorage.getItem(`chat_messages_${savedCurrentSession}`);
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch {
          setMessages([]);
        }
      }
    }
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    currentSessionRef.current = currentSession;
  }, [currentSession]);

  // 加载会话消息
  const loadSessionMessages = useCallback((sessionId: string) => {
    const saved = localStorage.getItem(`chat_messages_${sessionId}`);
    let loadedMessages: Message[] = [];
    if (saved) {
      try {
        loadedMessages = JSON.parse(saved);
      } catch {
        loadedMessages = [];
      }
    }
    setMessages(loadedMessages);
  }, []);

  // 切换会话
  const setCurrentSession = useCallback((sessionId: string) => {
    setCurrentSessionState(sessionId);
    safeSetItem("chat_current_session", sessionId);
    loadSessionMessages(sessionId);
  }, [loadSessionMessages]);

  // 创建新会话
  const createNewSession = useCallback(() => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      name: "新对话",
      lastMessage: "",
      createdAt: new Date(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionState(newSession.id);
    currentSessionRef.current = newSession.id;
    safeSetItem("chat_current_session", newSession.id);
    setMessages([]);
    return newSession.id;
  }, []);

  // 添加消息
  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      const newMessages = [...prev, message];
      const sessionId = currentSessionRef.current;
      if (sessionId) {
        safeSetItem(`chat_messages_${sessionId}`, JSON.stringify(newMessages));
      }
      return newMessages;
    });
  }, []);

  // 上传文件
  const uploadFile = useCallback(async (file: File): Promise<Attachment> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    const attachment: Attachment = {
      id: result.attachment_id || crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      attachment_id: result.attachment_id,
    };

    setUploads((prev) => [...prev, attachment]);
    return attachment;
  }, []);

  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);

  // 发送消息
  const sendMessage = useCallback(
    async (content: string, attachments?: Attachment[]) => {
      if (!content.trim() && (!attachments || attachments.length === 0)) {
        return;
      }

      // 获取当前会话 ID，如果没有则自动创建
      let activeSessionId = currentSessionRef.current;
      let isNewSession = false;
      
      if (!activeSessionId) {
        const newSession: Session = {
          id: crypto.randomUUID(),
          name: content.substring(0, 20) || "新对话",
          lastMessage: "",
          createdAt: new Date(),
        };
        setSessions((prev) => [newSession, ...prev]);
        setCurrentSessionState(newSession.id);
        safeSetItem("chat_current_session", newSession.id);
        currentSessionRef.current = newSession.id;
        activeSessionId = newSession.id;
        isNewSession = true;
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        content,
        role: "user",
        timestamp: new Date(),
        attachments,
      };

      // 如果是新会话，先清空消息再添加
      if (isNewSession) {
        setMessages([userMessage]);
        safeSetItem(`chat_messages_${activeSessionId}`, JSON.stringify([userMessage]));
      } else {
        setMessages((prev) => {
          const newMessages = [...prev, userMessage];
          safeSetItem(`chat_messages_${activeSessionId}`, JSON.stringify(newMessages));
          return newMessages;
        });
      }
      
      setIsLoading(true);

      try {
        const payload = buildMessagePayload(content, attachments, activeSessionId);

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: errorText || "Failed to send message" };
          }
          throw new Error(errorData.error || "Failed to send message");
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const botMessageId = crypto.randomUUID();
        const botMessage: Message = {
          id: botMessageId,
          content: "",
          role: "assistant",
          timestamp: new Date(),
        };

        // 添加机器人消息占位
        setMessages((prev) => {
          const newMessages = [...prev, botMessage];
          safeSetItem(`chat_messages_${activeSessionId}`, JSON.stringify(newMessages));
          return newMessages;
        });

        // 处理流式响应
        await handleStreamResponse(reader, (newContent) => {
          setMessages((prev) => {
            const newMessages = prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, content: newContent }
                : msg
            );
            safeSetItem(`chat_messages_${activeSessionId}`, JSON.stringify(newMessages));
            return newMessages;
          });
        });

        // 更新会话信息
        setSessions((prev) => {
          const updated = prev.map((s) =>
            s.id === activeSessionId
              ? { 
                  ...s, 
                  lastMessage: content.substring(0, 50),
                  name: s.name === "新对话" ? (content.substring(0, 20) || "新对话") : s.name
                }
              : s
          );
          safeSetItem("chat_sessions", JSON.stringify(updated));
          return updated;
        });

        clearUploads();
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [clearUploads]
  );

  // 保存会话列表（只在客户端挂载后保存）
  useEffect(() => {
    if (isMounted) {
      safeSetItem("chat_sessions", JSON.stringify(sessions));
    }
  }, [sessions, isMounted]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        sessions,
        currentSession,
        isLoading,
        isMounted,
        uploads,
        inputValue,
        addMessage,
        sendMessage,
        uploadFile,
        clearUploads,
        setCurrentSession,
        createNewSession,
        setInputValue,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
