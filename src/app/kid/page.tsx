'use client';

import { Palette, PlayCircle, Star, Music, Puzzle, FolderHeart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function KidRoomPage() {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-5xl relative z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-1000">
      
      <div className="text-center mb-16 relative">
         <div className="absolute -top-10 -left-10 w-24 h-24 text-amber-300 animate-pulse">
            <Sparkles className="w-full h-full" />
         </div>
         <div className="w-32 h-32 bg-amber-400 mx-auto rounded-full flex items-center justify-center shadow-xl border-8 border-white mb-6 animate-bounce-slow">
            <span className="text-5xl">🦁</span>
         </div>
         <h1 className="text-4xl font-black text-amber-600 italic uppercase tracking-tighter">
            Magic Day, {user?.firstName}!
         </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
          {/* Big Action Buttons */}
          <Link href="/kid/works/pdf" className="group bg-rose-400 hover:bg-rose-500 text-white rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 shadow-xl border-8 border-rose-300 hover:scale-105 transition-all active:scale-95 text-center">
             <Palette className="w-24 h-24 text-rose-100 group-hover:rotate-12 transition-transform" />
             <h2 className="text-5xl font-black uppercase italic tracking-tighter">My Works</h2>
             <span className="bg-white/20 px-6 py-2 rounded-full font-black text-lg uppercase tracking-widest">Open PDF!</span>
          </Link>

          <Link href="/kid/works/video" className="group bg-blue-400 hover:bg-blue-500 text-white rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 shadow-xl border-8 border-blue-300 hover:scale-105 transition-all active:scale-95 text-center">
             <PlayCircle className="w-24 h-24 text-blue-100 group-hover:scale-110 transition-transform" />
             <h2 className="text-5xl font-black uppercase italic tracking-tighter">Videos</h2>
             <span className="bg-white/20 px-6 py-2 rounded-full font-black text-lg uppercase tracking-widest">Watch & Fun!</span>
          </Link>

          <div className="group bg-emerald-400 hover:bg-emerald-500 text-white rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 shadow-xl border-8 border-emerald-300 hover:scale-105 transition-all active:scale-95 text-center opacity-70">
             <Music className="w-24 h-24 text-emerald-100 group-hover:-rotate-12 transition-transform" />
             <h2 className="text-5xl font-black uppercase italic tracking-tighter">Songs</h2>
             <span className="bg-white/20 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">Coming Soon!</span>
          </div>

          <div className="group bg-amber-400 hover:bg-amber-500 text-white rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 shadow-xl border-8 border-amber-300 hover:scale-105 transition-all active:scale-95 text-center opacity-70">
             <Puzzle className="w-24 h-24 text-amber-100 group-hover:scale-110 transition-transform" />
             <h2 className="text-5xl font-black uppercase italic tracking-tighter">Games</h2>
             <span className="bg-white/20 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">Coming Soon!</span>
          </div>
      </div>
      
    </div>
  );
}
