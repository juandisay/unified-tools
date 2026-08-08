"use client";

import { usePathname } from "next/navigation";
import { useTimer } from "@/contexts/TimerContext";
import { Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalTimerHeader() {
  const pathname = usePathname();
  const { isRunning, timeLeft, formatTime, activeStage, toggleTimer } = useTimer();

  // Show this header only when not on the main page where the big timer is displayed
  if (pathname === "/") return null;
  if (!isRunning && timeLeft === 25 * 60) return null; // Don't show if timer hasn't really started

  const titleMode = activeStage === "pomodoro" ? "Pomodoro" : activeStage === "shortBreak" ? "Break" : "Long Break";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-0 inset-x-0 z-50 flex justify-end sm:justify-center p-4 pointer-events-none"
      >
        <div className="flex items-center gap-4 bg-black/40 dark:bg-white/10 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl px-5 py-2.5 rounded-full pointer-events-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{titleMode}</span>
            <span className="text-xl font-baloo font-bold text-white tabular-nums leading-none tracking-tight">
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <div className="w-[1px] h-8 bg-white/20"></div>
          
          <button 
            onClick={toggleTimer}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            {isRunning ? (
              <Pause fill="currentColor" className="w-4 h-4" />
            ) : (
              <Play fill="currentColor" className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
