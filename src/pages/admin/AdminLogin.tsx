import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ArrowLeft, Key, Mail, ChevronRight, Lock, Fingerprint, Globe, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] font-sans selection:bg-primary/20 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Professional Grid Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Header / Back Link */}
      <header className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => navigate('/')}
          className="p-3 rounded-full border border-border bg-white/50 backdrop-blur-sm hover:bg-muted transition-colors group pointer-events-auto"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-border pointer-events-auto">
          <div className="w-6 h-6 bg-[#0a0a0a] rounded-lg flex items-center justify-center font-black text-white text-[10px]">C</div>
          <span className="font-display font-bold text-sm tracking-tight">CoolCliq <span className="text-muted-foreground font-medium text-[10px] ml-1 uppercase tracking-widest">Admin</span></span>
        </div>
      </header>

      <main className="w-full max-w-lg p-8 pt-32 lg:pt-8 space-y-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#0a0a0a] rounded-2xl lg:rounded-[2rem] flex items-center justify-center mx-auto mb-6 lg:mb-8 text-white shadow-2xl shadow-black/20">
            <ShieldCheck className="w-8 h-8 lg:w-10 lg:h-10" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-display font-bold tracking-tighter leading-none text-[#0a0a0a]">Authorized <br />Personnel Only.</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Access the CoolCliq administrative ecosystem
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-border/50 rounded-[3rem] p-10 lg:p-12 shadow-2xl shadow-black/5 space-y-8"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Administrative Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0a0a0a] transition-colors" />
                <input
                  type="email"
                  placeholder="admin@coolcliq.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-16 bg-[#f9f9f9] border border-border rounded-2xl pl-14 pr-6 font-semibold tracking-tight focus:bg-white focus:border-[#0a0a0a] transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Access Credential</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0a0a0a] transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-16 bg-[#f9f9f9] border border-border rounded-2xl pl-14 pr-6 font-semibold tracking-tight focus:bg-white focus:border-[#0a0a0a] transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogin}
            disabled={!email || !password}
            className="w-full h-16 bg-[#0a0a0a] text-white font-bold uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-black/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-30 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
          >
            Authenticate Session
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-6"
        >
           <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">
              <Fingerprint className="w-4 h-4" />
              <span>Biometric Handshake Active</span>
           </div>
           
           <div className="pt-8 flex items-center gap-8 border-t border-border/50 w-full justify-center">
              <div className="flex items-center gap-2">
                 <Globe className="w-3.5 h-3.5 text-muted-foreground/30" />
                 <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">HQ: GLOBAL-01</span>
              </div>
              <div className="flex items-center gap-2">
                 <Shield className="w-3.5 h-3.5 text-muted-foreground/30" />
                 <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">TLS 1.3 Encryption</span>
              </div>
           </div>
        </motion.div>
      </main>
    </div>
  );
}
