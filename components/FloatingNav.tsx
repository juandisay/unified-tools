"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Home, Grip, Clock, Calendar, CheckSquare, Plus, HelpCircle, FileText } from "lucide-react";
import React from "react";

function NavItem({ 
  href, 
  icon: Icon, 
  label, 
  isActive 
}: { 
  href: string, 
  icon: React.ElementType, 
  label: string, 
  isActive: boolean 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li 
      className="relative flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={href}
        aria-label={label}
        className={`inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none size-9 rounded-xl ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-foreground' : 'text-gray-500 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'}`}
      >
        <Icon className="size-4 pointer-events-none shrink-0" aria-hidden="true" />
      </Link>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-white dark:bg-zinc-800 text-black dark:text-white text-sm font-semibold rounded-xl whitespace-nowrap shadow-sm border border-black/5 dark:border-white/10 z-50 pointer-events-none origin-bottom"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function FloatingNav() {
  const pathname = usePathname();
  const [isAppsOpen, setIsAppsOpen] = useState(false);

  return (
    <div 
      className="fixed bottom-12 inset-x-0 md:inset-x-auto md:right-8 lg:right-12 md:bottom-8 z-[999] pointer-events-none flex justify-center pb-[env(safe-area-inset-bottom)]"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
        className="relative"
      >
      <AnimatePresence>
        {isAppsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 mb-4 w-[calc(100vw-2rem)] max-w-sm sm:w-72 rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/70 p-4 shadow-2xl backdrop-blur-xl pointer-events-auto origin-bottom md:origin-bottom-right"
          >
            <div className="mb-3 px-1 text-sm font-semibold text-foreground/80 flex items-center justify-between">
              <span>Apps</span>
              <button type="button" className="text-gray-400 hover:text-foreground transition-colors p-1 rounded-lg">
                <Plus className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Link href="/" className="flex flex-col items-center gap-2 group" onClick={() => setIsAppsOpen(false)}>
                <div className={`w-12 h-12 rounded-2xl ${pathname === '/' ? 'bg-black/10 dark:bg-white/10 shadow-md text-foreground' : 'bg-black/5 dark:bg-white/5 shadow-sm text-foreground/50'} flex items-center justify-center border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform`}>
                  <Clock className="size-5" />
                </div>
                <span className={`text-[10px] font-medium ${pathname === '/' ? 'text-foreground' : 'text-foreground/50'}`}>Timer</span>
              </Link>
              <Link href="/tasks" className="flex flex-col items-center gap-2 group" onClick={() => setIsAppsOpen(false)}>
                <div className={`w-12 h-12 rounded-2xl ${pathname === '/tasks' ? 'bg-black/10 dark:bg-white/10 shadow-md text-foreground' : 'bg-black/5 dark:bg-white/5 shadow-sm text-foreground/50'} flex items-center justify-center border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform`}>
                  <CheckSquare className="size-5" />
                </div>
                <span className={`text-[10px] font-medium ${pathname === '/tasks' ? 'text-foreground' : 'text-foreground/50'}`}>Tasks</span>
              </Link>
              <Link href="/calendar" className="flex flex-col items-center gap-2 group" onClick={() => setIsAppsOpen(false)}>
                <div className={`w-12 h-12 rounded-2xl ${pathname === '/calendar' ? 'bg-black/10 dark:bg-white/10 shadow-md text-foreground' : 'bg-black/5 dark:bg-white/5 shadow-sm text-foreground/50'} flex items-center justify-center border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform`}>
                  <Calendar className="size-5" />
                </div>
                <span className={`text-[10px] font-medium ${pathname === '/calendar' ? 'text-foreground' : 'text-foreground/50'}`}>Calendar</span>
              </Link>
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

        <NavItem 
          href="/" 
          icon={Home} 
          label="Timer" 
          isActive={pathname === '/'} 
        />
        
        <NavItem 
          href="/faq" 
          icon={HelpCircle} 
          label="FAQ & Info" 
          isActive={pathname === '/faq'} 
        />

        <NavItem 
          href="/terms" 
          icon={FileText} 
          label="Terms & Support" 
          isActive={pathname === '/terms'} 
        />
      </ul>
      </motion.div>
    </div>
  );
}
