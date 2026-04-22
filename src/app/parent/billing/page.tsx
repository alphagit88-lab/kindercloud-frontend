import { CreditCard, CheckCircle } from "lucide-react";

export default function ParentBillingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-sky-900 mb-2 flex items-center gap-3">
            <CreditCard className="w-10 h-10 text-sky-500" /> Billing & Invoices
        </h1>
        <p className="text-lg text-sky-700/80 dark:text-neutral-400 font-medium">Manage Leo's preschool tuition and payments.</p>
      </header>

      <section>
        <div className="bg-white dark:bg-neutral-800 p-8 rounded-3xl shadow-sm border border-sky-100 dark:border-neutral-700">
            <h2 className="text-2xl font-bold text-sky-900 mb-6">Current Balance</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-between bg-sky-50/50 p-6 rounded-2xl border border-sky-100 dark:border-neutral-700 mb-8">
                <div>
                    <h3 className="text-neutral-500 font-bold uppercase tracking-wider text-sm mb-1">Amount Due</h3>
                    <p className="text-5xl font-black text-rose-500">$150.00</p>
                </div>
                <button className="mt-4 md:mt-0 bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-8 rounded-xl transition shadow-md w-full md:w-auto">
                    Pay Now
                </button>
            </div>

            <h3 className="font-bold text-lg mb-4">Recent History</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-neutral-100 dark:border-neutral-700">
                    <div>
                        <p className="font-bold text-lg">October Tuition Deposit</p>
                        <p className="text-sm text-neutral-500 font-medium mt-1">Oct 1st, 2026</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg">$500.00</p>
                        <span className="flex items-center gap-1 text-emerald-500 text-sm font-bold mt-1">
                            <CheckCircle className="w-4 h-4" /> Paid
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-center py-4">
                    <div>
                        <p className="font-bold text-lg">Autumn Field Trip Fee</p>
                        <p className="text-sm text-neutral-500 font-medium mt-1">Oct 15th, 2026</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg">$25.00</p>
                        <span className="flex items-center gap-1 text-emerald-500 text-sm font-bold mt-1">
                            <CheckCircle className="w-4 h-4" /> Paid
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
