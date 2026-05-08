import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Users, Filter, ArrowLeft, Search, Navigation, Star, QrCode, Menu, X, Bell, User, Settings } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface Venue {
  id: string;
  name: string;
  distance: string;
  activeUsers: number;
  type: string;
  rating: number;
}

export default function MapDiscovery() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
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

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenuesList = async () => {
      const { data, error } = await supabase.from('venues').select('*').limit(10);
      if (data) {
        setVenues(data.map((v: any) => ({
          id: v.id,
          name: v.name,
          distance: `${(Math.random() * 2).toFixed(1)} km`,
          activeUsers: v.active_users || 0,
          type: 'Premium Venue',
          rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1))
        })));
      }
      setLoading(false);
    };
    fetchVenuesList();
  }, []);

  // Map Initialization
  useEffect(() => {
    let map: any = null;

    const initMap = () => {
      const L = (window as any).L;
      if (!L) {
        setTimeout(initMap, 100);
        return;
      }

      const mapContainer = document.getElementById('map');
      if (!mapContainer || (mapContainer as any)._leaflet_id) return;

      map = L.map('map', {
        zoomControl: false,
        attributionControl: false
      }).setView([28.9931, 77.0151], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Fetch Live Venues from Supabase
      const fetchVenues = async () => {
        const { data: dbVenues, error } = await supabase.from('venues').select('*');

        const venuesToDisplay = (dbVenues && dbVenues.length > 0)
          ? dbVenues.map((v: { id: string, name: string, latitude: number, longitude: number }) => ({
            id: v.id,
            name: v.name,
            coords: [v.latitude, v.longitude]
          }))
          : [
            { id: '1', name: 'DIGGIN', coords: [28.5916, 77.1906] },
            { id: '2', name: 'BLUE TOKAI', coords: [28.5147, 77.1989] },
            { id: '3', name: 'HKV SOCIAL', coords: [28.5542, 77.1944] },
            { id: '4', name: 'FARZI CAFE', coords: [28.6328, 77.2195] }
          ];

        venuesToDisplay.forEach((v: { id: string; name: string; coords: [number, number] | number[] }) => {
          const markerIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="w-8 h-8 bg-white rounded-full shadow-2xl border border-primary/20 flex items-center justify-center">
                      <div class="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });
          L.marker(v.coords, { icon: markerIcon }).addTo(map)
            .on('click', () => navigate(`/mobile/venue/${v.id}`));
        });
      };

      fetchVenues();
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] font-sans selection:bg-primary/20 overflow-x-hidden">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 bg-white/80 backdrop-blur-xl border-b border-[#00000005] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Discovery</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center shadow-lg shadow-black/10">
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Actual Map Visual */}
      <div className="pt-24 h-[40vh] relative overflow-hidden z-0 bg-muted/20">
        <div id="map" className="absolute inset-0 z-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcfcfc] via-transparent to-transparent pointer-events-none z-10" />
      </div>

      {/* Main Content */}
      <main className="px-6 -mt-8 relative z-10 pb-20">
        {/* Search & Filter */}
        <div className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search active venues..."
              className="w-full h-16 bg-white border border-border rounded-2xl pl-16 pr-6 font-bold tracking-tight shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Trending', 'Nearby', 'Bar', 'Cafe'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeFilter === filter
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white border border-border text-muted-foreground hover:border-primary/50'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Venue List */}
        <div className="mt-10 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black tracking-tighter italic uppercase">Local Radar</h2>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-3 py-1 rounded-full">{venues.length} Nearby</span>
          </div>

          <div className="space-y-4">
            {venues.map((venue, idx) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                onClick={() => navigate(`/mobile/venue/${venue.id}`)}
                className="group relative p-6 bg-white border border-border rounded-[2rem] hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-primary/5 text-[9px] font-black text-primary uppercase tracking-widest">{venue.type}</span>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        {venue.rating}
                      </div>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight uppercase italic">{venue.name}</h3>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-tight">
                        <Navigation className="w-3 h-3" />
                        {venue.distance}
                      </div>
                      <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-tight">
                        <Users className="w-3 h-3" />
                        {venue.activeUsers} Live
                      </div>
                    </div>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-[#0a0a0a] text-white flex items-center justify-center group-hover:bg-primary transition-colors shadow-xl">
                    <ArrowLeft className="w-6 h-6 rotate-180" />
                  </div>
                </div>
              </motion.div>
            ))}
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
                    { label: 'Discovery', icon: MapPin, path: '/mobile/map', active: true },
                    { label: 'Check-In', icon: QrCode, path: '/mobile/qr-scan' },
                    { label: 'Circles', icon: Users, path: '/mobile/users' },
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
                    { label: 'Profile', icon: User, path: '/mobile/profile-setup' },
                    { label: 'Preferences', icon: Settings, path: '/mobile/settings' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { if (item.path) { navigate(item.path); setIsSidebarOpen(false); } }}
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
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Premium Member</p>
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
