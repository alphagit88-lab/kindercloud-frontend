'use client';

import { useState, useEffect } from 'react';
import { CalendarHeart, Plus, X, Loader2, ClipboardList, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { diaryAPI, DiaryPlan } from '@/lib/api/diary';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

type PlanType = 'year' | 'month' | 'day';

export default function TeacherDiaryPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<DiaryPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeType, setActiveType] = useState<PlanType>('day');
  
  const [formData, setFormData] = useState({
    type: 'day' as PlanType,
    planDetails: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchPlans();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await diaryAPI.getTeacherPlans(user!.id);
      setPlans(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await diaryAPI.submitPlan(formData.type, formData.planDetails);
      setShowModal(false);
      fetchPlans();
      setFormData({ type: 'day', planDetails: '' });
    } catch (err) {
      console.error(err);
      setError('Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPlans = plans.filter(p => p.type === activeType);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30">
              <CalendarHeart className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-black text-rose-600 tracking-tight italic">Diary Plans</h1>
          </div>
          <p className="text-rose-900/60 dark:text-neutral-400 font-bold ml-1">Organize your teaching journey with structured plans.</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-[2rem] font-black flex items-center gap-2 transition-all shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" /> 
          <span className="uppercase tracking-widest">Submit New Plan</span>
        </button>
      </header>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Type Selector */}
      <div className="flex p-2 bg-white dark:bg-neutral-900 rounded-[2rem] border border-rose-100 dark:border-neutral-800 shadow-sm w-fit">
        {(['day', 'month', 'year'] as PlanType[]).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-8 py-3 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all ${
              activeType === type 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
              : 'text-rose-300 hover:text-rose-500'
            }`}
          >
            {type} Plan
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-neutral-800/50 backdrop-blur-md rounded-[2.5rem] border border-rose-100 dark:border-neutral-700/50 p-10 shadow-sm min-h-[400px]">
        <h2 className="text-2xl font-black mb-8 text-neutral-800 dark:text-white flex items-center gap-3">
          <ClipboardList className="w-7 h-7 text-rose-500" />
          Recent {activeType} Plans
        </h2>
        
        {loading ? (
           <div className="flex justify-center p-20"><Loader2 className="animate-spin text-rose-500 w-10 h-10" /></div>
        ) : filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPlans.map(plan => (
              <div 
                key={plan.id} 
                className="p-8 border border-neutral-100 dark:border-neutral-700/50 rounded-[2rem] bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-rose-200 hover:bg-rose-50/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-[4rem] flex items-center justify-center group-hover:bg-rose-500/10 transition-colors">
                    <CheckCircle2 className="w-8 h-8 text-rose-500/20 group-hover:text-rose-500/40 transition-colors" />
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-rose-300 uppercase tracking-[0.2em]">{plan.type} Plan</p>
                        <p className="font-bold text-neutral-500 text-xs">{format(new Date(plan.createdAt), 'MMMM do, yyyy')}</p>
                    </div>
                </div>

                <p className="text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed italic">
                  "{plan.planDetails}"
                </p>
                
                <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest">Active</span>
                    <button className="text-rose-500 font-black text-xs hover:underline uppercase tracking-widest">Edit Plan</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-rose-50/30 dark:bg-neutral-900/30 rounded-[2rem] border-2 border-dashed border-rose-100 dark:border-neutral-800">
            <div className="w-24 h-24 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-200 shadow-sm">
              <CalendarHeart className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-neutral-700 dark:text-neutral-300 mb-2 italic">No {activeType} plans found!</h3>
            <p className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest mb-8">Start your journey by creating a new plan today.</p>
            <button onClick={() => setShowModal(true)} className="bg-rose-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">Create Now</button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-neutral-900 w-full max-w-xl rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-10">
              <header className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
                      <Plus className="w-7 h-7" />
                   </div>
                   <h2 className="text-3xl font-black text-neutral-800 dark:text-white tracking-tight italic">New Diary Entry</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                  <X className="w-8 h-8" />
                </button>
              </header>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Select Plan Category</label>
                  <div className="grid grid-cols-3 gap-3">
                      {(['day', 'month', 'year'] as PlanType[]).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({...formData, type})}
                            className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                                formData.type === type 
                                ? 'border-rose-500 bg-rose-500 text-white' 
                                : 'border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:border-rose-200'
                            }`}
                          >
                              {type}
                          </button>
                      ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-2 flex items-center gap-2">
                    <ClipboardList className="w-3.5 h-3.5" />
                    Detailed Plan Content
                  </label>
                  <textarea 
                    rows={6}
                    required
                    value={formData.planDetails}
                    onChange={(e) => setFormData({...formData, planDetails: e.target.value})}
                    placeholder="Describe your magical teaching objectives and methods..."
                    className="w-full px-8 py-6 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold resize-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-300 shadow-inner"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-linear-to-r from-rose-500 to-rose-600 hover:scale-[1.01] active:scale-[0.99] text-white py-6 rounded-[2rem] font-black text-lg shadow-xl shadow-rose-500/30 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
                >
                  {submitting ? <Loader2 className="animate-spin w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                  {submitting ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
