"use client";
import { FileText, Image as ImageIcon, Paperclip } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex items-end gap-3 max-w-full ${
        isUser ? "justify-end animate-slide-right" : "justify-start animate-slide-left"
      }`}
    >
      {/* Avatar - bot only */}
      {!isUser && (
        <img 
          src="/logo.jpg" 
          alt="AI" 
          className="w-8 h-8 rounded-xl object-cover flex-shrink-0"
        />
      )}

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-3 ${
            isUser
              ? "text-white rounded-2xl rounded-br-sm"
              : "bg-bg-elevated text-text-primary rounded-2xl rounded-bl-sm border border-border-subtle"
          }`}
          style={isUser ? { background: 'var(--user-bubble)' } : undefined}
        >
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-2">
              {message.attachments.map((att) => (
                <AttachmentChip key={att.name} attachment={att} isUser={isUser} />
              ))}
            </div>
          )}

          {/* Content */}
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            <ReactMarkdown
              components={{
                code({ className, children }) {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-black/20 px-1.5 py-0.5 rounded-md text-[13px] font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <pre className="bg-black/30 rounded-xl p-4 overflow-x-auto text-[13px] font-mono mt-2 border border-white/5">
                      <code className={className}>{children}</code>
                    </pre>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-accent/50 pl-3 italic text-text-secondary">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 ml-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1 ml-1">{children}</ol>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-2 decoration-accent/30 hover:decoration-accent transition-colors"
                  >
                    {children}
                  </a>
                ),
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-[11px] text-text-muted/50 px-1 tabular-nums">
          {formatTime(message.timestamp)}
        </span>
      </div>

      {/* Avatar - user only */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-bg-elevated flex items-center justify-center flex-shrink-0 border border-border-subtle">
          <span className="text-xs font-bold text-text-secondary">U</span>
        </div>
      )}
    </div>
  );
}

function AttachmentChip({
  attachment,
  isUser,
}: {
  attachment: { name: string; type: string; size: number };
  isUser: boolean;
}) {
  const sizeInKB = (attachment.size / 1024).toFixed(1);
  const isImage = attachment.type.startsWith("image/");

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
        isUser ? "bg-white/10" : "bg-white/[0.03] border border-border-subtle"
      }`}
    >
      {isImage ? (
        <ImageIcon className="w-4 h-4 text-accent flex-shrink-0" />
      ) : attachment.type.includes("pdf") ? (
        <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />
      ) : (
        <Paperclip className="w-4 h-4 text-text-muted flex-shrink-0" />
      )}
      <span className={`truncate flex-1 ${isUser ? "text-white/80" : "text-text-secondary"}`}>
        {attachment.name}
      </span>
      <span className={`text-xs ${isUser ? "text-white/50" : "text-text-muted"}`}>
        {sizeInKB} KB
      </span>
    </div>
  );
}
