'use client';

import Link from 'next/link';
import { 
  Cloud, 
  Sparkles, 
  ArrowRight, 
  Smile, 
  Users, 
  BookOpen, 
  Layout, 
  Zap, 
  Heart,
  Star,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Presentation,
  Gamepad2
} from 'lucide-react';

const PORTALS = [
  {
    title: 'Teacher Portal',
    desc: 'Empower educators with daily planning, lesson tracking, and parent communication.',
    icon: Presentation,
    color: 'amber',
    bg: 'bg-amber-50',
    accent: 'text-amber-500',
    link: '/teacher'
  },
  {
    title: 'Parent Portal',
    desc: 'Peace of mind with real-time updates, activity feeds, and secure messaging.',
    icon: Heart,
    color: 'rose',
    bg: 'bg-rose-50',
    accent: 'text-rose-500',
    link: '/parent'
  },
  {
    title: 'Admin Dashboard',
    desc: 'Total management of students, teachers, assets, and finance operations.',
    icon: Layout,
    color: 'sky',
    bg: 'bg-sky-50',
    accent: 'text-sky-500',
    link: '/admin'
  },
  {
    title: 'Kid Sandbox',
    desc: 'A playful digital workspace for little ones to explore their preschool creations.',
    icon: Gamepad2,
    color: 'mint',
    bg: 'bg-mint-50',
    accent: 'text-mint-500',
    link: '/kid'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-linear-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:rotate-12 transition-transform">
              <Cloud className="w-6 h-6 fill-white" />
            </div>
            <span className="text-2xl font-display font-black text-slate-800 tracking-tighter">
              Kinder<span className="text-sky-500">Cloud</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-sky-500 transition-colors">Features</Link>
            <Link href="#portals" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-sky-500 transition-colors">Portals</Link>
            <div className="flex items-center gap-4 border-l border-slate-200 pl-8 ml-4">
               <Link href="/login" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Login</Link>
               <Link href="/register" className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest transition shadow-lg shadow-sky-500/30 active:scale-95">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-sky-50/50 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-sky-100 border border-sky-200 rounded-full text-sky-600 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
             <Sparkles className="w-4 h-4" />
             <span className="text-xs font-black uppercase tracking-widest italic">The Future of Preschool Management</span>
          </div>
          
          <h1 className="text-6xl sm:text-8xl font-display font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
            Magic <span className="text-rose-500">Happens</span> in the <span className="text-sky-500 underline decoration-sky-100 underline-offset-8">Cloud.</span>
          </h1>
          
          <p className="text-xl sm:text-2xl font-bold text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
            The all-in-one preschool ecosystem connecting teachers, parents, and administrative wizards in one magical place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/register" 
              className="w-full sm:w-auto bg-linear-to-r from-sky-500 to-blue-600 text-white px-10 py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-sky-500/40 hover:shadow-sky-500/60 hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center justify-center gap-3 group"
            >
              Start for Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-10 py-6 text-slate-500 font-black text-lg uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2">
               Watch the Demo <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            </button>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 right-10 animate-bounce opacity-20">
           <Star className="w-20 h-20 text-amber-400 fill-amber-300" />
        </div>
        <div className="absolute left-10 bottom-1/4 animate-pulse opacity-10">
           <Smile className="w-32 h-32 text-rose-400" />
        </div>
      </section>

      {/* Portals Grid */}
      <section id="portals" className="py-32 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-display font-black text-slate-900 tracking-tight mb-4 italic">One Platform, Four Portals</h2>
            <p className="font-bold text-slate-500 max-w-md mx-auto">Tailored experiences for every member of your preschool community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PORTALS.map((portal, idx) => (
              <div 
                key={idx} 
                className={`${portal.bg} p-8 rounded-[3rem] border border-white dark:border-neutral-800 shadow-xl shadow-slate-200/50 hover:scale-[1.03] transition-all group cursor-pointer`}
              >
                <div className={`w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-8 group-hover:rotate-12 transition-transform`}>
                   <portal.icon className={`w-8 h-8 ${portal.accent}`} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{portal.title}</h3>
                <p className="text-slate-500 font-bold mb-8 leading-relaxed italic">{portal.desc}</p>
                <Link href={portal.link} className={`inline-flex items-center gap-2 font-black uppercase text-[10px] tracking-widest ${portal.accent} hover:underline`}>
                   Enter Portal <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
           <div className="w-16 h-1 w-24 bg-sky-500 mx-auto mb-12 rounded-full" />
           <p className="text-3xl sm:text-5xl font-display font-black text-slate-900 leading-[1.1] italic mb-12 tracking-tight">
             "KinderCloud has transformed our daily routine. Teachers are less stressed, parents are more connected, and our admin wizardry is peaking!"
           </p>
           <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center font-black text-rose-500">M</div>
              <div className="text-left">
                 <div className="font-black text-slate-900 uppercase tracking-widest text-xs">Maria Garcia</div>
                 <div className="text-xs font-bold text-slate-400 italic">Director at Little Stars Academy</div>
              </div>
           </div>
        </div>
      </section>

      {/* Stats/Features Banner */}
      <section id="features" className="py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
           {[
             { label: 'Cloud Users', value: '25,000+', icon: Users },
             { label: 'Lessons Logged', value: '1.2M+', icon: BookOpen },
             { label: 'Happy Parents', value: '98%', icon: Smile },
             { label: 'Total Security', value: '100%', icon: CheckCircle2 }
           ].map((stat, idx) => (
             <div key={idx} className="space-y-2 group">
                <stat.icon className="w-6 h-6 mx-auto text-slate-300 group-hover:text-sky-500 transition-colors mb-4" />
                <div className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-display font-black tracking-tighter">KinderCloud</span>
            </div>
            <p className="text-slate-400 font-bold leading-relaxed">
              Elevating the preschool experience through collaborative technology and magical design.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-xs text-sky-500">Product</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
              <li><Link href="#portals" className="hover:text-white transition">Portal Access</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-xs text-rose-500">Community</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              <li><Link href="/blog" className="hover:text-white transition">Teacher Stories</Link></li>
              <li><Link href="/help" className="hover:text-white transition">Safety Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-xs text-amber-500">Newsletter</h4>
            <p className="text-sm font-bold text-slate-400">Join 5,000+ educators for weekly magic updates.</p>
            <div className="flex bg-white/10 rounded-xl p-1">
               <input type="text" placeholder="Email address" className="bg-transparent border-none focus:ring-0 text-sm flex-1 px-4 font-bold" />
               <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-widest">Join</button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-500">&copy; 2026 KinderCloud. All rights reserved. Designed with magic & hearts.</p>
          <div className="flex gap-8">
            <Link href="/terms" className="text-xs font-bold text-slate-500 hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="text-xs font-bold text-slate-500 hover:text-white transition">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
