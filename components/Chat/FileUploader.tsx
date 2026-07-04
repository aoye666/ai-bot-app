"use client";
import { useCallback, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, Paperclip } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import type { Attachment } from "@/types";

export function FileUploader() {
  const { uploadFile, uploads, clearUploads } = useChat();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;
      for (const file of Array.from(files)) {
        await uploadFile(file);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [uploadFile]
  );

  const removeAttachment = useCallback(
    (_attachmentId: string) => {
      clearUploads();
    },
    [clearUploads]
  );

  if (uploads.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {uploads.map((attachment: Attachment) => (
        <div
          key={attachment.id}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-elevated/80 border border-border-subtle text-sm animate-fade-in"
        >
          <FileIcon type={attachment.type} />
          <span className="text-text-secondary truncate max-w-[140px]">{attachment.name}</span>
          <span className="text-text-muted/60 text-xs">{formatSize(attachment.size)}</span>
          <button
            onClick={() => removeAttachment(attachment.id)}
            className="p-0.5 rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-text-muted" />
          </button>
        </div>
      ))}
    </div>
  );
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4 text-green-400" />;
  if (type.includes("pdf")) return <FileText className="w-4 h-4 text-red-400" />;
  return <Paperclip className="w-4 h-4 text-text-muted" />;
}

function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
