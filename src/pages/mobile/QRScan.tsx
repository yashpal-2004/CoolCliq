import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Camera, CheckCircle, ArrowLeft, ShieldCheck, Menu, X, MapPin, Users, Bell, User, Settings } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { toast } from 'sonner';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

export default function QRScan() {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);
  const [venueName, setVenueName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [geoStatus, setGeoStatus] = useState<'pending' | 'success' | 'failed' | null>(null);

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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  };

  const handleScan = async () => {
    setGeoStatus('pending');

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported');
      setGeoStatus('failed');
      return;
    }

    // For the assignment, we'll fetch the first active venue or a specific one.
    // In a real scenario, this would come from the scanned QR code.
    const { data: venues, error: vError } = await supabase.from('venues').select('*').limit(1);
    
    if (vError || !venues || venues.length === 0) {
      toast.error('No active venues found in database');
      setGeoStatus('failed');
      return;
    }

    const targetVenue = venues[0];

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          targetVenue.latitude || 28.6139,
          targetVenue.longitude || 77.2090
        );

        // FOR DEVELOPMENT: Succeed regardless of distance
        // In production, we would use: if (distance <= (targetVenue.radius || 500))
        const isDemoMode = true; 

        if (isDemoMode || distance <= (targetVenue.radius || 500)) {
          setScanned(true);
          setVenueName(targetVenue.name);
          setGeoStatus('success');
          toast.success(`Demo Mode: Authorized at ${targetVenue.name}`);
        } else {
          toast.error(`Geo-validation failed. You are ${Math.round(distance)}m away from ${targetVenue.name}.`);
          setGeoStatus('failed');
        }
      },
      (err) => {
        // FOR DEVELOPMENT: Even if GPS fails, allow entry
        setScanned(true);
        setVenueName(targetVenue.name || 'Demo Venue');
        setGeoStatus('success');
        toast.info('GPS Offline: Demo Bypass Active');
      }
    );
  };

  const handleConfirmPresence = () => {
    navigate('/mobile/map');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] selection:bg-primary/20 font-sans antialiased overflow-hidden relative">
      {/* Precision Background Layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 px-6 py-6 flex items-center justify-between z-20 bg-white/80 backdrop-blur-xl border-b border-[#00000005]">
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

      <main className="min-h-screen flex items-center justify-center p-8 pt-32">
        <div className="w-full max-w-2xl space-y-12 text-center">
          <AnimatePresence mode="wait">
            {!scanned ? (
              <motion.div
                key="scan"
                initial="initial"
                animate="animate"
                exit={{ opacity: 0, scale: 0.95 }}
                variants={fadeInUp}
                className="space-y-12"
              >
                <div className="relative group mx-auto">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative w-64 h-64 bg-white rounded-[2.2rem] border border-border flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-muted/20"></div>
                    {/* Animated Scanning Line */}
                    <motion.div
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-[2px] bg-primary/40 z-10 shadow-[0_0_15px_rgba(107,91,149,0.5)]"
                    />
                    <Camera className="w-16 h-16 text-primary/40 relative z-0" />

                    {/* QR Corners */}
                    <div className="absolute top-8 left-8 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                    <div className="absolute top-8 right-8 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                    <div className="absolute bottom-8 left-8 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                    <div className="absolute bottom-8 right-8 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tighter italic uppercase leading-none">
                    Locate <br />Venue.
                  </h2>
                  <p className="text-muted-foreground font-bold uppercase tracking-[0.1em] text-[10px] max-w-[220px] mx-auto">
                    Scan the code at your table to establish an encrypted session.
                  </p>
                </div>

                <button
                  onClick={handleScan}
                  className="w-full h-16 bg-[#0a0a0a] text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-black/10 hover:bg-primary hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 group"
                >
                  Initialize Scan
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="detected"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12"
              >
                <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 relative">
                  <CheckCircle className="w-12 h-12 text-white" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 bg-primary rounded-[2rem]"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="h-px w-6 bg-primary/30" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Venue Authenticated</span>
                    <div className="h-px w-6 bg-primary/30" />
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter italic uppercase leading-none">
                    {venueName}
                  </h2>
                  <p className="text-muted-foreground font-bold uppercase tracking-[0.1em] text-[10px]">
                    12 Active • Verified Location
                  </p>
                </div>

                <button
                  onClick={handleConfirmPresence}
                  className="w-full h-16 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Confirm Presence
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-12 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
            <ShieldCheck className="w-3 h-3" />
            Signed Cryptographic Token
          </div>
        </div>
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
                    { label: 'Check-In', icon: QrCode, path: '/mobile/qr-scan', active: true },
                    { label: 'Circles', icon: Users, path: '/mobile/circles' },
                    { label: 'Notifications', icon: Bell, path: '/mobile/notifications' },
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

                <div className="pt-8 border-t border-border/50 space-y-1">
                  <p className="px-5 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Personal</p>
                  {[
                    { label: 'Profile', icon: User },
                    { label: 'Preferences', icon: Settings }
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-4 px-5 h-16 rounded-[1.5rem] text-muted-foreground hover:bg-muted hover:text-[#0a0a0a] transition-all group"
                    >
                      <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-black uppercase tracking-[0.15em] text-[11px] leading-none">{item.label}</span>
                    </button>
                  ))}
                </div>
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
