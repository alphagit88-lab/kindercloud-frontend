'use client';

import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Loader2,
  X,
  CheckCircle2,
  Calendar,
  Award,
  DollarSign,
  Phone,
  Mail,
  Briefcase
} from 'lucide-react';
import { teachersAPI, Teacher } from '@/lib/api/teachers';

export default function TeacherManagementPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'Password@123',
    phone: '',
    qualification: '',
    specialization: '',
    baseSalary: 0
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await teachersAPI.getAll();
      setTeachers(data);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await teachersAPI.create(formData);
      setSuccessMessage('Teacher Registered Successfully!');
      setIsModalOpen(false);
      fetchTeachers();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      alert('Failed to register teacher');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure? This will permanently remove the teacher user.')) return;
    try {
      await teachersAPI.delete(userId);
      setTeachers(teachers.filter(t => t.user.id !== userId));
    } catch (error) {
      alert('Delete failed');
    }
  };

  const filteredTeachers = teachers.filter(t => 
    `${t.user.firstName} ${t.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col lg:row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-200">
                 <GraduationCap className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">Teacher Operations</h1>
           </div>
           <p className="text-slate-500 font-bold ml-1">Manage academic faculty, payroll records, and certifications.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search teachers..." 
                className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] w-64 lg:w-80 font-bold text-sm shadow-sm focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
           >
              <Plus className="w-5 h-5" />
              <span>Register Teacher</span>
           </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Academic Faculty', val: teachers.length, icon: Briefcase, color: 'amber' },
           { label: 'Avg. Years Exp', val: '4.2', icon: Award, color: 'sky' },
           { label: 'Active Salaries', val: teachers.length, icon: DollarSign, color: 'mint' },
         ].map((s, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group overflow-hidden relative">
              <div className="flex flex-col gap-1 relative z-10">
                 <div className="text-3xl font-black text-slate-800 tracking-tighter">{s.val}</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</div>
              </div>
              <div className={`w-14 h-14 bg-${s.color}-50 rounded-2xl flex items-center justify-center text-${s.color}-500 relative z-10`}>
                 <s.icon className="w-7 h-7" />
              </div>
           </div>
         ))}
      </div>

      {/* Registry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Loading Academic Records...</p>
          </div>
        ) : (
          filteredTeachers.length > 0 ? filteredTeachers.map((t) => (
            <div key={t.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-32 h-32 text-slate-200" />
               </div>
               
               <div className="flex flex-col h-full relative z-10">
                  <div className="flex items-start justify-between mb-8">
                     <div className="w-16 h-16 bg-linear-to-br from-amber-200 to-amber-100 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-amber-600 font-black text-xl italic">
                        {t.user.firstName.charAt(0)}
                     </div>
                     <div className="px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100 italic">
                        Faculty
                     </div>
                  </div>

                  <div className="mb-8">
                     <h2 className="text-2xl font-black text-slate-800 leading-none mb-2">{t.user.firstName} {t.user.lastName}</h2>
                     <p className="text-sm font-bold text-slate-400">{t.specialization || 'General Education'}</p>
                  </div>

                  <div className="space-y-3 mb-10 text-sm font-bold text-slate-500">
                     <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-300" /> {t.user.email}
                     </div>
                     <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-slate-300" /> {t.user.phone || 'No phone'}
                     </div>
                     <div className="flex items-center gap-3">
                        <Award className="w-4 h-4 text-amber-400" /> {t.qualification || 'No qualification added'}
                     </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-mint-500" />
                        <span className="font-black text-slate-800 text-sm tracking-tight">${(t.baseSalary ?? 0).toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base</span>
                     </div>
                     <div className="flex gap-2">
                        <button className="p-3 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all">
                           <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(t.user.id)}
                          className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center text-slate-400 font-bold italic">No faculty members found.</div>
          )
        )}
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
           <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-display font-black text-slate-900 tracking-tighter italic">Register New Teacher</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">KinderCloud Faculty Records</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                 <form id="teacher-form" onSubmit={handleCreate} className="space-y-10">
                    <div className="space-y-6">
                       <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 italic">Personal Profile</h3>
                       <div className="grid grid-cols-2 gap-6">
                          <input 
                            required placeholder="First Name"
                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-amber-500 font-bold text-sm outline-none transition-all" 
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          />
                          <input 
                            required placeholder="Last Name"
                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-amber-500 font-bold text-sm outline-none transition-all" 
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          />
                       </div>
                       <input 
                        required type="email" placeholder="Professional Email"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-amber-500 font-bold text-sm outline-none transition-all" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                       />
                       <input 
                        placeholder="Mobile Phone"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-amber-500 font-bold text-sm outline-none transition-all" 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                       />
                    </div>

                    <div className="space-y-6 pt-6 border-t border-slate-50">
                       <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 italic">Academic Expertise</h3>
                       <input 
                        placeholder="Qualification (e.g. B.Ed in Early Childhood)"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-amber-500 font-bold text-sm outline-none transition-all" 
                        onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                       />
                       <input 
                        placeholder="Specialization (e.g. Montessori, Art, Music)"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-amber-500 font-bold text-sm outline-none transition-all" 
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                       />
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Base Monthly Salary ($)</label>
                          <input 
                           type="number" 
                           className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-amber-500 font-bold text-sm outline-none transition-all" 
                           onChange={(e) => setFormData({...formData, baseSalary: Number(e.target.value)})}
                          />
                       </div>
                    </div>
                 </form>
              </div>

              <div className="p-10 border-t border-slate-50 bg-slate-50/50">
                 <button 
                  form="teacher-form"
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                 >
                    {createLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    ) : (
                      <>
                        <span>Finalize Teacher Registration</span>
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
