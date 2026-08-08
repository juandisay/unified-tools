"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { sendGAEvent } from "@next/third-parties/google";

export type TimerStateMode = "pomodoro" | "shortBreak" | "longBreak";
export type TimerMode = TimerStateMode | "loop";

interface TimerContextProps {
  mode: TimerMode;
  setMode: (val: TimerMode) => void;
  isAutoLoop: boolean;
  setIsAutoLoop: (val: boolean) => void;
  activeStage: TimerStateMode;
  setActiveStage: (val: TimerStateMode) => void;
  timeLeft: number;
  setTimeLeft: (val: number | ((prev: number) => number)) => void;
  isRunning: boolean;
  setIsRunning: (val: boolean) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  loopStep: number;
  setLoopStep: (val: number) => void;
  showLoopPrompt: boolean;
  setShowLoopPrompt: (val: boolean) => void;
  theme: "classic" | "dark";
  setTheme: (val: "classic" | "dark") => void;
  resetTimer: () => void;
  toggleTimer: () => void;
  toggleAutoLoop: () => void;
  formatTime: (seconds: number) => string;
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [activeStage, setActiveStage] = useState<TimerStateMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isAutoLoop, setIsAutoLoop] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loopStep, setLoopStep] = useState(0);
  const [showLoopPrompt, setShowLoopPrompt] = useState(false);
  const [theme, setTheme] = useState<"classic" | "dark">("classic");
  
  const targetEndTimeRef = useRef<number | null>(null);
  const clockAudioRef = useRef<HTMLAudioElement | null>(null);

  // Formatting utility
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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

  // 1. Initial LocalStorage Load (Mount)
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "classic" | "dark";
    if (savedTheme) setTheme(savedTheme);

    const savedState = localStorage.getItem("timerState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setMode(parsed.mode || "pomodoro");
        setActiveStage(parsed.activeStage || "pomodoro");
        setIsAutoLoop(parsed.isAutoLoop || false);
        setLoopStep(parsed.loopStep || 0);
        setIsMuted(parsed.isMuted || false);
        // Calculate diff if it was running
        if (parsed.isRunning && parsed.targetEndTime) {
          const now = Date.now();
          const remaining = Math.max(0, Math.round((parsed.targetEndTime - now) / 1000));
          if (remaining > 0) {
            setTimeLeft(remaining);
            setIsRunning(true);
            targetEndTimeRef.current = parsed.targetEndTime;
          } else {
            setIsRunning(false);
            setTimeLeft(0);
            targetEndTimeRef.current = null;
          }
        } else {
          setTimeLeft(parsed.timeLeft !== undefined ? parsed.timeLeft : 25 * 60);
          setIsRunning(false);
        }
      } catch (e) {
        console.error("Failed to parse timer state");
      }
    }

    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // 2. Audio Setup
  useEffect(() => {
    clockAudioRef.current = new Audio("/clock.mp3");
    clockAudioRef.current.loop = true;
    clockAudioRef.current.volume = 0.5;
    
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

  // 3. Save to Localstorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme);
      const stateObj = {
        mode,
        activeStage,
        timeLeft,
        isRunning,
        isAutoLoop,
        loopStep,
        isMuted,
        targetEndTime: isRunning ? targetEndTimeRef.current : null
      };
      localStorage.setItem("timerState", JSON.stringify(stateObj));
    }
  }, [theme, mode, activeStage, timeLeft, isRunning, isAutoLoop, loopStep, isMuted, mounted]);

  // 4. Background & Interval Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      // Sync TargetEndTime if missing
      if (!targetEndTimeRef.current) {
        targetEndTimeRef.current = Date.now() + timeLeft * 1000;
        localStorage.setItem("timerState", JSON.stringify({
           mode, activeStage, timeLeft, isRunning, isAutoLoop, loopStep, isMuted, targetEndTime: targetEndTimeRef.current
        }));
      }

      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.round((targetEndTimeRef.current! - now) / 1000);
        
        if (remaining > 0) {
          setTimeLeft(remaining);
        } else {
          setIsRunning(false);
          setTimeLeft(0);
          targetEndTimeRef.current = null;
          playNotification();

          sendGAEvent("event", "timer_complete", {
            timer_stage: activeStage,
            is_auto_loop: isAutoLoop
          });
          
          if (isAutoLoop) {
            const nextStep = (loopStep + 1) % 8;
            if (nextStep === 0) {
              setShowLoopPrompt(true);
            } else {
              setLoopStep(nextStep);
              const nextStage: TimerStateMode = nextStep % 2 === 0 ? "pomodoro" : (nextStep === 7 ? "longBreak" : "shortBreak");
              setActiveStage(nextStage);
              setMode(nextStage);
              
              const nextDur = nextStage === "longBreak" ? 15 * 60 : (nextStage === "shortBreak" ? 5 * 60 : 25 * 60);
              setTimeLeft(nextDur);
              targetEndTimeRef.current = Date.now() + nextDur * 1000;
              setIsRunning(true);
            }
          }
        }
      }, 1000);
    } else {
       targetEndTimeRef.current = null;
    }
    return () => clearInterval(interval);
  }, [isRunning, isAutoLoop, loopStep, mode, activeStage, isMuted]);

  // 5. Document Title tracking
  useEffect(() => {
    const titleMode = activeStage === "pomodoro" ? "Pomodoro" : activeStage === "shortBreak" ? "Short Break" : "Long Break";
    document.title = `${formatTime(timeLeft)} - ${titleMode} | 4track.my.id`;
  }, [timeLeft, activeStage]);

  // Handlers
  const resetTimer = useCallback(() => {
    sendGAEvent("event", "timer_reset", {
      timer_stage: activeStage
    });

    setIsRunning(false);
    targetEndTimeRef.current = null;
    setShowLoopPrompt(false);
    
    if (mode === "loop") {
      setLoopStep(0);
      setActiveStage("pomodoro");
      setTimeLeft(25 * 60);
    } else {
      if (activeStage === "pomodoro") setTimeLeft(25 * 60);
      else if (activeStage === "shortBreak") setTimeLeft(5 * 60);
      else if (activeStage === "longBreak") setTimeLeft(15 * 60);
    }
    
    // Explicit reset localstorage
    localStorage.removeItem("timerState");
  }, [mode, activeStage]);

  const toggleTimer = useCallback(() => {
    if (showLoopPrompt && !isRunning) {
      sendGAEvent("event", "timer_start", {
        timer_stage: "pomodoro",
        is_auto_loop: isAutoLoop
      });

      setShowLoopPrompt(false);
      setLoopStep(0);
      setActiveStage("pomodoro");
      setMode("pomodoro");
      setTimeLeft(25 * 60);
      targetEndTimeRef.current = Date.now() + (25 * 60) * 1000;
      setIsRunning(true);
    } else {
      if (!isRunning) {
        sendGAEvent("event", "timer_start", {
          timer_stage: activeStage,
          is_auto_loop: isAutoLoop,
          time_left: timeLeft
        });

        if (timeLeft === 0) {
           const nextDur = activeStage === "pomodoro" ? 25*60 : (activeStage === "shortBreak" ? 5*60 : 15*60);
           setTimeLeft(nextDur);
           targetEndTimeRef.current = Date.now() + nextDur * 1000;
        } else {
           targetEndTimeRef.current = Date.now() + timeLeft * 1000;
        }
      } else {
        sendGAEvent("event", "timer_pause", {
          timer_stage: activeStage,
          is_auto_loop: isAutoLoop,
          time_left: timeLeft
        });
        targetEndTimeRef.current = null;
      }
      setIsRunning(!isRunning);
    }
  }, [isRunning, showLoopPrompt, activeStage, timeLeft, isAutoLoop]);

  const toggleAutoLoop = useCallback(() => {
    sendGAEvent("event", "toggle_auto_loop", {
      is_auto_loop_enabled: !isAutoLoop
    });
    
    if (!isAutoLoop) {
      setTimeout(() => {
        setIsRunning(true);
        targetEndTimeRef.current = Date.now() + timeLeft * 1000;
      }, 50);
    }
    setIsAutoLoop(!isAutoLoop);
  }, [isAutoLoop, timeLeft]);

  if (!mounted) return null;

  return (
    <TimerContext.Provider
      value={{
        mode, setMode,
        isAutoLoop, setIsAutoLoop,
        activeStage, setActiveStage,
        timeLeft, setTimeLeft,
        isRunning, setIsRunning,
        isMuted, setIsMuted,
        loopStep, setLoopStep,
        showLoopPrompt, setShowLoopPrompt,
        theme, setTheme,
        resetTimer, toggleTimer, toggleAutoLoop,
        formatTime
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
