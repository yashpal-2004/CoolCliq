import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, QrCode, MapPin, Users, Menu, X, User, Settings
} from 'lucide-react';

export default function Notifications() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lock scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] font-sans selection:bg-primary/20 antialiased overflow-hidden relative">
      {/* Precision Background Layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 bg-white/80 backdrop-blur-xl border-b border-[#00000005] flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-white shadow-sm hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center font-black text-white text-sm shadow-lg shadow-primary/20">C</div>
          <span className="font-black text-lg tracking-tighter uppercase italic">CoolCliq</span>
        </div>
      </nav>

      {/* Centered Minimalist Content */}
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md flex flex-col items-center justify-center space-y-12"
        >
          <div className="space-y-6 flex flex-col items-center">
            <h1 className="text-[10px] font-black tracking-[0.4em] uppercase italic text-primary text-center px-4 animate-pulse">
              Signal Intelligence: System Sync Active
            </h1>
            <div className="w-12 h-px bg-primary/20" />
          </div>
          
          <button 
            onClick={() => navigate('/mobile/map')}
            className="w-full max-w-xs h-16 bg-[#0a0a0a] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary transition-all shadow-2xl shadow-black/10 active:scale-[0.98]"
          >
            Return to Discovery
          </button>
        </motion.div>
      </main>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-[70] p-8 flex flex-col justify-between shadow-2xl overflow-y-auto no-scrollbar"
            >
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-primary/20">C</div>
                    <span className="font-black text-xl tracking-tighter uppercase italic text-[#0a0a0a]">CoolCliq</span>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {[
                    { label: 'Discovery', icon: MapPin, path: '/mobile/map' },
                    { label: 'Check-In', icon: QrCode, path: '/mobile/qr-scan' },
                    { label: 'Circles', icon: Users, path: '/mobile/circles' },
                    { label: 'Notifications', icon: Bell, path: '/mobile/notifications', active: true },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center gap-4 px-5 h-16 rounded-[1.5rem] transition-all group ${item.active
                          ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                          : 'text-muted-foreground hover:bg-muted hover:text-[#0a0a0a]'
                        }`}
                    >
                      <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                      <span className="font-black uppercase tracking-[0.15em] text-[11px] leading-none">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-8 bg-[#f9f9f9] border border-border/50 rounded-[2.5rem] space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-primary shadow-inner">DG</div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-black uppercase tracking-tight italic">Divyanshu Gupta</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="w-full h-14 bg-[#0a0a0a] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
                >
                  End Session
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
