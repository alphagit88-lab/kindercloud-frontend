'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  TrendingUp,
  FileText
} from "lucide-react";
import { parentsAPI, Payment } from '@/lib/api/parents';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export default function ParentBillingPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await parentsAPI.getPayments();
      setPayments(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = payments.filter(p => p.type === 'income').reduce((sum, p) => sum + Number(p.amount), 0);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-10 h-10 text-sky-500 animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/30 text-white">
              <CreditCard className="w-7 h-7" />
            </div>
            <h1 className="text-4xl font-black text-sky-900 tracking-tight italic">Billing & Invoices</h1>
          </div>
          <p className="text-sky-900/60 dark:text-neutral-400 font-bold ml-1 uppercase text-[10px] tracking-widest">Manage your child's preschool fees and payments.</p>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 p-8 rounded-[2.5rem] shadow-sm border border-sky-100 dark:border-neutral-700 group hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                <TrendingUp className="w-6 h-6" />
             </div>
             <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Total Paid</span>
          </div>
          <div className="text-4xl font-black text-neutral-800 dark:text-white italic">${totalPaid.toLocaleString()}</div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 p-8 rounded-[2.5rem] shadow-sm border border-sky-100 dark:border-neutral-700 group hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                <Clock className="w-6 h-6" />
             </div>
             <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Next Due</span>
          </div>
          <div className="text-4xl font-black text-neutral-800 dark:text-white italic">May 1st</div>
        </div>

        <div className="bg-sky-500 p-8 rounded-[2.5rem] shadow-xl shadow-sky-500/20 text-white group hover:scale-[1.02] transition-all relative overflow-hidden">
          <CreditCard className="absolute -top-6 -right-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
          <h3 className="text-lg font-black mb-4">Balance Due</h3>
          <div className="text-4xl font-black italic mb-6">$0.00</div>
          <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-2xl text-xs font-black uppercase tracking-widest backdrop-blur-md transition-all">
            Quick Pay
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800/50 backdrop-blur-md rounded-[3rem] p-10 border border-sky-100 dark:border-neutral-700 shadow-sm min-h-[400px]">
        <h2 className="text-2xl font-black mb-8 text-neutral-800 dark:text-white flex items-center gap-3 italic">
            <FileText className="w-7 h-7 text-sky-500" />
            Payment History
        </h2>
        
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-sky-50 dark:border-neutral-800">
                  <th className="pb-6 text-[10px] font-black uppercase text-sky-400 tracking-widest">Description</th>
                  <th className="pb-6 text-[10px] font-black uppercase text-sky-400 tracking-widest">Date</th>
                  <th className="pb-6 text-[10px] font-black uppercase text-sky-400 tracking-widest">Amount</th>
                  <th className="pb-6 text-[10px] font-black uppercase text-sky-400 tracking-widest">Status</th>
                  <th className="pb-6 text-[10px] font-black uppercase text-sky-400 tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50/50 dark:divide-neutral-800/50">
                {payments.map((payment) => (
                  <tr key={payment.id} className="group hover:bg-sky-50/30 dark:hover:bg-neutral-800/30 transition-all">
                    <td className="py-6">
                      <p className="font-bold text-neutral-800 dark:text-neutral-200">{payment.description}</p>
                      <span className="text-[10px] font-black uppercase text-neutral-400 tracking-tighter">Transaction #{payment.id.slice(0, 8)}</span>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-sky-300" />
                        <span className="text-sm font-bold text-neutral-600">{format(new Date(payment.transactionDate), 'MMM do, yyyy')}</span>
                      </div>
                    </td>
                    <td className="py-6">
                      <span className="text-lg font-black text-neutral-800 dark:text-white italic">${Number(payment.amount).toFixed(2)}</span>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Completed</span>
                      </div>
                    </td>
                    <td className="py-6 text-right">
                       <button className="p-3 bg-sky-50 dark:bg-neutral-800 rounded-xl text-sky-500 hover:bg-sky-500 hover:text-white transition-all shadow-sm">
                          <Download className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-sky-50/20 dark:bg-neutral-900/30 rounded-[2.5rem] border-2 border-dashed border-sky-100">
            <CreditCard className="w-16 h-16 text-sky-100 mx-auto mb-4" />
            <p className="font-bold text-sky-400">No payment records found in your history.</p>
          </div>
        )}
      </div>

      {/* Support Card */}
      <footer className="p-10 bg-linear-to-r from-sky-900 to-sky-800 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
           <h4 className="text-2xl font-black mb-2 italic">Need billing assistance?</h4>
           <p className="text-sky-300 font-bold">Our financial office is here to help with payment plans or scholarship inquiries.</p>
        </div>
        <button className="px-10 py-5 bg-sky-500 hover:bg-sky-400 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-black/20 flex items-center gap-3">
          Message Support <ArrowRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
