"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Heart, Repeat } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TooltipArea({ children, label }: { children: React.ReactNode, label: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className="relative flex justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full mb-3 px-3 py-1.5 bg-white dark:bg-zinc-800 text-black dark:text-white text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap shadow-sm border border-black/5 dark:border-white/10 z-50 pointer-events-none origin-bottom"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
type TimerStateMode = "pomodoro" | "shortBreak" | "longBreak";
type TimerMode = TimerStateMode | "loop";

export default function Home() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [isAutoLoop, setIsAutoLoop] = useState(false);
  const [activeStage, setActiveStage] = useState<TimerStateMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState<"classic" | "dark">("classic");
  const [isMuted, setIsMuted] = useState(false);
  const clockAudioRef = useRef<HTMLAudioElement | null>(null);
  const [loopStep, setLoopStep] = useState(0);
  const [showLoopPrompt, setShowLoopPrompt] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load theme from local storage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "classic" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to local storage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);
  useEffect(() => {
    clockAudioRef.current = new Audio("/clock.mp3");
    clockAudioRef.current.loop = true;
    clockAudioRef.current.volume = 0.5; // Ensuring it blends elegantly into focus backgrounds
    
    return () => {
      if (clockAudioRef.current) {
        clockAudioRef.current.pause();
        clockAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (clockAudioRef.current) {
      if (isRunning && !isMuted) {
        clockAudioRef.current.play().catch((e) => console.log("Clock auto-play blocked:", e));
      } else {
        clockAudioRef.current.pause();
      }
    }
  }, [isRunning, isMuted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playNotification();
      
      if (isAutoLoop) {
        const nextStep = (loopStep + 1) % 8;
        
        if (nextStep === 0) {
          // We just finished step 7 (Long Break) and are about to loop back to Pomodoro
          setShowLoopPrompt(true);
        } else {
          setLoopStep(nextStep);
          const nextStage: TimerStateMode = nextStep % 2 === 0 ? "pomodoro" : (nextStep === 7 ? "longBreak" : "shortBreak");
          setActiveStage(nextStage);
          setMode(nextStage);
          
          if (nextStage === "longBreak") {
            setTimeLeft(15 * 60);
          } else if (nextStage === "shortBreak") {
            setTimeLeft(5 * 60);
          } else {
            setTimeLeft(25 * 60);
          }
          setIsRunning(true);
        }
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isAutoLoop, loopStep]);


  useEffect(() => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");
    let titleMode = "";
    if (activeStage === "pomodoro") titleMode = "Pomodoro";
    else if (activeStage === "shortBreak") titleMode = "Short Break";
    else if (activeStage === "longBreak") titleMode = "Long Break";
    document.title = `${m}:${s} - ${titleMode} | 4track.my.id`;
  }, [timeLeft, activeStage, loopStep]);


  const playNotification = () => {
    if (typeof window !== "undefined") {
      if (!isMuted) {
        const audio = new Audio("/bell.mp3");
        audio.play().catch(e => console.log("Audio play failed:", e));
      }
      if (Notification.permission === "granted") {
        new Notification("4track.my.id", { body: "Time is up!" });
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
  const handleModeChange = (newMode: TimerStateMode) => {
    setMode(newMode);
    setActiveStage(newMode);
    setIsRunning(false);
    setIsAutoLoop(false);
    setLoopStep(0);
    switch (newMode) {
      case "pomodoro":
        setTimeLeft(25 * 60);
        break;
      case "shortBreak":
        setTimeLeft(5 * 60);
        break;
      case "longBreak":
        setTimeLeft(15 * 60);
        break;
    }
  };

  const toggleAutoLoop = () => {
    const willEnable = !isAutoLoop;
    setIsAutoLoop(willEnable);
    if (willEnable) {
      setMode("loop");
      // Determine active stage based on current loop step
      const currentStage: TimerStateMode = loopStep % 2 === 0 ? "pomodoro" : (loopStep === 7 ? "longBreak" : "shortBreak");
      setActiveStage(currentStage);
    } else {
      setMode(activeStage);
    }
  };

  const toggleTimer = useCallback(() => setIsRunning((prev) => !prev), []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setShowLoopPrompt(false);
    setIsAutoLoop(false);
    setLoopStep(0);
    setMode("pomodoro");
    setActiveStage("pomodoro");
    setTimeLeft(25 * 60);
  }, []);


  const handleLoopContinue = (continueLoop: boolean) => {
    setShowLoopPrompt(false);
    setLoopStep(0);
    setActiveStage("pomodoro");
    setMode(continueLoop ? "loop" : "pomodoro");
    setTimeLeft(25 * 60);
    
    if (continueLoop) {
      setIsRunning(true);
      setIsAutoLoop(true);
    } else {
      setIsAutoLoop(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        toggleTimer();
      } else if (e.code === "Escape") {
        e.preventDefault();
        resetTimer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTimer, resetTimer]);

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

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${getBackgroundColor()}`}>
      <header className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Top Navbar */}
        <div className="flex flex-row justify-between items-center w-full">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 sm:w-11 sm:h-11 shadow-sm rounded-[10px] flex items-center justify-center transition-transform hover:scale-105">
               <img src="/icon.svg" alt="4track.my.id mark" width={36} height={36} className="w-full h-full object-contain" />
            </div>
            <div className="font-sans flex items-baseline tracking-tight">
              <span className="text-[22px] sm:text-2xl font-bold text-white leading-none">
                4track
              </span>
              <span className="text-[14px] sm:text-[16px] font-medium text-white/60 ml-0.5 leading-none">
                .my.id
              </span>
              <span className="ml-2 text-[10px] font-medium border border-white/20 text-white/50 px-1.5 py-0.5 rounded-[4px] leading-none self-center">
                v{new Date().getFullYear()}
              </span>
            </div>
          </Link>

          {/* Theme Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-sm border border-white/10 text-white"
              aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={theme === "dark"}
                onChange={() => setTheme(theme === "dark" ? "classic" : "dark")}
              />
              <div className="w-14 h-7 sm:w-16 sm:h-8 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] sm:after:top-[4px] sm:after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 sm:after:h-6 sm:after:w-6 after:transition-all peer-checked:bg-white/40 backdrop-blur-sm shadow-inner flex items-center justify-between px-1.5 peer-checked:after:translate-x-[26px] sm:peer-checked:after:translate-x-[30px] border border-white/10 relative overflow-hidden">
                <span className="text-xs sm:text-sm pl-0.5" role="img" aria-label="dark">🌙</span>
                <span className="text-xs sm:text-sm pr-0.5" role="img" aria-label="tomato">🍅</span>
              </div>
            </label>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-2 md:gap-4 mt-8 sm:mt-4 overflow-x-auto whitespace-nowrap scrollbar-hide w-full max-w-full pb-2 px-2 sm:px-0">
          {[
            { id: "pomodoro", label: "Pomodoro", shortLabel: "Pomodoro", textColor: "text-[#ba4949]" },
            { id: "shortBreak", label: "Short Break", shortLabel: "Break", textColor: "text-[#38858a]" },
            { id: "longBreak", label: "Long break", shortLabel: "LB", textColor: "text-[#397097]" }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id as TimerStateMode)}
              className="relative px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/50 shrink-0"
            >
              {activeStage === m.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-md"
                  style={{ originY: "0px" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${activeStage === m.id ? (theme === "dark" ? "text-gray-900" : m.textColor) : "text-white/90 hover:text-white"}`}>
                <span className="hidden sm:inline">{m.label}</span>
                <span className="sm:hidden">{m.shortLabel}</span>
              </span>
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-16 sm:pt-10 px-4">
          <motion.div 
            className="text-[90px] sm:text-[120px] md:text-[180px] leading-none tracking-tight tabular-nums text-white mb-6 sm:mb-10 text-center font-baloo"
            key={mode}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {formatTime(timeLeft)}
          </motion.div>
          
          <div className="flex justify-center items-center gap-4 sm:gap-6 bg-black/20 p-2 sm:p-3 rounded-full backdrop-blur-md border border-white/10 shadow-2xl">
            <TooltipArea label="Reset Timer">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetTimer}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center text-white"
                aria-label="Reset Timer"
              >
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              </motion.button>
            </TooltipArea>
            <TooltipArea label={isRunning ? "Pause" : "Start"}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTimer}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-shadow flex items-center justify-center"
                aria-label={isRunning ? "Pause Timer" : "Start Timer"}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={isRunning ? "pause" : "play"}
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
                  >
                    {isRunning ? (
                      <Pause fill="currentColor" className="w-7 h-7 sm:w-8 sm:h-8" />
                    ) : (
                      <Play fill="currentColor" className="ml-1 w-7 h-7 sm:w-8 sm:h-8" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </TooltipArea>
            <TooltipArea label="Stop Timer">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(0);
                }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center text-white"
                aria-label="Stop Timer"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-[4px] bg-current"></div>
              </motion.button>
            </TooltipArea>
            <TooltipArea label={isAutoLoop ? "Disable Loop" : "Enable Loop"}>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleAutoLoop}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-colors flex items-center justify-center ${isAutoLoop ? "bg-white/30 text-white" : "hover:bg-white/10 text-white"}`}
                aria-label={isAutoLoop ? "Loop Mode Active" : "Enable Loop Mode"}
              >
                <Repeat className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              </motion.button>
            </TooltipArea>
          </div>
      </main>

      {/* Loop Confirmation Modal */}
      <AnimatePresence>
        {showLoopPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 text-center"
            >
              <div className="w-16 h-16 bg-[#f05b56]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl" role="img" aria-label="party popper">🎉</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-8">
                You've successfully finished a full Pomodoro loop (including the long break). Would you like to continue with another Pomodoro?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleLoopContinue(false)}
                  className="flex-1 px-6 py-3 rounded-full border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  No, stop here
                </button>
                <button
                  onClick={() => handleLoopContinue(true)}
                  className="flex-1 px-6 py-3 rounded-full bg-[#f05b56] text-white font-semibold hover:bg-[#d94f4b] shadow-lg shadow-[#f05b56]/20 transition-all hover:-translate-y-0.5"
                >
                  Yes, continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
