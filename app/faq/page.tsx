import Link from "next/link";
import { ArrowLeft, Clock, Repeat, VolumeX, Keyboard, Heart } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "FAQ & Usage | 4track.my.id",
  description: "Learn how to use 4track.my.id effectively. Keyboard shortcuts, loop mode, and Pomodoro basics.",
};

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center">
      <header className="w-full max-w-5xl mx-auto p-4 md:p-6 flex items-center justify-end">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center shadow-sm backdrop-blur-md">
            <Image src="/logo.svg" alt="4track.my.id mark" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
          </div>
          <div className="font-sans flex items-baseline tracking-tight">
            <span className="text-[22px] sm:text-2xl font-bold text-white leading-none">4track</span>
            <span className="text-[14px] sm:text-[16px] font-medium text-white/60 ml-0.5 leading-none">.my.id</span>
            <span className="ml-2 text-[10px] font-medium border border-white/20 text-white/50 px-1.5 py-0.5 rounded-[4px] leading-none self-center">
              v{new Date().getFullYear()}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl px-4 py-12 flex flex-col gap-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">How to Use 4track</h1>
          <p className="text-lg text-white/60">
            A simple, distraction-free Pomodoro timer built to help you manage your workflow and maintain deep focus.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white/5 border border-white/10 rounded-[24px] p-6 md:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4 text-[#f05b56]">
              <Clock size={24} />
              <h2 className="text-2xl font-bold text-white">The Basics</h2>
            </div>
            <p className="text-white/80 leading-relaxed mb-4">
              The Pomodoro Technique is a time management method that breaks work into intervals, traditionally 25 minutes in length, separated by short breaks.
            </p>
            <ul className="space-y-3 text-white/70 list-disc list-inside ml-4">
              <li><strong>Pomodoro (25m):</strong> Deep, uninterrupted focus time.</li>
              <li><strong>Short Break (5m):</strong> Step away from the screen, stretch, or grab a drink.</li>
              <li><strong>Long Break (15m):</strong> A deeper rest taken after completing 4 consecutive Pomodoros.</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-[24px] p-6 md:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4 text-[#397097]">
              <Repeat size={24} />
              <h2 className="text-2xl font-bold text-white">Understanding Loop Mode</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              Clicking <strong>Loop</strong> automatically cycles you through a full Pomodoro session. It runs intelligently: Pomodoro ➔ Short Break ➔ Pomodoro ➔ Short Break... until you reach your 4th Pomodoro, where it automatically switches to a Long Break. At the end of the long break, you will be prompted if you wish to successfully restart the cycle.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white/5 border border-white/10 rounded-[24px] p-6 md:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 text-[#7d53a2]">
                <VolumeX size={24} />
                <h2 className="text-xl font-bold text-white">Muting Sounds</h2>
              </div>
              <p className="text-white/80 leading-relaxed">
                4track plays a subtle ticking sound while active and a bell notification when a timer hits zero. Click the speaker icon at the top right of the timer page to instantly mute all audio logic.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-[24px] p-6 md:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 text-green-400">
                <Keyboard size={24} />
                <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
              </div>
              <ul className="space-y-4 text-white/80">
                <li className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="font-medium">Play / Pause</span>
                  <kbd className="px-3 py-1 bg-white/10 rounded text-sm text-white font-mono shadow-sm">Space</kbd>
                </li>
                <li className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="font-medium">Reset Timer</span>
                  <kbd className="px-3 py-1 bg-white/10 rounded text-sm text-white font-mono shadow-sm">Esc</kbd>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-6 pb-8 text-white/50 text-sm font-medium z-10 relative flex flex-col items-center gap-2">
        <div className="flex items-center gap-4 text-white/50">
          <Link
            href="/"
            className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          >
            Timer
          </Link>
          <span className="text-white/30">•</span>
          <Link
            href="/terms"
            className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          >
            Terms & Support
          </Link>
        </div>
        <div>
          <a 
            href="https://juandisay.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-white opacity-60 hover:opacity-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm font-semibold"
            title="Created by Juan Disay"
          >
            &copy; {new Date().getFullYear()} juandisay
          </a>
        </div>
      </footer>
    </div>
  );
}
