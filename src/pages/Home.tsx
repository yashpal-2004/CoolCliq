import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { 
  Shield, 
  QrCode, 
  Map, 
  MessageSquare, 
  Users, 
  Lock, 
  ChevronRight, 
  Globe,
  Fingerprint,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { useState, useEffect } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

// Magnetic Button Component
const MagneticButton = ({ children, onClick, className = "" }: { children: React.ReactNode, onClick?: () => void, className?: string }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.4);
    mouseY.set((e.clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x, y }}
      className={`relative group ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, venues: [] as any[] });

  useEffect(() => {
    const fetchHomeData = async () => {
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { data: venues } = await supabase.from('venues').select('name').limit(10);
      setStats({
        users: userCount || 0,
        venues: venues || []
      });
    };
    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a] selection:bg-primary/20 font-sans antialiased overflow-x-hidden">
      {/* Precision Background Layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/[0.04] blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/[0.06] blur-[140px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 md:py-6 flex items-center justify-between backdrop-blur-xl bg-white/60 border-b border-[#00000008]">
        <div className="flex items-center gap-2 md:gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 md:w-9 h-9 bg-primary rounded-xl flex items-center justify-center font-bold text-lg md:text-xl text-white shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform duration-300">C</div>
          <span className="font-bold text-lg md:text-2xl tracking-tighter uppercase">CoolCliq</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          {['Features', 'Security', 'Business'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button onClick={() => navigate('/admin/login')} className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Log in</button>
          <button 
            onClick={() => navigate('/mobile/login')}
            className="px-4 md:px-6 py-2 md:py-2.5 bg-[#0a0a0a] text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-primary hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 active:scale-95"
          >
            Launch
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 md:pt-60 pb-20 md:pb-40 px-6">
        <motion.div 
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="text-center lg:text-left space-y-8 md:space-y-10">
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl lg:text-[110px] font-black tracking-tighter leading-[0.9] md:leading-[0.85] text-[#0a0a0a]">
              Connect <br />
              <span className="text-primary italic">Without</span> <br />
              A Trace.
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Join the anonymous bridge between physical presence and digital connection. Scan a code, see the vibe, chat instantly. 
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 md:gap-8 pt-4">
              <MagneticButton 
                onClick={() => navigate('/mobile/login')}
                className="w-full sm:w-auto px-10 md:px-14 py-5 md:py-6 bg-primary text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-2xl shadow-2xl shadow-primary/20"
              >
                Start Session
              </MagneticButton>
              <div className="flex -space-x-3 opacity-60 hover:opacity-100 transition-all cursor-default">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 md:w-10 h-10 rounded-full border-2 border-white bg-muted flex items-center justify-center">
                    <Users className="w-3 h-3 md:w-4 h-4 text-primary" />
                  </div>
                ))}
                <div className="flex items-center pl-6 text-[9px] md:text-[10px] font-black uppercase tracking-tighter">Verified presence only</div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Product Mockup */}
          <motion.div 
            variants={fadeInUp}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full -z-10" />
            <div className="w-[320px] h-[640px] bg-[#0a0a0a] rounded-[3.5rem] p-3 shadow-[0_0_80px_rgba(0,0,0,0.1)] relative border-[1px] border-white/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#0a0a0a] rounded-b-2xl z-10" />
              <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden flex flex-col">
                <div className="h-24 bg-primary p-6 flex items-end">
                  <div className="w-10 h-10 rounded-full bg-white/20 mr-3" />
                  <div className="text-white">
                    <div className="text-sm font-black italic uppercase tracking-tighter">
                      {stats.venues.length > 0 ? stats.venues[0].name : 'Haveli Sonipat'}
                    </div>
                    <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                      {stats.users > 0 ? `${stats.users} Active Users` : '35 Active Users'}
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-4 bg-[#fcfcfc]">
                  <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm text-[11px] font-medium max-w-[85%] border border-[#00000005]">Anyone here for the Jazz tonight?</div>
                  <div className="bg-primary text-white p-4 rounded-3xl rounded-tr-none shadow-sm text-[11px] font-bold max-w-[85%] ml-auto">Totally! Already at table #4.</div>
                  <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm text-[11px] font-medium max-w-[85%] border border-[#00000005]">The vibe is electric.</div>
                </div>
                <div className="p-4 border-t border-muted bg-white">
                  <div className="w-full h-10 bg-muted rounded-full px-5 flex items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type anonymously...</div>
                </div>
              </div>
            </div>
            
            {/* Float Cards */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-16 top-24 p-6 rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border/50 max-w-[200px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_#6B5B95]" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Live Radar</span>
              </div>
              <p className="text-[13px] text-muted-foreground font-bold leading-tight">6 Females, 4 Males active in your radius.</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-12 bottom-20 p-6 rounded-3xl bg-[#0a0a0a] text-white shadow-2xl max-w-[180px]"
            >
              <QrCode className="w-8 h-8 text-primary mb-3" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Authenticated</div>
              <div className="text-[14px] font-black italic tracking-tighter">Table #12</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Dynamic Full-Width Marquee */}
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mt-20 md:mt-40 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen"
        >
          <div className="overflow-hidden py-10 md:py-16 bg-[#0a0a0a] border-y border-white/5">
            <motion.div 
              className="flex gap-12 md:gap-24 items-center whitespace-nowrap w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-12 md:gap-24 items-center px-6 md:px-12">
                  {[
                    { name: 'Haveli Sonipat' },
                    { name: 'Amrik Sukhdev' },
                    { name: '7th Heaven' },
                    { name: 'Gulshan Dhaba' },
                    { name: 'The Beer Cafe' },
                    { name: 'Coffee Bean' },
                    { name: 'Brew House' }
                  ].map((venue, idx) => (
                    <div key={idx} className="flex items-center gap-3 md:gap-4 text-white/20 hover:text-white transition-colors cursor-default">
                      <Globe className="w-5 h-5 md:w-7 h-7 text-primary" />
                      <span className="font-black text-xl md:text-3xl tracking-tighter uppercase italic">{venue.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* Features - Bento Box Layout */}
      <section id="features" className="py-24 md:py-48 px-4 md:px-8 bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            {/* Bento 1: Main Feature */}
            <div className="md:col-span-8 p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-white border border-[#00000008] shadow-sm hover:shadow-2xl transition-all duration-700 group relative overflow-hidden h-auto md:h-[500px]">
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-10 transition-opacity hidden md:block">
                <QrCode className="w-96 h-96" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between space-y-8 md:space-y-0">
                <div>
                  <div className="w-12 h-12 md:w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 md:mb-12">
                    <QrCode className="w-6 h-6 md:w-8 h-8" />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none mb-4 md:mb-8 uppercase italic">Atomic <br />Check-in.</h3>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-md leading-relaxed font-medium">
                    Verified location without a permanent trace. Our signed tokens ensure you're there, but never store where you've been.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-primary group-hover:gap-8 transition-all cursor-pointer">
                  Technical Standard <ArrowUpRight className="w-4 h-4 md:w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Bento 2: Contrast Feature */}
            <div className="md:col-span-4 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-primary text-white hover:scale-[1.02] transition-all duration-700 relative overflow-hidden flex flex-col justify-between h-auto min-h-[300px]">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 md:w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Map className="w-6 h-6 md:w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4 md:mb-6 uppercase">Vibe Radar.</h3>
                <p className="text-white/70 leading-relaxed font-bold text-base md:text-lg">
                  See the room before you enter. Live active counts and demographic trends, updated every second.
                </p>
              </div>
            </div>

            {/* Bento 3: Ephemeral Bridge */}
            <div className="md:col-span-4 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] text-white hover:shadow-2xl transition-all duration-700 group relative overflow-hidden flex flex-col justify-between h-auto md:h-[450px] min-h-[350px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#6B5B9530,transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-12 h-12 md:w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform relative z-10">
                <MessageSquare className="w-6 h-6 md:w-7 h-7" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="h-px w-6 md:w-8 bg-primary/50" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-primary">Secure Tunnel</span>
                  <div className="h-px w-6 md:w-8 bg-primary/50" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4 md:mb-6 uppercase italic">Ephemeral <br />Bridge.</h3>
                <p className="text-white/40 leading-relaxed font-bold text-sm md:text-base">
                  Messages are end-to-end encrypted and wiped from existence after every session. No logs, no history, just the moment.
                </p>
              </div>
            </div>

            {/* Bento 4: Safety Focus */}
            <div className="md:col-span-8 p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-white border border-[#00000008] shadow-sm hover:shadow-2xl transition-all duration-700 relative group overflow-hidden h-auto md:h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full justify-between space-y-8 md:space-y-0">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 md:w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-primary">
                    <Shield className="w-6 h-6 md:w-8 h-8" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none mb-4 md:mb-8">Zero Data. <br />Maximum Flow.</h3>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-lg leading-relaxed font-medium">
                    No phone numbers. No emails. We don't hide your data because we never collect it. Built on a privacy-first infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security - Professional Standard */}
      <section id="security" className="py-24 md:py-48 px-6 md:px-8 relative bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-12 md:space-y-16">
          <h2 className="text-4xl md:text-[80px] font-black tracking-tighter text-[#0a0a0a] leading-[0.9] md:leading-[0.85] uppercase italic">
            Security by <br />Architecture.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 pt-16 md:pt-24">
            {[
              { icon: Fingerprint, title: "Zero Trace", desc: "No permanent identifiers. Every session is a fresh start." },
              { icon: Shield, title: "Hardened", desc: "Server-side cryptographic validation for every check-in." },
              { icon: Zap, title: "Panic Exit", desc: "One tap to instantly purge all presence and history." }
            ].map((item, i) => (
              <div key={i} className="space-y-6 md:space-y-8 text-center group">
                <div className="w-16 h-16 md:w-20 h-20 bg-primary/5 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-primary mx-auto group-hover:bg-primary group-hover:text-white transition-all duration-700 group-hover:rotate-12">
                  <item.icon className="w-8 h-8 md:w-10 h-10" />
                </div>
                <h4 className="font-black text-xl md:text-2xl tracking-tight italic uppercase">{item.title}</h4>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-bold">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 md:py-40 px-6 md:px-12 border-t border-[#00000008] bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 md:gap-32">
          <div className="space-y-8 md:space-y-12 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 h-12 bg-[#0a0a0a] rounded-2xl flex items-center justify-center font-black text-white text-xl md:text-2xl shadow-2xl">C</div>
              <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase italic">CoolCliq</span>
            </div>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-bold">
              Connecting the physical world with digital safety. Built for the privacy-first generation.
            </p>
            <div className="flex gap-8 md:gap-12 opacity-30">
              <div className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">EST. 2026</div>
              <div className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">LDN • BOM • NYC</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-20">
            <div className="space-y-6 md:space-y-8">
              <h5 className="font-black text-[11px] md:text-[12px] uppercase tracking-[0.4em] text-[#0a0a0a]">Infrastructure</h5>
              <ul className="space-y-3 md:space-y-5 text-[13px] md:text-[15px] font-black text-muted-foreground uppercase tracking-tighter">
                <li className="hover:text-primary cursor-pointer transition-colors">Mobile Hub</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Venue Core</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Safety API</li>
              </ul>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h5 className="font-black text-[11px] md:text-[12px] uppercase tracking-[0.4em] text-[#0a0a0a]">Governance</h5>
              <ul className="space-y-3 md:space-y-5 text-[13px] md:text-[15px] font-black text-muted-foreground uppercase tracking-tighter">
                <li className="hover:text-primary cursor-pointer transition-colors">Privacy First</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Legal Terms</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Guidelines</li>
              </ul>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h5 className="font-black text-[11px] md:text-[12px] uppercase tracking-[0.4em] text-[#0a0a0a]">Network</h5>
              <ul className="space-y-3 md:space-y-5 text-[13px] md:text-[15px] font-black text-muted-foreground uppercase tracking-tighter">
                <li className="hover:text-primary cursor-pointer transition-colors">Partner Program</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Support Lab</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Live Status</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
