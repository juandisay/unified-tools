"use client";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Tasks() {
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("4track_tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tasks");
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("4track_tasks", JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now().toString(), text: newTask.trim(), completed: false }, ...tasks]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(prevTasks => {
      const task = prevTasks.find(t => t.id === id);
      const isCompleting = !task?.completed;
      
      if (isCompleting) {
        setTimeout(() => {
          setTasks(latest => {
            const latestTask = latest.find(t => t.id === id);
            if (latestTask?.completed) {
              return latest.filter(item => item.id !== id);
            }
            return latest;
          });
        }, 600);
      }
      
      return prevTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    });
  };
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Only render once mounted to avoid hydration mismatch bounds
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

      <main className="flex-1 w-full max-w-2xl px-4 py-8 flex flex-col gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Tasks</h1>
          <p className="text-white/60">Capture your Todos. Stored purely in your browser.</p>
        </div>

        <form onSubmit={addTask} className="relative flex items-center">
          <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-5 pr-14 outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/30 transition-all font-medium"
          />
          <button 
            type="submit" 
            disabled={!newTask.trim()}
            className="absolute right-2.5 p-2 bg-white text-black rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        </form>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 className="text-center py-12 border border-dashed border-white/10 rounded-3xl"
               >
                 <p className="text-white/40">You don't have any tasks at the moment.</p>
               </motion.div>
            ) : (
                tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`group flex items-center gap-3 p-4 rounded-[20px] border transition-all ${
                      task.completed ? 'bg-white/5 border-white/5 opacity-50' : 'bg-white/10 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className="shrink-0 text-white/50 hover:text-white transition-colors"
                    >
                      {task.completed ? <CheckCircle2 size={24} className="text-white" /> : <Circle size={24} />}
                    </button>
                    <span className={`flex-1 font-medium select-none truncate transition-all ${task.completed ? 'line-through' : ''}`}>
                      {task.text}
                    </span>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="shrink-0 p-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 outline-none rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}