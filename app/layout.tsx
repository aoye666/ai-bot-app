import type { Metadata } from "next";
import "./globals.css";
import { ChatProvider } from "@/context/ChatContext";

export const metadata: Metadata = {
  title: "AstrBot AI",
  description: "基于 AstrBot 的智能对话助手",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="h-screen overflow-hidden mesh-bg">
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
