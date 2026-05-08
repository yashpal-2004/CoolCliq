import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, ArrowLeft, ShieldCheck, ChevronRight } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsConfirmed, setTermsConfirmed] = useState(false);

  const handleSendOTP = () => {
    if (phone.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      navigate('/mobile/profile-setup');
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a] selection:bg-primary/20 font-sans antialiased overflow-hidden relative">
      {/* Precision Background Layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/[0.05] blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Header */}
      <nav className="absolute top-0 left-0 right-0 px-6 py-6 md:px-8 md:py-8 flex items-center justify-between z-20">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-white/50 backdrop-blur-sm hover:bg-muted transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center font-black text-white text-sm shadow-lg shadow-primary/20">C</div>
          <span className="font-black text-lg tracking-tighter uppercase italic">CoolCliq</span>
        </div>
      </nav>

      <main className="min-h-screen flex items-center justify-center p-8 pt-40">
        <div className="w-full max-w-sm space-y-12">
          <motion.div 
            className="text-center space-y-4"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary shadow-2xl shadow-primary/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Smartphone className="w-8 h-8 relative z-10" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter italic uppercase leading-none">
              Welcome <br />Back.
            </h1>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.1em] text-[10px]">
              Anonymous Authentication • Secure Bridge
            </p>
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              {!otpSent ? (
                <motion.div 
                  key="phone"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="+91 00000 00000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-14 bg-white border border-border rounded-2xl px-6 font-bold tracking-tight focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 px-1">
                      <div className="relative flex items-center h-5">
                        <input
                          id="age-gate"
                          type="checkbox"
                          checked={ageConfirmed}
                          onChange={(e) => setAgeConfirmed(e.target.checked)}
                          className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                        />
                      </div>
                      <label htmlFor="age-gate" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-tight cursor-pointer">
                        I confirm I am <span className="text-[#0a0a0a]">18 years of age</span> or older.
                      </label>
                    </div>

                    <div className="flex items-start gap-3 px-1">
                      <div className="relative flex items-center h-5">
                        <input
                          id="terms-gate"
                          type="checkbox"
                          checked={termsConfirmed}
                          onChange={(e) => setTermsConfirmed(e.target.checked)}
                          className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                        />
                      </div>
                      <label htmlFor="terms-gate" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-tight cursor-pointer">
                        I accept the <span className="text-primary underline">Terms of Service</span> and Privacy Protocol.
                      </label>
                    </div>
                  </div>

                  <button 
                    onClick={handleSendOTP}
                    disabled={phone.length < 10 || !ageConfirmed || !termsConfirmed}
                    className="w-full h-16 bg-[#0a0a0a] text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-black/10 hover:bg-primary hover:shadow-primary/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Request Access
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="otp"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Code sent to <span className="text-foreground">{phone}</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Verification Code</label>
                    <input
                      type="text"
                      placeholder="000 000"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full h-14 bg-white border border-border rounded-2xl px-6 text-center font-black tracking-[0.5em] text-xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleVerifyOTP}
                    disabled={otp.length !== 6}
                    className="w-full h-16 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Verify Identity
                  </button>
                  <button
                    onClick={() => setOtpSent(false)}
                    className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  >
                    Resend or Change Number
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-12 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40"
          >
            <ShieldCheck className="w-3 h-3" />
            Zero-Log Authentication Enabled
          </motion.div>
        </div>
      </main>
    </div>
  );
}
