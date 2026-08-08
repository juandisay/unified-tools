"use client";

import { useTimer } from "@/contexts/TimerContext";
import { useEffect, useState } from "react";

export function PageBackground({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const { theme, activeStage, isAutoLoop } = useTimer();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getBackgroundColor = () => {
    if (theme === "dark") return "bg-gray-900 text-white";
    if (isAutoLoop) return "bg-[#7d53a2] text-white";
    
    switch (activeStage) {
      case "pomodoro": return "bg-[#ba4949] text-white";
      case "shortBreak": return "bg-[#38858a] text-white";
      case "longBreak": return "bg-[#397097] text-white";
      default: return "bg-[#ba4949] text-white";
    }
  };

  // Prevent hydration mismatch by using default color before mounting
  const bgClass = mounted ? getBackgroundColor() : "bg-gray-900 text-white";

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${bgClass} ${className}`}>
      {children}
    </div>
  );
}
