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
  const [activeStep, setActiveStep] = useState(1);
  const [lastStepChange, setLastStepChange] = useState(0);

  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: 'Password@123',
    gender: 'Other',
    dateOfBirth: '',
    classroomIds: [] as string[],
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

  useEffect(() => {
    if (!isModalOpen) {
      setCreateLoading(false);
    }
  }, [isModalOpen]);

  const fetchData = async () => {
    try {
      const [studentsData, classroomsData] = await Promise.all([
        studentsAPI.getAll(),
        classroomsAPI.getAll()
      ]);
      setStudents(studentsData);
      setClassrooms(classroomsData);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      alert('Error fetching students: ' + error.message);
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
      classroomIds: student.classRooms?.map(cr => cr.id) || [],
      address: student.address || '',
      emergencyContact: student.emergencyContact || '',
      medicalNotes: student.medicalNotes || '',
      guardianInfo: student.user.guardianLinksAsKid?.[0]?.parent ? {
        firstName: student.user.guardianLinksAsKid[0].parent.firstName,
        lastName: student.user.guardianLinksAsKid[0].parent.lastName,
        email: student.user.guardianLinksAsKid[0].parent.email,
        phone: student.user.guardianLinksAsKid[0].parent.phone || '',
        relationship: 'Parent'
      } : initialFormState.guardianInfo
    });
    setCreateLoading(false);
    setIsModalOpen(true);
    setActiveStep(1);
    setLastStepChange(Date.now());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If user presses Enter on Step 1 or 2, just move to the next step
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
      setLastStepChange(Date.now());
      return;
    }

    // Guard against accidental double-clicks from Step 2 to Step 3
    if (Date.now() - lastStepChange < 500) {
      console.log("Submission blocked: too soon after step change");
      return;
    }

    if (createLoading) return;
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
              setCreateLoading(false);
              setIsModalOpen(true);
              setActiveStep(1);
              setLastStepChange(Date.now());
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
                        <p className="text-[10px] font-bold text-slate-400">{s.user.email}</p>
                        {s.user.guardianLinksAsKid?.[0] && (
                          <p className="text-[9px] font-black text-sky-500 uppercase tracking-tighter mt-1 flex items-center gap-1">
                            <Heart className="w-2 h-2 fill-current" /> {s.user.guardianLinksAsKid[0].parent.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-wrap gap-2">
                       {s.classRooms && s.classRooms.length > 0 ? s.classRooms.map(cr => (
                         <div key={cr.id} className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-tight border border-sky-100">
                           <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                           {cr.name}
                         </div>
                       )) : (
                         <span className="font-bold text-slate-400 text-[10px] uppercase italic">Unassigned</span>
                       )}
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

              <div className="flex-1 overflow-y-auto p-10">
                 {/* Step Indicator */}
                 <div className="flex items-center justify-between mb-12 relative px-4">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-50 -translate-y-1/2 z-0" />
                    {[1, 2, 3].map((step) => (
                      <div 
                        key={step} 
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 border-2 ${
                          activeStep >= step 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20' 
                            : 'bg-white border-slate-100 text-slate-300'
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                 </div>

                 <form id="enrollment-form" onSubmit={handleSubmit} className="space-y-12">
                    
                    {/* Step 1: Student Information */}
                    {activeStep === 1 && (
                      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                               <Baby className="w-5 h-5" />
                            </div>
                            <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 italic">Student Details</h3>
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

                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kid's Email (Unique)</label>
                            <input 
                             required type="email" 
                             className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                             value={formData.email}
                             onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                         </div>

                         <div className="grid grid-cols-2 gap-6">
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
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Birth Date</label>
                               <input 
                                type="date" 
                                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                               />
                            </div>
                         </div>
                      </div>
                    )}

                    {/* Step 2: Guardian Information */}
                    {activeStep === 2 && (
                      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
                               <Heart className="w-5 h-5" />
                            </div>
                            <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 italic">Guardian Connection</h3>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                               <input 
                                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                                value={formData.guardianInfo.firstName}
                                onChange={(e) => setFormData({...formData, guardianInfo: {...formData.guardianInfo, firstName: e.target.value}})}
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
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
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Physical Address</label>
                            <input 
                             className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all" 
                             value={formData.address}
                             onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                         </div>
                      </div>
                    )}

                    {/* Step 3: Classes & Health */}
                    {activeStep === 3 && (
                      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                         <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                                  <Sparkles className="w-5 h-5" />
                               </div>
                               <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 italic">Class Allocation</h3>
                            </div>
                            <div className="flex flex-wrap gap-2 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                               {classrooms.map(c => {
                                 const isSelected = formData.classroomIds.includes(c.id);
                                 return (
                                   <button
                                     key={c.id}
                                     type="button"
                                     onClick={() => {
                                       const newIds = isSelected 
                                         ? formData.classroomIds.filter(id => id !== c.id)
                                         : [...formData.classroomIds, c.id];
                                       setFormData({...formData, classroomIds: newIds});
                                     }}
                                     className={`px-4 py-2 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 ${
                                       isSelected 
                                         ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10 scale-105' 
                                         : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                                     }`}
                                   >
                                     {c.name}
                                   </button>
                                 );
                                })}
                                {classrooms.length === 0 && <p className="text-center text-[10px] font-bold text-slate-400 uppercase italic py-2">No classes found</p>}
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-mint-50 rounded-xl flex items-center justify-center text-mint-500">
                                  <Stethoscope className="w-5 h-5" />
                               </div>
                               <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 italic">Health & Notes</h3>
                            </div>
                            <textarea 
                             className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-sky-500 font-bold text-sm outline-none transition-all h-32" 
                             placeholder="Allergies, medical conditions, or special requirements..."
                             value={formData.medicalNotes}
                             onChange={(e) => setFormData({...formData, medicalNotes: e.target.value})}
                            />
                         </div>
                      </div>
                    )}

                 </form>
              </div>

              <div className="p-10 border-t border-slate-50 bg-slate-50/50 flex items-center gap-4">
                 {activeStep > 1 && (
                    <button 
                     type="button"
                     onClick={() => {
                       setActiveStep(activeStep - 1);
                       setLastStepChange(Date.now());
                     }}
                     className="flex-1 bg-white text-slate-900 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest border border-slate-100 hover:bg-slate-50 transition-all active:scale-[0.98]"
                    >
                       Back
                    </button>
                 )}
                 
                 {activeStep < 3 ? (
                    <button 
                     type="button"
                     onClick={() => {
                       setActiveStep(activeStep + 1);
                       setLastStepChange(Date.now());
                     }}
                     className="flex-[2] bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                    >
                       Continue
                    </button>
                 ) : (
                   <button 
                    form="enrollment-form"
                    type="submit"
                    disabled={createLoading}
                    className="flex-[2] bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                   >
                      {createLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
                      ) : (
                        <>
                          <span>{selectedStudent ? 'Save Changes' : 'Finalize Enrollment'}</span>
                          <CheckCircle2 className="w-6 h-6 text-mint-500" />
                        </>
                      )}
                   </button>
                 )}
              </div>
           </div>
        </div>
      )}
      
    </div>
  );
}
