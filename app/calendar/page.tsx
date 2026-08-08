"use client";

import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [currentNote, setCurrentNote] = useState("");
  const [mounted, setMounted] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("4track_calendar_notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
      }
    }
  }, []);
  const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    setCurrentNote(notes[dateKey] || "");
  }, [selectedDate, notes, dateKey]);

  const saveNote = () => {
    const updated = { ...notes };
    if (!currentNote.trim()) {
      delete updated[dateKey];
    } else {
      updated[dateKey] = currentNote;
    }
    setNotes(updated);
    localStorage.setItem("4track_calendar_notes", JSON.stringify(updated));
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };
  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const blanks = Array.from({ length: firstDay }).map((_, i) => (
      <div key={`blank-${i}`} className="h-10 sm:h-12 w-full"></div>
    ));
    const today = new Date();
    const days = Array.from({ length: daysInMonth }).map((_, i) => {
      const dayNum = i + 1;
      const isSelected = selectedDate.getDate() === dayNum && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
      const isToday = today.getDate() === dayNum && today.getMonth() === month && today.getFullYear() === year;
      const keyStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const hasNote = notes[keyStr] !== undefined && notes[keyStr].trim().length > 0;

      return (
        <button
          key={`day-${dayNum}`}
          onClick={() => setSelectedDate(new Date(year, month, dayNum))}
          className={`relative h-10 sm:h-12 w-full flex items-center justify-center rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-white/50
            ${isSelected ? 'bg-white text-black font-bold shadow-sm' : 'hover:bg-white/10 text-white/80'}
            ${isToday && !isSelected ? 'border border-white/20' : ''}
          `}
        >
          {dayNum}
          {hasNote && !isSelected && (
            <span className="absolute bottom-1 w-1 h-1 bg-current rounded-full opacity-50"></span>
          )}
        </button>
      );
    });

    return [...blanks, ...days];
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center pb-24">
      <header className="w-full max-w-5xl mx-auto p-4 md:p-6 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors backdrop-blur-md relative overflow-hidden">
             <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform rounded-full"></div>
            <ArrowLeft size={20} className="relative z-10" />
          </div>
          <span className="font-semibold">Back</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center shadow-sm backdrop-blur-md">
            <Image src="/icon.svg" alt="4track.my.id mark" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
          </div>
          <div className="font-sans flex items-baseline tracking-tight">
            <span className="text-[22px] sm:text-2xl font-bold text-white leading-none">4track</span>
            <span className="text-[14px] sm:text-[16px] font-medium text-white/60 ml-0.5 leading-none">.my.id</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl px-4 py-8 flex flex-col md:flex-row gap-8 items-start">
        
        {/* Calendar Side */}
        <div className="w-full md:w-1/2 flex flex-col bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => changeMonth(1)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-y-2 mb-2 text-center text-xs font-semibold text-white/40">
            {daysOfWeek.map(d => <div key={d}>{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-y-2 gap-x-1">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Notes Side */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-sm min-h-[400px]">
          <h2 className="text-xl font-bold mb-2">
             Notes for {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </h2>
          <p className="text-sm text-white/40 mb-6">Write plans, milestones or summaries tightly tied to this date.</p>
          
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Type your notes here..."
            className="flex-1 w-full bg-transparent border-0 resize-none outline-none text-white focus:ring-0 placeholder:text-white/20 mb-4"
          />

          <div className="flex items-center justify-end border-t border-white/10 pt-4 mt-auto">
            <AnimatePresence>
               {saveStatus && (
                 <motion.div
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0 }}
                   className="flex items-center gap-1.5 text-sm text-green-400 font-medium mr-4"
                 >
                   <Check size={16} /> Saved
                 </motion.div>
               )}
            </AnimatePresence>
            <button
              onClick={saveNote}
              className="bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:scale-105 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Save Note
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}