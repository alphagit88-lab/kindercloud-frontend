'use client';

import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2,
  X,
  CheckCircle2,
  Award,
  DollarSign,
  Phone,
  Mail,
  Briefcase,
  Check,
  CalendarDays,
  Clock,
  ChevronRight
} from 'lucide-react';
import { teachersAPI, Teacher } from '@/lib/api/teachers';
import { teacherOpsAPI, AttendanceRecord, SalaryRecord } from '@/lib/api/teacherOps';

export default function TeacherManagementPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpsModalOpen, setIsOpsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [opsType, setOpsType] = useState<'attendance' | 'salary'>('attendance');
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

  const [attendanceData, setAttendanceData] = useState({
    status: 'present' as any,
    note: ''
  });

  const [salaryData, setSalaryData] = useState({
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    paymentMethod: 'bank_transfer'
  });

  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    setCreateLoading(true);
    try {
      await teacherOpsAPI.markAttendance({
        teacherId: selectedTeacher.id,
        ...attendanceData
      });
      setSuccessMessage('Attendance Marked!');
      setIsOpsModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      alert('Failed to mark attendance');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleProcessSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    setCreateLoading(true);
    try {
      await teacherOpsAPI.processSalary({
        teacherId: selectedTeacher.id,
        amount: parseFloat(salaryData.amount),
        month: salaryData.month,
        year: salaryData.year,
        paymentMethod: salaryData.paymentMethod,
        status: 'paid'
      });
      setSuccessMessage('Salary Processed Successfully!');
      setIsOpsModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      alert('Failed to process salary');
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

  const openOps = async (teacher: Teacher, type: 'attendance' | 'salary') => {
    setSelectedTeacher(teacher);
    setOpsType(type);
    if (type === 'salary') setSalaryData({...salaryData, amount: (teacher.baseSalary || 0).toString()});
    if (type === 'attendance') {
        setHistoryLoading(true);
        try {
            const history = await teacherOpsAPI.getAttendance(teacher.id);
            setAttendanceHistory(history);
        } catch (err) {
            console.error(err);
        } finally {
            setHistoryLoading(false);
        }
    }
    setIsOpsModalOpen(true);
  };

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

      {/* Registry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Loading Academic Records...</p>
          </div>
        ) : (
          filteredTeachers.length > 0 ? filteredTeachers.map((t) => (
            <div key={t.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group p-8 relative overflow-hidden flex flex-col">
               <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
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

                  <div className="mb-6">
                     <h2 className="text-2xl font-black text-slate-800 leading-none mb-2">{t.user.firstName} {t.user.lastName}</h2>
                     <p className="text-sm font-bold text-slate-400">{t.specialization || 'General Education'}</p>
                  </div>

                  <div className="space-y-3 mb-8 text-sm font-bold text-slate-500">
                     <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-300" /> {t.user.email}
                     </div>
                     <div className="flex items-center gap-3">
                        <Award className="w-4 h-4 text-amber-400" /> {t.qualification || 'No qualification added'}
                     </div>
                     <div className="flex items-center gap-2 pt-2">
                        <DollarSign className="w-4 h-4 text-mint-500" />
                        <span className="font-black text-slate-800 tracking-tight">${(t.baseSalary ?? 0).toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                     <button 
                      onClick={() => openOps(t, 'attendance')}
                      className="flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-50 hover:text-amber-600 transition-all border border-slate-100"
                     >
                        <CalendarDays className="w-3 h-3" />
                        Attendance
                     </button>
                     <button 
                      onClick={() => openOps(t, 'salary')}
                      className="flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-mint-50 hover:text-mint-600 transition-all border border-slate-100"
                     >
                        <DollarSign className="w-3 h-3" />
                        Pay Salary
                     </button>
                  </div>

                  <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Teacher ID: {t.id.substring(0, 8)}</span>
                     </div>
                     <div className="flex gap-2">
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

      {/* Operations Modal (Attendance / Salary) */}
      {isOpsModalOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOpsModalOpen(false)} />
           <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 bg-linear-to-br from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 font-black italic">
                       {selectedTeacher.user.firstName.charAt(0)}
                    </div>
                    <div>
                       <h2 className="text-xl font-display font-black text-slate-900 italic">{selectedTeacher.user.firstName} {selectedTeacher.user.lastName}</h2>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                          {opsType === 'attendance' ? 'Daily Attendance Logging' : 'Monthly Salary Processing'}
                       </p>
                    </div>
                 </div>
                 <button onClick={() => setIsOpsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X className="w-6 h-6 text-slate-300" />
                 </button>
              </div>

              <div className="p-10">
                 {opsType === 'attendance' ? (
                    <div className="space-y-8">
                       <form onSubmit={handleMarkAttendance} className="space-y-6 bg-slate-50 dark:bg-neutral-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-neutral-700">
                          <div className="grid grid-cols-2 gap-3">
                             {[
                                { id: 'present', label: 'Present', color: 'mint', icon: Check },
                                { id: 'absent', label: 'Absent', color: 'rose', icon: X },
                                { id: 'late', label: 'Late', color: 'amber', icon: Clock },
                                { id: 'leave', label: 'Leave', color: 'sky', icon: ChevronRight },
                                { id: 'half-day', label: 'Half Day', color: 'indigo', icon: Coffee },
                             ].map((s) => (
                                <button 
                                 type="button"
                                 key={s.id}
                                 onClick={() => setAttendanceData({...attendanceData, status: s.id})}
                                 className={`flex items-center gap-3 p-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                                    attendanceData.status === s.id ? `bg-${s.color}-500 text-white border-${s.color}-500 shadow-lg shadow-${s.color}-500/10` : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                                 }`}
                                >
                                   <s.icon className="w-4 h-4" />
                                   {s.label}
                                </button>
                             ))}
                          </div>
                          <div className="space-y-2">
                             <input 
                               className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white focus:border-amber-500 font-bold text-sm outline-none transition-all"
                               placeholder="Note / Late reason..."
                               value={attendanceData.note}
                               onChange={(e) => setAttendanceData({...attendanceData, note: e.target.value})}
                             />
                          </div>
                          <button 
                            type="submit" 
                            disabled={createLoading}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                          >
                             {createLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Attendance'}
                          </button>
                       </form>

                       <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Monthly History</h3>
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                             {historyLoading ? (
                                <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-200" /></div>
                             ) : attendanceHistory.length > 0 ? (
                                attendanceHistory.map((record, i) => (
                                   <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                                      <div className="flex items-center gap-4">
                                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] uppercase ${
                                            record.status === 'present' ? 'bg-mint-50 text-mint-500' : 
                                            record.status === 'late' ? 'bg-amber-50 text-amber-500' :
                                            record.status === 'leave' ? 'bg-sky-50 text-sky-500' : 'bg-rose-50 text-rose-500'
                                         }`}>
                                            {record.status === 'present' ? 'P' : record.status === 'late' ? 'L' : record.status === 'leave' ? 'LV' : record.status === 'half-day' ? 'HD' : 'A'}
                                         </div>
                                         <div>
                                            <p className="text-sm font-black text-slate-800">{new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            <p className="text-[10px] font-bold text-slate-400">
                                                {record.checkInTime ? `IN: ${new Date(record.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'No Check-in'}
                                                {record.checkOutTime ? ` • OUT: ${new Date(record.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : ''}
                                            </p>
                                         </div>
                                      </div>
                                      {record.note && (
                                         <div className="group relative">
                                            <AlertCircle className="w-4 h-4 text-amber-400 cursor-help" />
                                            <div className="absolute right-0 bottom-full mb-2 w-48 p-3 bg-slate-800 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                               {record.note}
                                            </div>
                                         </div>
                                      )}
                                   </div>
                                ))
                             ) : (
                                <div className="py-10 text-center text-xs font-bold text-slate-300 italic">No attendance records for this month.</div>
                             )}
                          </div>
                       </div>
                    </div>
                 ) : (
                   <form onSubmit={handleProcessSalary} className="space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Month</label>
                            <select 
                              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white font-black text-[10px] uppercase tracking-widest"
                              value={salaryData.month}
                              onChange={(e) => setSalaryData({...salaryData, month: parseInt(e.target.value)})}
                            >
                               {Array.from({length: 12}, (_, i) => (
                                 <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('en-US', {month: 'long'})}</option>
                               ))}
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Year</label>
                            <select 
                              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white font-black text-[10px] uppercase tracking-widest"
                              value={salaryData.year}
                              onChange={(e) => setSalaryData({...salaryData, year: parseInt(e.target.value)})}
                            >
                               {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Payout Amount ($)</label>
                         <div className="relative">
                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input 
                              required type="number"
                              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white font-bold text-sm"
                              value={salaryData.amount}
                              onChange={(e) => setSalaryData({...salaryData, amount: e.target.value})}
                            />
                         </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={createLoading}
                        className="w-full py-5 bg-mint-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-mint-600 transition-all shadow-xl shadow-mint-500/10 disabled:opacity-50"
                      >
                         {createLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Payment'}
                      </button>
                   </form>
                 )}
              </div>
           </div>
        </div>
      )}
      
    </div>
  );
}
