"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Home, Grip, Clock, Calendar, CheckSquare, Plus } from "lucide-react";

export function FloatingNav() {
  const pathname = usePathname();
  const [isAppsOpen, setIsAppsOpen] = useState(false);

  return (
    <motion.div 
      className="fixed bottom-6 inset-x-0 mx-auto w-fit z-50 pointer-events-none"
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
    >
      <AnimatePresence>
        {isAppsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-4 w-72 rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/70 p-4 shadow-2xl backdrop-blur-xl pointer-events-auto origin-bottom-left"
          >
            <div className="mb-3 px-1 text-sm font-semibold text-foreground/80 flex items-center justify-between">
              <span>Apps</span>
              <button type="button" className="text-gray-400 hover:text-foreground transition-colors p-1 rounded-lg">
                <Plus className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5 shadow-sm group-hover:scale-105 transition-transform text-foreground">
                  <Clock className="size-5" />
                </div>
                <span className="text-[10px] font-medium text-foreground/70">Timer</span>
              </button>
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5 shadow-sm group-hover:scale-105 transition-transform text-foreground/50">
                  <CheckSquare className="size-5" />
                </div>
                <span className="text-[10px] font-medium text-foreground/50">Tasks</span>
              </button>
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5 shadow-sm group-hover:scale-105 transition-transform text-foreground/50">
                  <Calendar className="size-5" />
                </div>
                <span className="text-[10px] font-medium text-foreground/50">Soon</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="flex items-center gap-1 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/70 p-1.5 shadow-lg backdrop-blur-md pointer-events-auto">
        <li className="border-r border-gray-200 dark:border-gray-800 pr-1 relative">
          <button
            type="button"
            onClick={() => setIsAppsOpen(!isAppsOpen)}
            aria-label="Apps menu"
            className={`group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none size-9 rounded-xl ${isAppsOpen ? 'bg-gray-100 dark:bg-gray-800 text-foreground' : 'text-gray-500 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Grip className="size-4 pointer-events-none shrink-0" aria-hidden="true" />
          </button>
        </li>

        <li>
          <Link
            href="/"
            aria-label="Home"
            className={`group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none size-9 rounded-xl ${pathname === '/' ? 'bg-gray-100 dark:bg-gray-800 text-foreground' : 'text-gray-500 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Home className="size-4 pointer-events-none shrink-0" aria-hidden="true" />
          </Link>
        </li>
        
        <li>
          <Link
            href="/faq"
            className={`group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none h-9 px-3 rounded-xl ${pathname === '/faq' ? 'bg-gray-100 dark:bg-gray-800 text-foreground' : 'text-gray-500 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            FAQ
          </Link>
        </li>

        <li>
          <Link
            href="/terms"
            className={`group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none h-9 px-3 rounded-xl ${pathname === '/terms' ? 'bg-gray-100 dark:bg-gray-800 text-foreground' : 'text-gray-500 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            Terms
          </Link>
        </li>
      </ul>
    </motion.div>
  );
}
