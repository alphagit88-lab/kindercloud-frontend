import { FileText, Download } from "lucide-react";

export default function ParentDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-sky-900 mb-2">Hello, Sarah!</h1>
        <p className="text-lg text-sky-700/80 dark:text-neutral-400 font-medium">Here's what Leo has been up to at Owls Nursery.</p>
      </header>

      <section>
        <h2 className="text-2xl font-bold text-sky-900 mb-6 flex items-center gap-2">
            <FileText className="text-sky-500" /> Recent Activities & Homework
        </h2>

        <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 p-8 rounded-3xl shadow-sm border border-sky-100 dark:border-neutral-700 flex flex-col md:flex-row gap-6">
                <div className="bg-orange-100 text-orange-600 font-black text-xl w-16 h-16 rounded-2xl flex items-center justify-center shrink-0">
                    23<br/><span className="text-xs">OCT</span>
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Animal Sounds & Coloring</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 font-medium mb-4">
                        Today Leo learned about farm animals! Please practice the sounds of cows, pigs, and sheep at home tonight.
                    </p>
                    <button className="flex items-center gap-2 text-sky-600 bg-sky-50 font-bold px-4 py-2 rounded-xl hover:bg-sky-100 transition">
                        <Download className="w-4 h-4" /> Download Coloring PDF
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-8 rounded-3xl shadow-sm border border-sky-100 dark:border-neutral-700 flex flex-col md:flex-row gap-6">
                <div className="bg-orange-100 text-orange-600 font-black text-xl w-16 h-16 rounded-2xl flex items-center justify-center shrink-0">
                    22<br/><span className="text-xs">OCT</span>
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Counting Steps</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 font-medium mb-4">
                        We practiced counting to 10 using large building blocks.
                    </p>
                    <button className="flex items-center gap-2 text-sky-600 bg-sky-50 font-bold px-4 py-2 rounded-xl hover:bg-sky-100 transition">
                        <Download className="w-4 h-4" /> Download Counting Sheet PDF
                    </button>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
