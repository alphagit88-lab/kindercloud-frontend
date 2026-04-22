import { Palette, PlayCircle, Star, Music, Puzzle } from "lucide-react";

export default function KidRoomPage() {
  return (
    <div className="w-full max-w-5xl relative z-10 flex flex-col items-center justify-center">
      
      <div className="text-center mb-16 animate-bounce-slow">
         {/* A giant friendly mascot face or shape can go here later */}
         <div className="w-32 h-32 bg-amber-400 mx-auto rounded-full flex items-center justify-center shadow-xl border-8 border-white mb-6">
            <span className="text-5xl">🦁</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl cursor-pointer">
          {/* Big Action Buttons */}
          <div className="group bg-rose-400 hover:bg-rose-500 text-white rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 shadow-xl border-8 border-rose-300 hover:scale-105 transition-all active:scale-95 text-center">
             <Palette className="w-24 h-24 text-rose-100 group-hover:rotate-12 transition-transform" />
             <h2 className="text-5xl font-black">My Colors</h2>
             <span className="bg-white/20 px-4 py-2 rounded-full font-bold text-lg uppercase tracking-wider">2 New Fun Sheets!</span>
          </div>

          <div className="group bg-blue-400 hover:bg-blue-500 text-white rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 shadow-xl border-8 border-blue-300 hover:scale-105 transition-all active:scale-95 text-center">
             <PlayCircle className="w-24 h-24 text-blue-100 group-hover:scale-110 transition-transform" />
             <h2 className="text-5xl font-black">Videos</h2>
             <span className="bg-white/20 px-4 py-2 rounded-full font-bold text-lg uppercase tracking-wider">Watch "Animal Sounds"</span>
          </div>

          <div className="group bg-emerald-400 hover:bg-emerald-500 text-white rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 shadow-xl border-8 border-emerald-300 hover:scale-105 transition-all active:scale-95 text-center">
             <Music className="w-24 h-24 text-emerald-100 group-hover:-rotate-12 transition-transform" />
             <h2 className="text-5xl font-black">Songs</h2>
          </div>

          <div className="group bg-amber-400 hover:bg-amber-500 text-white rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 shadow-xl border-8 border-amber-300 hover:scale-105 transition-all active:scale-95 text-center">
             <Puzzle className="w-24 h-24 text-amber-100 group-hover:scale-110 transition-transform" />
             <h2 className="text-5xl font-black">Puzzles</h2>
          </div>
      </div>
      
    </div>
  );
}
