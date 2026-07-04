import type { Attachment, MessageSegment } from "@/types";

export interface ChatPayload {
  message: string | MessageSegment[];
  username: string;
  session_id: string | null;
  enable_streaming: boolean;
}

export function buildMessagePayload(
  content: string,
  attachments: Attachment[] | undefined,
  sessionId: string | null
): ChatPayload {
  const messageSegments: MessageSegment[] = [];

  if (content.trim()) {
    messageSegments.push({ type: "plain", text: content });
  }

  if (attachments && attachments.length > 0) {
    attachments.forEach((att) => {
      if (att.attachment_id) {
        const type = att.type.startsWith("image/") ? "image" : "file";
        messageSegments.push({ type, attachment_id: att.attachment_id });
      }
    });
  }

  return {
    message: messageSegments.length > 1 ? messageSegments : content,
    username: "web_user",
    session_id: sessionId,
    enable_streaming: true,
  };
}

export function parseStreamLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("event:")) {
    return null;
  }

  if (trimmed.startsWith("data:")) {
    const jsonStr = trimmed.slice(5).trim();
    if (!jsonStr || jsonStr === "[DONE]" || jsonStr === "heartbeat") {
      return null;
    }

    try {
      const data = JSON.parse(jsonStr);
      return extractTextFromData(data);
    } catch {
      return null;
    }
  }

  return null;
}

function extractTextFromData(data: unknown): string | null {
  if (typeof data === "string") {
    return data === "heartbeat" ? null : data;
  }

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;

    if (obj.content && typeof obj.content === "string") {
      return obj.content === "heartbeat" ? null : obj.content;
    }

    if (obj.data && typeof obj.data === "string") {
      return obj.data === "heartbeat" ? null : obj.data;
    }

    if (obj.data && typeof obj.data === "object") {
      const dataObj = obj.data as Record<string, unknown>;
      if (dataObj.content && typeof dataObj.content === "string") {
        return dataObj.content === "heartbeat" ? null : dataObj.content;
      }
      if (dataObj.text && typeof dataObj.text === "string") {
        return dataObj.text === "heartbeat" ? null : dataObj.text;
      }
    }
  }

  return null;
}

export async function handleStreamResponse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onUpdate: (content: string) => void
): Promise<string> {
  const decoder = new TextDecoder();
  let botContent = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const content = parseStreamLine(line);
      if (content) {
        botContent = content;
        onUpdate(botContent);
      }
    }
  }

  return botContent;
}