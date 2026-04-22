import { DollarSign, Plus } from "lucide-react";

export default function AdminFinancePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-blue-500" /> Finances & Inventory
          </h1>
          <p className="text-neutral-500 mt-2">Manage income, expenses, and preschool assets.</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition shadow-sm">
          <Plus className="w-5 h-5" /> Log Transaction
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
          <h2 className="text-xl font-bold mb-4">Financial Ledger</h2>
          <div className="space-y-4">
             <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700">
                <div>
                  <p className="font-bold">Term Tuition (Leo)</p>
                  <p className="text-sm text-neutral-500">Income • Today</p>
                </div>
                <span className="font-bold text-emerald-500">+$500.00</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700">
                <div>
                  <p className="font-bold">Finger Paints Bulk</p>
                  <p className="text-sm text-neutral-500">Expense • Yesterday</p>
                </div>
                <span className="font-bold text-red-500">-$45.00</span>
             </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Stock & Inventory</h2>
            <button className="text-blue-500 font-bold text-sm">Update Stock</button>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700">
                <span className="font-medium">Finger Paints (Boxes)</span>
                <span className="font-bold">12</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700">
                <span className="font-medium">A4 Paper (Reams)</span>
                <span className="font-bold text-red-500">2</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700">
                <span className="font-medium">Play-Doh (Packs)</span>
                <span className="font-bold">24</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
