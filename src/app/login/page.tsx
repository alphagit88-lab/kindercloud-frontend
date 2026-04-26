'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Cloud, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  Smile, 
  Loader2,
  AlertCircle,
  Fingerprint,
  Database,
  GraduationCap,
  Heart
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (!authLoading && user) {
  //     const redirectMap: Record<string, string> = {
  //       admin: '/admin',
  //       teacher: '/teacher',
  //       parent: '/parent',
  //       kid: '/kid',
  //     };
  //     router.push(redirectMap[user.role] || '/dashboard');
  //   }
  // }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      if (user) {
        const redirectMap: Record<string, string> = {
          admin: '/admin',
          teacher: '/teacher',
          parent: '/parent',
          kid: '/kid',
        };
        router.push(redirectMap[user.role] || '/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen kinder-bg flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen kinder-bg flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/70 backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden">
        
        {/* Left Aspect: Visual Brand */}
        <div className="hidden md:flex bg-slate-900 p-16 flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 bg-linear-to-br from-sky-600/10 to-transparent" />
           <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
              <Smile className="w-96 h-96 text-white" />
           </div>

           <div className="relative z-10">
              <Link href="/" className="flex items-center gap-3 mb-12 group">
                <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <Cloud className="w-6 h-6 fill-white text-white" />
                </div>
                <span className="text-xl font-display font-black tracking-tighter text-white">KinderCloud</span>
              </Link>
              
              <h2 className="text-4xl font-display font-black text-white leading-tight mb-6">
                Connect to your <span className="text-sky-400">magic circle.</span>
              </h2>
              <p className="text-slate-400 font-bold leading-relaxed mb-10 max-w-xs">
                Access your personalized portal and continue the educational adventure.
              </p>
           </div>

           <div className="relative z-10 flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
                 <Fingerprint className="w-6 h-6 text-sky-400" />
              </div>
              <p className="text-xs font-bold text-slate-300">
                 Secure multi-tenant session management active.
              </p>
           </div>
        </div>

        {/* Right Aspect: Professional Login */}
        <div className="p-12 md:p-16 flex flex-col justify-center">
           <div className="max-w-sm mx-auto w-full space-y-10">
             <div>
                <h1 className="text-3xl font-display font-black text-slate-900 mb-2 italic">Welcome Back</h1>
                <p className="text-slate-500 font-bold">Please sign in to your professional portal.</p>
             </div>

             {error && (
               <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                 <AlertCircle className="w-5 h-5 text-rose-500" />
                 <p className="text-xs font-black text-rose-600 uppercase tracking-widest">{error}</p>
               </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                 <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="teacher@kindercloud.com"
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all font-bold text-slate-800 outline-none text-sm"
                    />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Password</label>
                 <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all font-bold text-slate-800 outline-none text-sm"
                    />
                 </div>
               </div>

               <div className="flex justify-end">
                 <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-sky-600 hover:underline">
                   Forgot Magic Word?
                 </Link>
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
                     <span>Sign In Portal</span>
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </button>
             </form>

             <div className="text-center pt-8 border-t border-slate-50 mt-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                  Experience the Portals
                </p>
                <div className="grid grid-cols-2 gap-3">
                   <button 
                    type="button"
                    onClick={() => setFormData({ email: 'admin@kindercloud.com', password: 'Kinder@123!' })}
                    className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-sky-500 hover:shadow-lg hover:shadow-sky-500/5 transition-all text-left"
                   >
                     <div className="w-8 h-8 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Database className="w-4 h-4" />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-tight text-slate-800">Admin</p>
                   </button>

                   <button 
                    type="button"
                    onClick={() => setFormData({ email: 'teacher@kindercloud.com', password: 'Kinder@123!' })}
                    className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/5 transition-all text-left"
                   >
                     <div className="w-8 h-8 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-4 h-4" />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-tight text-slate-800">Teacher</p>
                   </button>

                   <button 
                    type="button"
                    onClick={() => setFormData({ email: 'parent@kindercloud.com', password: 'Kinder@123!' })}
                    className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/5 transition-all text-left"
                   >
                     <div className="w-8 h-8 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Heart className="w-4 h-4" />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-tight text-slate-800">Parent</p>
                   </button>

                   <button 
                    type="button"
                    onClick={() => setFormData({ email: 'kid@kindercloud.com', password: 'Kinder@123!' })}
                    className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-mint-500 hover:shadow-lg hover:shadow-mint-500/5 transition-all text-left"
                   >
                     <div className="w-8 h-8 bg-mint-50 text-mint-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Smile className="w-4 h-4" />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-tight text-slate-800">Kid</p>
                   </button>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-slate-400 italic">Pass: Kinder@123!</p>
                </div>
             </div>

             <p className="text-center text-xs font-bold text-slate-400 pt-10">
               New to the system?{' '}
               <Link href="/register" className="text-sky-600 font-black hover:underline uppercase tracking-widest">
                 Create Account
               </Link>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
