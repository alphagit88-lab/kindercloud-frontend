'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Search, 
  Plus, 
  Loader2,
  X,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  Filter
} from 'lucide-react';
import { financeAPI, Transaction, FinanceSummary } from '@/lib/api/finance';

export default function AdminFinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    type: 'income' as any,
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, [filterType]);

  const fetchData = async () => {
    try {
      const data = await financeAPI.getTransactions(filterType);
      setTransactions(data.transactions);
      setSummary(data.summary);
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await financeAPI.addTransaction({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setSuccessMessage('Transaction Logged Successfully!');
      setIsModalOpen(false);
      setFormData({ 
        type: 'income', 
        amount: '', 
        description: '', 
        transactionDate: new Date().toISOString().split('T')[0] 
      });
      fetchData();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      alert('Failed to log transaction');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col lg:row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-mint-100 rounded-2xl flex items-center justify-center text-mint-500 shadow-sm border border-mint-200">
                 <DollarSign className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">Finance Ledger</h1>
           </div>
           <p className="text-slate-500 font-bold ml-1">Track income, school fees, and operational expenses in real-time.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex bg-white p-1.5 border border-slate-100 rounded-[2rem] shadow-sm">
              <button 
                onClick={() => setFilterType('')}
                className={`px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${filterType === '' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-400 hover:text-slate-600'}`}
              >
                 All
              </button>
              <button 
                onClick={() => setFilterType('income')}
                className={`px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'income' ? 'bg-mint-500 text-white shadow-lg shadow-mint-500/10' : 'text-slate-400 hover:text-slate-600'}`}
              >
                 Income
              </button>
              <button 
                onClick={() => setFilterType('expense')}
                className={`px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'expense' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/10' : 'text-slate-400 hover:text-slate-600'}`}
              >
                 Expenses
              </button>
           </div>
           <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
           >
              <Plus className="w-5 h-5" />
              <span>Log Transaction</span>
           </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
               <Wallet className="w-24 h-24 text-slate-900" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Net Balance</p>
            <h2 className={`text-4xl font-display font-black tracking-tight ${summary && summary.netBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
               ${summary?.netBalance.toLocaleString() || '0.00'}
            </h2>
            <div className="mt-6 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Liquidity</p>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500 text-mint-500">
               <TrendingUp className="w-24 h-24" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Income</p>
            <h2 className="text-4xl font-display font-black tracking-tight text-mint-500">
               +${summary?.totalIncome.toLocaleString() || '0.00'}
            </h2>
            <div className="mt-6 flex items-center gap-2">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fees & Donations</p>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group text-rose-600">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
               <TrendingDown className="w-24 h-24" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Expenses</p>
            <h2 className="text-4xl font-display font-black tracking-tight">
               -${summary?.totalExpense.toLocaleString() || '0.00'}
            </h2>
            <div className="mt-6 flex items-center gap-2">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wages & Utilities</p>
            </div>
         </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-6 bg-mint-50 border-2 border-mint-200 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
           <CheckCircle2 className="w-8 h-8 text-mint-500 shadow-sm" />
           <div>
              <p className="text-sm font-black text-mint-900 uppercase tracking-widest leading-none mb-1">Success!</p>
              <p className="text-xs font-bold text-mint-700">{successMessage}</p>
           </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Activity</h2>
            <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-sky-500 transition-colors">
               <Filter className="w-3 h-3" />
               View Full Report
            </button>
         </div>
         <table className="w-full">
            <thead>
               <tr className="border-b border-slate-50 bg-slate-50/10 text-left">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                  <tr>
                     <td colSpan={4} className="py-20 text-center">
                        <Loader2 className="w-8 h-8 text-mint-500 animate-spin mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Auditing Ledger...</p>
                     </td>
                  </tr>
               ) : (
                  transactions.length > 0 ? transactions.map((t) => (
                     <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-slate-300" />
                              <span className="font-bold text-slate-600 text-sm">{new Date(t.transactionDate).toLocaleDateString()}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="font-bold text-slate-800">{t.description}</span>
                        </td>
                        <td className="px-10 py-6">
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              t.type === 'income' ? 'bg-mint-50 text-mint-500 border-mint-100' : 'bg-rose-50 text-rose-500 border-rose-100'
                           }`}>
                              {t.type}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <span className={`text-lg font-black ${t.type === 'income' ? 'text-mint-500' : 'text-rose-500'}`}>
                              {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                           </span>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={4} className="py-20 text-center text-slate-400 font-bold italic">
                           No transactions found in this period.
                        </td>
                     </tr>
                  )
               )}
            </tbody>
         </table>
      </div>

      {/* Log Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
           <div className="relative w-full max-w-md bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-display font-black text-slate-900 tracking-tighter italic">Log Transaction</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">KinderCloud Finance System</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10">
                 <form id="finance-form" onSubmit={handleCreate} className="space-y-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Entry Type</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button 
                           type="button"
                           onClick={() => setFormData({...formData, type: 'income'})}
                           className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                             formData.type === 'income' ? 'bg-mint-500 text-white border-mint-500 shadow-lg shadow-mint-500/10' : 'bg-white text-slate-400 border-slate-100 hover:border-mint-200'
                           }`}
                          >
                             Income
                          </button>
                          <button 
                           type="button"
                           onClick={() => setFormData({...formData, type: 'expense'})}
                           className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                             formData.type === 'expense' ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/10' : 'bg-white text-slate-400 border-slate-100 hover:border-rose-200'
                           }`}
                          >
                             Expense
                          </button>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount ($)</label>
                       <div className="relative">
                          <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            required type="number" step="0.01" min="0"
                            placeholder="0.00"
                            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-slate-900 font-bold text-sm outline-none transition-all" 
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Transaction Date</label>
                       <input 
                        required type="date"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-slate-900 font-bold text-sm outline-none transition-all" 
                        value={formData.transactionDate}
                        onChange={(e) => setFormData({...formData, transactionDate: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                       <textarea 
                        required
                        placeholder="e.g. Monthly Tuition Fee - Leo Smith, Electricity Bill, Staff Lunch"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-slate-900 font-bold text-sm outline-none transition-all h-32 resize-none" 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                       />
                    </div>
                 </form>
              </div>

              <div className="p-10 border-t border-slate-50 bg-slate-50/50">
                 <button 
                  form="finance-form"
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                 >
                    {createLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-mint-400" />
                    ) : (
                      <>
                        <span>Commit Entry</span>
                        <CheckCircle2 className="w-6 h-6 text-mint-500" />
                      </>
                    )}
                 </button>
              </div>
           </div>
        </div>
      )}
      
    </div>
  );
}
