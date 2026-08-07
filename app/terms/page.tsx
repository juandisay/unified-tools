import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Terms & Support | 4track.my.id",
  description: "Learn about 4track.my.id opensource project and how to support it.",
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center">
      <header className="w-full max-w-5xl mx-auto p-4 md:p-6 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors backdrop-blur-md">
            <ArrowLeft size={20} />
          </div>
          <span className="font-semibold">Back to Timer</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center shadow-sm backdrop-blur-md">
            <Image src="/logo.svg" alt="4track.my.id mark" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
          </div>
          <div className="font-sans flex items-baseline tracking-tight">
            <span className="text-xl sm:text-2xl font-bold text-white leading-none">4</span>
            <span className="text-lg sm:text-xl font-medium text-white/60 leading-none">track.my.id</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl px-4 py-12 flex flex-col gap-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Terms & Support</h1>
          <p className="text-lg text-white/60">
            Information about this open-source project and how to support it.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white/5 border border-white/10 rounded-[24px] p-6 md:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#CCFF00]/10 text-[#CCFF00] flex items-center justify-center shadow-inner">
                <span className="font-bold text-lg">OSS</span>
              </div>
              <h2 className="text-2xl font-bold">Open Source Project</h2>
            </div>
            <div className="text-white/70 leading-relaxed text-lg space-y-4">
              <p>
                This is an open-source project.
              </p>
              <p>
                To help keep the service running smoothly, your support is greatly appreciated:
              </p>
            </div>
            <div className="mt-6">
              <a 
                href="https://teer.id/juandisay" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#CCFF00] text-black font-semibold rounded-2xl px-6 py-4 hover:bg-[#bbe600] transition-colors focus:ring-4 focus:ring-[#CCFF00]/30 outline-none w-full sm:w-auto text-lg text-center"
              >
                Support on teer.id
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full text-center py-8 text-white/50 text-sm font-medium z-10 relative">
        Copyright © 2026 by{" "}
        <a 
          href="https://juandisay.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white hover:text-[#CCFF00] transition-colors underline decoration-white/20 underline-offset-4 font-semibold"
        >
          Juan Disay
        </a>
      </footer>
    </div>
  );
}
