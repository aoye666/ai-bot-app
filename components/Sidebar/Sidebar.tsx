"use client";
import { useState } from "react";
import { Bot, Settings, HelpCircle, Sparkles, Menu, X } from "lucide-react";
import { SessionList } from "./SessionList";
import { Modal } from "../UI/Modal";
import { SettingsPanel } from "../Settings/SettingsPanel";
import { HelpPanel } from "../Settings/HelpPanel";

export function Sidebar() {
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-bg-elevated/80 backdrop-blur-xl border border-border-subtle text-text-primary hover:bg-bg-elevated transition-all duration-200"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-40 h-full
        w-80 bg-bg-secondary/60 backdrop-blur-xl border-r border-border-subtle flex flex-col relative overflow-hidden
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <header className="relative z-10 p-5 border-b border-border-subtle">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img 
                src="/logo.jpg" 
                alt="Logo" 
                className="w-11 h-11 rounded-2xl object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-bg-secondary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-text-primary tracking-tight">
                AstrBot AI
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3 h-3 text-accent" />
                <span className="text-xs text-text-muted font-medium">智能助手</span>
              </div>
            </div>
          </div>
        </header>

        {/* Session list */}
        <nav className="relative z-10 flex-1 overflow-hidden">
          <SessionList />
        </nav>

        {/* Footer */}
        <footer className="relative z-10 p-3 border-t border-border-subtle space-y-1">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-text-secondary hover:bg-white/[0.03] transition-all duration-200 text-sm group"
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            <span>设置</span>
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-text-secondary hover:bg-white/[0.03] transition-all duration-200 text-sm"
          >
            <HelpCircle className="w-4 h-4" />
            <span>帮助</span>
          </button>
        </footer>
      </aside>

      {/* Settings Modal */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="设置">
        <SettingsPanel onClose={() => setShowSettings(false)} />
      </Modal>

      {/* Help Modal */}
      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="帮助">
        <HelpPanel onClose={() => setShowHelp(false)} />
      </Modal>
    </>
  );
}
