'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Cloud, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Smile, 
  Heart, 
  GraduationCap, 
  Home, 
  ToyBrick,
  Loader2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const ROLES = [
  { id: 'parent', label: 'Parent', icon: Home, color: 'rose', accent: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'teacher', label: 'Teacher', icon: GraduationCap, color: 'amber', accent: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'kid', label: 'Kid', icon: ToyBrick, color: 'sky', accent: 'text-sky-500', bg: 'bg-sky-50' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'parent' as 'parent' | 'teacher' | 'kid',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(formData as any);
      const redirectMap: Record<string, string> = {
        teacher: '/teacher',
        parent: '/parent',
        kid: '/kid',
      };
      router.push(redirectMap[user.role] || '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectRole = (role: typeof formData.role) => {
    setFormData({ ...formData, role });
  };

  return (
    <div className="min-h-screen kinder-bg flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-white/70 backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden relative">
        
        {/* Left Side: Branding & Trust */}
        <div className="lg:col-span-5 bg-slate-900 p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
              <Cloud className="w-96 h-96 text-white" />
           </div>
           
           <div className="relative z-10">
              <Link href="/" className="flex items-center gap-3 mb-12 group">
                <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:rotate-12 transition-transform">
                  <Cloud className="w-7 h-7 fill-white text-white" />
                </div>
                <span className="text-2xl font-display font-black tracking-tighter">KinderCloud</span>
              </Link>
              
              <h2 className="text-4xl lg:text-5xl font-display font-black leading-[1.1] mb-8">
                Start your <span className="text-sky-400 underline decoration-sky-400/20 underline-offset-8">educational journey</span> with us today.
              </h2>
              
              <div className="space-y-6">
                {[
                  { icon: ShieldCheck, text: "Strict data privacy protocols", sub: "Enterprise-grade security for your children." },
                  { icon: Sparkles, text: "Real-time synchronization", sub: "Parents and teachers stay perfectly aligned." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-sky-500/10 transition-colors">
                      <item.icon className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-100">{item.text}</p>
                      <p className="text-sm text-slate-400 font-medium">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="relative z-10 pt-12 mt-12 border-t border-white/10">
              <p className="text-slate-500 font-bold text-sm italic">
                "The most comprehensive platform for pre-schools we've ever used."
              </p>
           </div>
        </div>

        {/* Right Side: Professional Form */}
        <div className="lg:col-span-7 p-12 lg:p-16">
          <div className="max-w-md mx-auto space-y-10">
            <div>
              <h1 className="text-3xl font-display font-black text-slate-900 mb-2 italic">Create Account</h1>
              <p className="text-slate-500 font-bold">Please select your role and fill in your details.</p>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <p className="text-xs font-black text-rose-600 uppercase tracking-widest leading-none">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Professional Role Selection */}
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Identity</label>
                 <div className="grid grid-cols-3 gap-3">
                    {ROLES.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => selectRole(role.id as any)}
                        className={`group relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                          formData.role === role.id 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10' 
                            : 'bg-white border-slate-100 hover:border-slate-300 text-slate-500'
                        }`}
                      >
                         <role.icon className={`w-5 h-5 ${formData.role === role.id ? 'text-white' : role.accent}`} />
                         <span className="font-black text-[10px] uppercase tracking-widest">{role.label}</span>
                         {formData.role === role.id && (
                            <div className="absolute -top-1.5 -right-1.5 bg-sky-500 rounded-full p-1 shadow-md border-2 border-white">
                               <Sparkles className="w-2 h-2 text-white fill-white" />
                            </div>
                         )}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">First Name</label>
                  <input
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="E.g. Sarah"
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all font-bold text-slate-800 outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Last Name</label>
                  <input
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="E.g. Jenkins"
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all font-bold text-slate-800 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@kindercloud.com"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all font-bold text-slate-800 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Secure Password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all font-bold text-slate-800 outline-none text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <p className="text-xs font-bold text-slate-400">
                  Already have a professional account?{' '}
                  <Link href="/login" className="text-sky-600 font-black hover:underline uppercase tracking-widest">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
