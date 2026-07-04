"use client";
import { Moon, Sun, Monitor, Bell, BellOff, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [notifications, setNotifications] = useState(true);
  const [animations, setAnimations] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | "system" | null;
    const savedNotifications = localStorage.getItem("notifications");
    const savedAnimations = localStorage.getItem("animations");

    if (savedTheme) setTheme(savedTheme);
    if (savedNotifications !== null) setNotifications(savedNotifications === "true");
    if (savedAnimations !== null) setAnimations(savedAnimations === "true");
  }, []);

  const handleThemeChange = (newTheme: "dark" | "light" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const handleNotificationsChange = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem("notifications", String(enabled));
  };

  const handleAnimationsChange = (enabled: boolean) => {
    setAnimations(enabled);
    localStorage.setItem("animations", String(enabled));
    if (!enabled) {
      document.documentElement.classList.add("no-animations");
    } else {
      document.documentElement.classList.remove("no-animations");
    }
  };

  const applyTheme = (t: "dark" | "light" | "system") => {
    if (t === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", t);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | "system" | null;
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div>
        <label className="text-sm font-medium text-text-primary mb-3 block">
          主题
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "dark", label: "深色", icon: Moon },
            { value: "light", label: "浅色", icon: Sun },
            { value: "system", label: "跟随系统", icon: Monitor },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value as "dark" | "light" | "system")}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                theme === option.value
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "bg-bg-elevated/50 border-border-subtle text-text-muted hover:border-border-default hover:text-text-secondary"
              }`}
            >
              <option.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between py-3 border-t border-border-subtle">
        <div className="flex items-center gap-3">
          {notifications ? (
            <Bell className="w-5 h-5 text-text-secondary" />
          ) : (
            <BellOff className="w-5 h-5 text-text-muted" />
          )}
          <div>
            <p className="text-sm font-medium text-text-primary">消息通知</p>
            <p className="text-xs text-text-muted">接收新消息提醒</p>
          </div>
        </div>
        <button
          onClick={() => handleNotificationsChange(!notifications)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            notifications ? "bg-accent" : "bg-bg-elevated"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
              notifications ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Animations */}
      <div className="flex items-center justify-between py-3 border-t border-border-subtle">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-text-secondary" />
          <div>
            <p className="text-sm font-medium text-text-primary">动画效果</p>
            <p className="text-xs text-text-muted">界面过渡动画</p>
          </div>
        </div>
        <button
          onClick={() => handleAnimationsChange(!animations)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            animations ? "bg-accent" : "bg-bg-elevated"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
              animations ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* About */}
      <div className="pt-4 border-t border-border-subtle">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>AstrBot AI 助手</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
