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
      try {
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { data: venues } = await supabase.from('venues').select('name').limit(10);
        setStats({
          users: userCount || 0,
          venues: venues || []
        });
      } catch (e) {
        console.error("Failed to fetch stats", e);
      }
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
          {['Experience', 'Safety', 'Admin'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button onClick={() => navigate('/admin')} className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Admin Access</button>
          <button 
            onClick={() => navigate('/mobile/login')}
            className="px-4 md:px-6 py-2 md:py-2.5 bg-[#0a0a0a] text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-primary hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 active:scale-95"
          >
            Launch App
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
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live at {stats.venues.length || 12} locations</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl lg:text-[110px] font-black tracking-tighter leading-[0.9] md:leading-[0.85] text-[#0a0a0a]">
              Connect <br />
              <span className="text-primary italic">Without</span> <br />
              A Trace.
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              The anonymous bridge between physical presence and digital connection. Scan a code, see the vibe, chat instantly. Verified presence, zero friction.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 md:gap-8 pt-4">
              <MagneticButton 
                onClick={() => navigate('/mobile/login')}
                className="w-full sm:w-auto px-10 md:px-14 py-5 md:py-6 bg-primary text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-2xl shadow-2xl shadow-primary/20"
              >
                Scan & Connect
              </MagneticButton>
              <div className="flex -space-x-3 opacity-60 hover:opacity-100 transition-all cursor-default">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 md:w-10 h-10 rounded-full border-2 border-white bg-muted flex items-center justify-center">
                    <Users className="w-3 h-3 md:w-4 h-4 text-primary" />
                  </div>
                ))}
                <div className="flex items-center pl-6 text-[9px] md:text-[10px] font-black uppercase tracking-tighter">Verified 18+ community</div>
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
                  <div className="w-10 h-10 rounded-full bg-white/20 mr-3 flex items-center justify-center">
                    <Map className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-white">
                    <div className="text-sm font-black italic uppercase tracking-tighter">
                      {stats.venues.length > 0 ? stats.venues[0].name : 'The Beer Cafe'}
                    </div>
                    <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                      {stats.users > 0 ? `${stats.users} Active Users` : '42 Active Now'}
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-4 bg-[#fcfcfc]">
                  <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm text-[11px] font-medium max-w-[85%] border border-[#00000005]">Anyone here for the Jazz tonight?</div>
                  <div className="bg-primary text-white p-4 rounded-3xl rounded-tr-none shadow-sm text-[11px] font-bold max-w-[85%] ml-auto">Totally! Already at table #4.</div>
                  <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm text-[11px] font-medium max-w-[85%] border border-[#00000005]">The vibe is electric.</div>
                </div>
                <div className="p-4 border-t border-muted bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Anonymous Mode</span>
                    <Lock className="w-3 h-3 text-primary" />
                  </div>
                  <div className="w-full h-10 bg-muted rounded-full px-5 flex items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type message...</div>
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
              <div className="text-[14px] font-black italic tracking-tighter text-primary">Table #12</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Venue Marquee */}
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

      {/* Experience Bento Section */}
      <section id="experience" className="py-24 md:py-48 px-4 md:px-8 bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic">The Core Experience.</h2>
            <p className="text-muted-foreground font-bold tracking-widest text-[11px] uppercase">Three steps to instant connection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            {/* Bento 1: QR & Geo-validation */}
            <div className="md:col-span-8 p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-white border border-[#00000008] shadow-sm hover:shadow-2xl transition-all duration-700 group relative overflow-hidden h-auto md:h-[500px]">
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-10 transition-opacity hidden md:block">
                <QrCode className="w-96 h-96" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between space-y-8 md:space-y-0">
                <div>
                  <div className="w-12 h-12 md:w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 md:mb-12">
                    <Fingerprint className="w-6 h-6 md:w-8 h-8" />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none mb-4 md:mb-8 uppercase italic">Scan & <br />Validate.</h3>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-md leading-relaxed font-medium">
                    Scan a unique venue code to activate presence. GPS-based geo-validation ensures you're physically there. Presence auto-expires in 90 minutes.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['Phone OTP', 'Geo-Fence', 'Auto-Expiry'].map(tag => (
                    <span key={tag} className="px-4 py-1.5 rounded-full bg-muted text-[9px] font-black uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bento 2: Map Discovery */}
            <div className="md:col-span-4 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-primary text-white hover:scale-[1.02] transition-all duration-700 relative overflow-hidden flex flex-col justify-between h-auto min-h-[400px]">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 md:w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Map className="w-6 h-6 md:w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4 md:mb-6 uppercase">Vibe Radar.</h3>
                <p className="text-white/70 leading-relaxed font-bold text-base md:text-lg mb-8">
                  Interactive map view of active venues with live counts and anonymized demographic breakdowns.
                </p>
                <div className="space-y-3">
                  <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[60%] bg-white" />
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Active Counts</span>
                    <span>Live Radar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento 3: Anonymous Chat */}
            <div className="md:col-span-4 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] text-white hover:shadow-2xl transition-all duration-700 group relative overflow-hidden flex flex-col justify-between h-auto md:h-[450px] min-h-[350px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#6B5B9530,transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-12 h-12 md:w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform relative z-10">
                <MessageSquare className="w-6 h-6 md:w-7 h-7" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="h-px w-6 md:w-8 bg-primary/50" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-primary">Anonymous 1-to-1</span>
                  <div className="h-px w-6 md:w-8 bg-primary/50" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4 md:mb-6 uppercase italic">The Reveal.</h3>
                <p className="text-white/40 leading-relaxed font-bold text-sm md:text-base mb-6">
                  Start with zero identity. Mutually consent to reveal table numbers when comfortable. One tap to accept or decline.
                </p>
                <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                  <Zap className="w-3 h-3" /> Panic Exit Ready
                </div>
              </div>
            </div>

            {/* Bento 4: Safety & Trust */}
            <div className="md:col-span-8 p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-white border border-[#00000008] shadow-sm hover:shadow-2xl transition-all duration-700 relative group overflow-hidden h-auto md:h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full justify-between space-y-8 md:space-y-0">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 md:w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-primary">
                    <Shield className="w-6 h-6 md:w-8 h-8" />
                  </div>
                  <div className="px-4 py-2 bg-[#0a0a0a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">18+ Age Gate</div>
                </div>
                <div>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none mb-4 md:mb-8 italic uppercase">Trust & <br />Safety.</h3>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-lg leading-relaxed font-medium">
                    Signed QR tokens to prevent cloning, server-side validation for presence, and instant in-app reporting linked to admin moderation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Power Section */}
      <section id="admin" className="py-24 md:py-48 px-6 md:px-8 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">Admin <br />Control.</h2>
              <p className="text-muted-foreground text-xl font-medium max-w-md">Professional tools to scale the network and ensure safety.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: "Venue Core", desc: "Manage venues, set geo-radius, and view live DAU." },
                { title: "QR Engine", desc: "Generate print-ready PDF assets with signed tokens." },
                { title: "Moderation", desc: "Instant queue for reported users and chat history." },
                { title: "Analytics", desc: "CSV export for deep-dive into reveal rates and growth." }
              ].map((item, i) => (
                <div key={i} className="space-y-3 group">
                  <div className="h-px w-8 bg-primary/30 group-hover:w-12 transition-all" />
                  <h4 className="font-black text-lg uppercase tracking-tighter italic">{item.title}</h4>
                  <p className="text-muted-foreground text-sm font-bold leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-muted/50 rounded-[3rem] p-8 md:p-12 border border-[#00000005] relative overflow-hidden group">
              <div className="flex items-center justify-between mb-12">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                  <div className="w-3 h-3 rounded-full bg-green-400/20" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Admin Console v1.0</span>
              </div>
              <div className="space-y-8">
                <div className="h-4 w-2/3 bg-muted rounded-full" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-white rounded-2xl border border-[#00000005]" />
                  <div className="h-20 bg-white rounded-2xl border border-[#00000005]" />
                  <div className="h-20 bg-primary/5 rounded-2xl border border-primary/10" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-muted rounded-full" />
                  <div className="h-3 w-full bg-muted rounded-full" />
                  <div className="h-3 w-1/2 bg-muted rounded-full" />
                </div>
                <div className="flex justify-end gap-4">
                  <div className="px-6 py-3 bg-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-[#00000008]">Export CSV</div>
                  <div className="px-6 py-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">Generate QRs</div>
                </div>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 blur-[80px] -z-10 rounded-full group-hover:bg-primary/10 transition-all duration-700" />
          </div>
        </div>
      </section>

      {/* Safety - Professional Standard */}
      <section id="safety" className="py-24 md:py-48 px-6 md:px-8 relative bg-white border-t border-[#00000008]">
        <div className="max-w-4xl mx-auto text-center space-y-12 md:space-y-16">
          <h2 className="text-4xl md:text-[80px] font-black tracking-tighter text-[#0a0a0a] leading-[0.9] md:leading-[0.85] uppercase italic">
            Built for <br />The Vibe.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 pt-16 md:pt-24">
            {[
              { icon: Zap, title: "Frictionless", desc: "QR → Map → Chat in under 30 seconds." },
              { icon: Shield, title: "Zero Trace", desc: "No permanent logs. Ephemeral by design." },
              { icon: Globe, title: "Physical Hubs", desc: "Connect with people exactly where you are." }
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
              The social layer for physical venues. Connecting the physical world with digital safety.
            </p>
            <div className="flex gap-8 md:gap-12 opacity-30">
              <div className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">EST. 2026</div>
              <div className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">people@coolcliq.in</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-20">
            <div className="space-y-6 md:space-y-8">
              <h5 className="font-black text-[11px] md:text-[12px] uppercase tracking-[0.4em] text-[#0a0a0a]">Modules</h5>
              <ul className="space-y-3 md:space-y-5 text-[13px] md:text-[15px] font-black text-muted-foreground uppercase tracking-tighter">
                <li className="hover:text-primary cursor-pointer transition-colors">User Flow</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Discovery Hub</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Anon Chat</li>
              </ul>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h5 className="font-black text-[11px] md:text-[12px] uppercase tracking-[0.4em] text-[#0a0a0a]">Safety</h5>
              <ul className="space-y-3 md:space-y-5 text-[13px] md:text-[15px] font-black text-muted-foreground uppercase tracking-tighter">
                <li className="hover:text-primary cursor-pointer transition-colors">Geo-Validation</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Age Gate</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Moderation</li>
              </ul>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h5 className="font-black text-[11px] md:text-[12px] uppercase tracking-[0.4em] text-[#0a0a0a]">Admin</h5>
              <ul className="space-y-3 md:space-y-5 text-[13px] md:text-[15px] font-black text-muted-foreground uppercase tracking-tighter">
                <li className="hover:text-primary cursor-pointer transition-colors">Venue Mgmt</li>
                <li className="hover:text-primary cursor-pointer transition-colors">QR Assets</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
