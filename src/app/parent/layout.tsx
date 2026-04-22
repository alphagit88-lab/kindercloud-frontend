import Link from "next/link";
import { ReactNode } from "react";
import { FileText, CreditCard, MessageSquare, UserCircle, LogOut } from "lucide-react";

export default function ParentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-sky-50 dark:bg-neutral-900 transition-colors">
      <aside className="w-72 bg-white dark:bg-neutral-800 shadow-sm flex flex-col pt-8 pb-6 border-r border-sky-100 dark:border-neutral-700">
        <h1 className="text-2xl font-black px-8 mb-10 text-sky-500 flex items-center gap-2">
          KinderCloud
        </h1>
        <div className="px-8 flex-1">
            <h2 className="text-xs font-black text-sky-300 dark:text-neutral-500 uppercase tracking-wider mb-4">My Dashboard</h2>
            <nav className="space-y-3">
            <Link href="/parent" className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-sky-100 dark:hover:bg-neutral-700 transition text-sky-900 dark:text-neutral-200">
                <FileText className="w-5 h-5 text-sky-500" />
                <span className="font-bold">Latest Activities</span>
            </Link>
            <Link href="/parent/billing" className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-sky-100 dark:hover:bg-neutral-700 transition text-sky-900 dark:text-neutral-200">
                <CreditCard className="w-5 h-5 text-sky-500" />
                <span className="font-bold">Billing & Invoices</span>
            </Link>
            <Link href="/parent/messages" className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-sky-100 dark:hover:bg-neutral-700 transition text-sky-900 dark:text-neutral-200">
                <MessageSquare className="w-5 h-5 text-sky-500" />
                <span className="font-bold">Message Teacher</span>
            </Link>
            </nav>
        </div>

        <div className="px-8 mb-4 border-t border-sky-100 dark:border-neutral-700 pt-6">
             <button className="w-full flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-sm transition">
                <UserCircle className="w-5 h-5" /> Switch to Leo's Portal
             </button>
        </div>

        <div className="px-8 mt-2">
            <button className="flex items-center gap-3 px-4 py-2 w-full text-left text-neutral-500 hover:text-red-500 font-bold transition">
                <LogOut className="w-5 h-5" /> Logout
            </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-10 text-neutral-800 dark:text-neutral-200">
        {children}
      </main>
    </div>
  );
}
