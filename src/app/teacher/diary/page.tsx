import { CalendarHeart, Plus } from "lucide-react";

export default function TeacherDiaryPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-rose-500 flex items-center gap-3">
            <CalendarHeart className="w-8 h-8" /> My Diary Plans
          </h1>
          <p className="text-rose-900/60 dark:text-neutral-400 font-medium mt-2">Submit your day, month, and year plans for admin review.</p>
        </div>
        <button className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-sm">
          <Plus className="w-5 h-5" /> New Plan
        </button>
      </header>

      <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-sm border border-rose-100 dark:border-neutral-700 p-8">
        <h2 className="text-xl font-bold mb-6 text-rose-900 dark:text-rose-400">Recent Plannings</h2>
        
        <div className="space-y-6">
          <div className="bg-rose-50 dark:bg-neutral-900 border border-rose-100 dark:border-neutral-700 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-rose-200 text-rose-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 inline-block">Day Plan</span>
                <h3 className="font-bold text-xl">Monday, Oct 24th - Colors</h3>
              </div>
              <span className="text-sm font-bold text-emerald-500 bg-emerald-100 px-3 py-1 rounded-full">Reviewed</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">
              Introduction to primary colors. We will do finger painting to mix colors and see what secondary colors we can create. Then, sing the rainbow song.
            </p>
          </div>

          <div className="bg-rose-50 dark:bg-neutral-900 border border-rose-100 dark:border-neutral-700 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 inline-block">Month Plan</span>
                <h3 className="font-bold text-xl">October - Autumn Themes</h3>
              </div>
              <span className="text-sm font-bold text-neutral-500 bg-neutral-200 px-3 py-1 rounded-full">Pending</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">
              Focus on falling leaves, weather changing, Halloween crafts. Goal is to teach kids about the passing of seasons and emotional regulation during costume play.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
