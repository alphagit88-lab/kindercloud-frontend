import { ReactNode } from "react";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function KidLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#FFFDF0] dark:bg-neutral-900 overflow-hidden font-sans">
      {/* 
        Kid's Top Navigation Bar 
        Optimized for zero text reading where possible, big visual cues.
      */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-amber-100 dark:border-neutral-700 pointer-events-auto shadow-amber-200/50">
            <span className="text-2xl font-black text-amber-500 tracking-wider">🌟 Leo's Magic Cloud</span>
          </div>
          <Link href="/parent" className="bg-red-500 hover:bg-red-600 border-4 border-red-300 text-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform pointer-events-auto">
             <LogOut className="w-8 h-8" />
          </Link>
      </nav>

      {/* Main Sandbox Area */}
      <main className="flex-1 w-full h-full flex flex-col items-center justify-center p-8 pt-24 relative overflow-y-auto">
        {/* Playful Background Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-rose-300 rounded-full blur-3xl opacity-50"></div>
        
        {children}
      </main>
    </div>
  );
}
