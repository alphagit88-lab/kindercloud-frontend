'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ArrowRight,
  Smile,
  Heart,
  Baby,
  ShieldAlert,
  Loader2,
  X,
  CheckCircle2,
  MapPin,
  Calendar,
  Stethoscope,
  Home,
  Sparkles
} from 'lucide-react';
import { studentsAPI, Student } from '@/lib/api/students';
import { classroomsAPI, ClassRoom } from '@/lib/api/classrooms';

export default function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: 'Password@123',
    gender: 'Other',
    dateOfBirth: '',
    classRoomId: '',
    address: '',
    emergencyContact: '',
    medicalNotes: '',
    guardianInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      relationship: 'Parent'
    }
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsData, classroomsData] = await Promise.all([
        studentsAPI.getAll(),
        classroomsAPI.getAll()
      ]);
      setStudents(studentsData);
      setClassrooms(classroomsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, userId: string) => {
    if (!confirm('Are you sure you want to remove this student? This will also remove the kid user account.')) return;
    try {
      await studentsAPI.delete(userId);
      setStudents(students.filter(s => s.userId !== userId));
    } catch (error) {
      alert('Failed to delete student');
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      password: '', // Don't show password on edit
      gender: student.gender || 'Other',
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
      classRoomId: student.classRoomId || '',
      address: student.address || '',
      emergencyContact: student.emergencyContact || '',
      medicalNotes: student.medicalNotes || '',
      guardianInfo: initialFormState.guardianInfo // Guardians are usually managed separately or requires more logic
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      if (selectedStudent) {
        await studentsAPI.update(selectedStudent.user.id, formData);
        setSuccessMessage('Student Updated Successfully!');
      } else {
        await studentsAPI.create(formData);
        setSuccessMessage('Student Enrollment Successful!');
      }
      setIsModalOpen(false);
      fetchData();
      setSelectedStudent(null);
      setFormData(initialFormState);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      alert(`Failed to ${selectedStudent ? 'update' : 'enroll'} student`);
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    `${s.user.firstName} ${s.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col lg:row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-200">
                 <Baby className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">Student Registry</h1>
           </div>
           <p className="text-slate-500 font-bold ml-1">Manage enrollments, guardian links, and classroom allocations.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] w-64 lg:w-80 font-bold text-sm shadow-sm focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
            onClick={() => {
              setSelectedStudent(null);
              setFormData(initialFormState);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
           >
              <Plus className="w-5 h-5" />
              <span>Enroll Student</span>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Registered Kids', val: students.length, icon: Users, color: 'sky' },
           { label: 'Active Classes', val: classrooms.length, icon: Home, color: 'amber' },
           { label: 'Pending Guardians', val: 0, icon: ShieldAlert, color: 'rose' },
           { label: 'New This Month', val: 0, icon: Sparkles, color: 'mint' },
         ].map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${s.color}-500/5 rounded-full group-hover:scale-150 transition-transform duration-700`} />
              <div className="flex flex-col gap-4 relative z-10">
                 <div className={`w-12 h-12 bg-${s.color}-50 rounded-2xl flex items-center justify-center text-${s.color}-500`}>
                    <s.icon className="w-6 h-6" />
                 </div>
                 <div>
                    <div className="text-3xl font-black text-slate-800 tracking-tighter">{s.val}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{s.label}</div>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Syncing Cloud Registry...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Profile</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Classroom</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Admission</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                <tr key={s.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-rose-100 to-rose-50 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center text-rose-500 font-black text-sm italic group-hover:scale-110 transition-transform">
                        {s.user.firstName.charAt(0)}{s.user.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-800 leading-none mb-1">{s.user.firstName} {s.user.lastName}</p>
                        <p className="text-xs font-bold text-slate-400">{s.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-sky-500" />
                       <span className="font-bold text-slate-600 text-sm italic">{s.classRoom?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider italic">
                      {new Date(s.admissionDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="inline-flex items-center px-4 py-1.5 bg-mint-50 text-mint-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-mint-100">
                      Active
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-center gap-2">
                       <button 
                        onClick={() => handleEdit(s)}
                        className="p-3 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all"
                       >
                          <Edit3 className="w-5 h-5" />
                       </button>
                       <button 
                        onClick={() => handleDelete(s.id, s.user.id)}
                        className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                       >
                          <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-32 text-center text-slate-400 font-bold italic">No students found in registry.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Enrollment Modal (Slide-over approach) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
           <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-display font-black text-slate-900 tracking-tighter italic">Enroll New Student</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">KinderCloud Enrollment System</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                 <form id="enrollment-form" onSubmit={handleSubmit} className="space-y-10">
                    
                    {/* Student Details Section */}
                    <div className="space-y-6">
                       <div className="flex items-center gap-3">
                          <Baby className="w-5 h-5 text-rose-500" />
                          <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 italic">Student Information</h3>
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                             <input 
                              required
                              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                              value={formData.firstName}
                              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                             <input 
                              required
                              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                              value={formData.lastName}
                              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                             />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kid's Email (Unique)</label>
                             <input 
                              required type="email" 
                              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Gender</label>
                             <select 
                              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-black text-[11px] uppercase tracking-widest outline-none transition-all cursor-pointer"
                              value={formData.gender}
                              onChange={(e) => setFormData({...formData, gender: e.target.value})}
                             >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                             </select>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date of Birth</label>
                             <input 
                              type="date" 
                              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                              value={formData.dateOfBirth}
                              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Classroom Allocation</label>
                             <select 
                              required
                              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-black text-[11px] uppercase tracking-widest outline-none transition-all cursor-pointer"
                              value={formData.classRoomId}
                              onChange={(e) => setFormData({...formData, classRoomId: e.target.value})}
                             >
                                <option value="">Select a Class</option>
                                {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                             </select>
                          </div>
                       </div>
                    </div>

                    {/* Guardian Section */}
                    <div className="space-y-6 pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-sky-500" />
                          <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 italic">Guardian Connection</h3>
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Guardian First Name</label>
                             <input 
                              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                              value={formData.guardianInfo.firstName}
                              onChange={(e) => setFormData({...formData, guardianInfo: {...formData.guardianInfo, firstName: e.target.value}})}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Guardian Last Name</label>
                             <input 
                              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                              value={formData.guardianInfo.lastName}
                              onChange={(e) => setFormData({...formData, guardianInfo: {...formData.guardianInfo, lastName: e.target.value}})}
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Guardian Email</label>
                          <input 
                           type="email" 
                           className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                           value={formData.guardianInfo.email}
                           onChange={(e) => setFormData({...formData, guardianInfo: {...formData.guardianInfo, email: e.target.value}})}
                          />
                       </div>
                    </div>

                    {/* Medical & Other */}
                    <div className="space-y-6 pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-3">
                          <Stethoscope className="w-5 h-5 text-amber-500" />
                          <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 italic">Health & Notes</h3>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Medical/Allergy Notes</label>
                          <textarea 
                           className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all h-32" 
                           placeholder="Type any allergies or medical conditions here..."
                           value={formData.medicalNotes}
                           onChange={(e) => setFormData({...formData, medicalNotes: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Physical Address</label>
                          <input 
                           className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                           value={formData.address}
                           onChange={(e) => setFormData({...formData, address: e.target.value})}
                          />
                       </div>
                    </div>

                 </form>
              </div>

              <div className="p-10 border-t border-slate-50 bg-slate-50/50">
                 <button 
                  form="enrollment-form"
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                 >
                    {createLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
                    ) : (
                      <>
                        <span>{selectedStudent ? 'Update Student Details' : 'Finalize Student Enrollment'}</span>
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
