export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  attachment_id?: string;
}

export interface Session {
  id: string;
  name: string;
  createdAt: Date;
  lastMessage?: string;
}

export interface ChatRequest {
  message: string | MessageSegment[];
  username: string;
  session_id?: string;
  enable_streaming?: boolean;
}

export interface MessageSegment {
  type: "plain" | "file" | "image" | "video" | "record";
  text?: string;
  attachment_id?: string;
}

export interface ChatResponse {
  message_id: string;
  session_id: string;
  content: string;
  segments?: MessageSegment[];
}
