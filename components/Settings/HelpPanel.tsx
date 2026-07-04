"use client";
import { Keyboard, MessageSquare, Upload, Sparkles } from "lucide-react";

interface HelpPanelProps {
  onClose: () => void;
}

export function HelpPanel({ onClose }: HelpPanelProps) {
  return (
    <div className="space-y-6">
      {/* Shortcuts */}
      <div>
        <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-accent" />
          快捷键
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated/50">
            <span className="text-sm text-text-secondary">发送消息</span>
            <kbd className="px-2 py-1 text-xs font-mono bg-bg-elevated border border-border-subtle rounded text-text-muted">
              Enter
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated/50">
            <span className="text-sm text-text-secondary">换行</span>
            <kbd className="px-2 py-1 text-xs font-mono bg-bg-elevated border border-border-subtle rounded text-text-muted">
              Shift + Enter
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated/50">
            <span className="text-sm text-text-secondary">新建对话</span>
            <kbd className="px-2 py-1 text-xs font-mono bg-bg-elevated border border-border-subtle rounded text-text-muted">
              Ctrl + N
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated/50">
            <span className="text-sm text-text-secondary">关闭弹窗</span>
            <kbd className="px-2 py-1 text-xs font-mono bg-bg-elevated border border-border-subtle rounded text-text-muted">
              Esc
            </kbd>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          功能特性
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-elevated/50">
            <MessageSquare className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text-primary">智能对话</p>
              <span className="text-xs text-text-muted">支持 Markdown 格式，代码高亮</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-elevated/50">
            <Upload className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text-primary">文件上传</p>
              <span className="text-xs text-text-muted">支持图片、PDF、文档等文件分析</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-elevated/50">
            <MessageSquare className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text-primary">多会话管理</p>
              <span className="text-xs text-text-muted">创建多个对话，独立管理上下文</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
        <p className="text-xs text-accent leading-relaxed">
          💡 提示：所有设置会自动保存，快捷键可在设置中自定义
        </p>
      </div>
    </div>
  );
}
