import axios from "axios";
import type { ChatRequest, Session, Attachment } from "@/types";

const API_KEY = process.env.ASTRBOT_API_KEY;
const BASE_URL = process.env.ASTRBOT_BASE_URL || "http://localhost:6185/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

export async function sendChatMessage(
  request: ChatRequest
): Promise<Response> {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(request),
  });
  return response;
}

export async function uploadFile(file: File): Promise<{ attachment_id: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function getSessions(
  username: string
): Promise<{ sessions: Session[] }> {
  const response = await axiosInstance.get("/chat/sessions", {
    params: { username },
  });
  return response.data;
}
