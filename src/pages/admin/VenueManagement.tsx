import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Store, ShieldAlert, Users, LogOut, 
  Plus, Edit, Trash2, QrCode, MapPin, Search, Bell, 
  ChevronRight, Filter, MoreVertical, Activity, Menu, X,
  Map as MapIcon, Signal, Globe
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { toast } from 'sonner';

interface Venue {
  id: string;
  name: string;
  address: string;
  radius: number;
  status: 'active' | 'inactive';
  activeUsers: number;
  lastSync: string;
}

export default function VenueManagement() {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
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

  // Fetch Venues from Supabase
  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase.from('venues').select('*');
      if (error) console.error('Error fetching venues:', error);
      if (data) {
        setVenues(data.map((v: any) => ({
          id: v.id,
          name: v.name,
          address: v.address || 'Location Pending',
          radius: v.radius || 50,
          status: v.status || 'active',
          activeUsers: v.active_users || 0,
          lastSync: v.last_sync || 'Just now'
        })));
      }
      setLoading(false);
    };
    fetchVenues();
  }, []);

  const [newVenue, setNewVenue] = useState({ 
    name: '', 
    address: '', 
    radius: 50,
    latitude: 28.9931,
    longitude: 77.0151,
    category: 'Premium Lounge',
    imageUrl: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddVenue = async () => {
    if (newVenue.name && newVenue.address) {
      const tempId = Date.now().toString();
      const venueData = {
        name: newVenue.name,
        address: newVenue.address,
        radius: newVenue.radius,
        latitude: newVenue.latitude,
        longitude: newVenue.longitude,
        category: newVenue.category,
        imageUrl: newVenue.imageUrl,
        status: 'active' as const,
        activeUsers: 0,
        lastSync: 'Just now'
      };

      // Optimistic Update
      if (!editingId) {
        setVenues(prev => [...prev, { id: tempId, ...venueData }]);
      } else {
        setVenues(prev => prev.map(v => v.id === editingId ? { ...v, ...venueData } : v));
      }

      setShowAddForm(false);
      setNewVenue({ 
        name: '', 
        address: '', 
        radius: 50, 
        latitude: 28.9931, 
        longitude: 77.0151,
        category: 'Premium Lounge',
        imageUrl: ''
      });

      try {
        if (editingId) {
          const { error } = await supabase
            .from('venues')
            .update({
              name: venueData.name,
              address: venueData.address,
              radius: venueData.radius,
              latitude: venueData.latitude,
              longitude: venueData.longitude,
              category: venueData.category,
              image_url: venueData.imageUrl
            })
            .eq('id', editingId);
          
          if (error) throw error;
          toast.success('Venue infrastructure updated');
          setEditingId(null);
        } else {
          const { data, error } = await supabase
            .from('venues')
            .insert([{
              name: venueData.name,
              address: venueData.address,
              radius: venueData.radius,
              latitude: venueData.latitude,
              longitude: venueData.longitude,
              category: venueData.category,
              image_url: venueData.imageUrl
            }])
            .select();

          if (error) throw error;
          
          if (data && data[0]) {
            setVenues(prev => prev.map(v => v.id === tempId ? { ...v, id: data[0].id } : v));
          }
          toast.success('Venue provisioned and active');
        }
      } catch (err: any) {
        console.error('Persistence error:', err);
        toast.error(`Sync failed: ${err.message}`);
      }
    }
  };

  const handleEditClick = (venue: any) => {
    setNewVenue({ 
      name: venue.name, 
      address: venue.address, 
      radius: venue.radius,
      latitude: venue.latitude || 28.9931,
      longitude: venue.longitude || 77.0151,
      category: venue.category || 'Premium Lounge',
      imageUrl: venue.imageUrl || ''
    });
    setEditingId(venue.id);
    setShowAddForm(true);
  };

  const handleDeleteVenue = async (id: string) => {
    if (window.confirm('Decommission this venue? This will revoke all active check-ins.')) {
      const { error } = await supabase.from('venues').delete().eq('id', id);
      if (!error) {
        setVenues(venues.filter(v => v.id !== id));
        toast.success('Venue decommissioned');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] font-sans selection:bg-primary/20 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-[#00000005] h-screen p-8 flex flex-col justify-between sticky top-0 z-20">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0a0a0a] rounded-xl flex items-center justify-center font-black text-white text-xs">C</div>
            <span className="font-display font-bold text-xl tracking-tight text-[#0a0a0a]">CoolCliq <span className="text-muted-foreground font-medium text-xs ml-1 uppercase tracking-widest text-primary">Core</span></span>
          </div>

          <nav className="space-y-1.5">
            {[
              { label: 'Intelligence', icon: LayoutDashboard, path: '/admin/dashboard' },
              { label: 'Infrastructure', icon: Store, path: '/admin/venues', active: true },
              { label: 'Moderation', icon: ShieldAlert, path: '/admin/moderation' },
              { label: 'Identity Registry', icon: Users, path: '/admin/users' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all group ${
                  item.active 
                  ? 'bg-[#0a0a0a] text-white shadow-xl shadow-black/10' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-[#0a0a0a]'
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'group-hover:text-[#0a0a0a] transition-colors'}`} />
                <span className="text-sm font-semibold tracking-tight">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold tracking-tight">System Exit</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#fcfcfc] relative overflow-y-auto h-screen pb-24 lg:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#fcfcfc]/80 backdrop-blur-xl border-b border-[#00000005] px-6 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:hidden shrink-0">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
               <Menu className="w-6 h-6" />
             </button>
             <div className="w-8 h-8 bg-[#0a0a0a] rounded-lg flex items-center justify-center font-black text-white text-[10px] shrink-0">C</div>
          </div>

          <div className="flex items-center gap-3 w-full lg:max-w-xl">
            <div className="flex items-center bg-white border border-border rounded-xl px-3 lg:px-4 py-2 flex-1 min-w-0 shadow-sm">
              <Search className="w-4 h-4 text-muted-foreground mr-2 lg:mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Search infrastructure..." 
                className="bg-transparent border-none outline-none text-sm w-full font-medium truncate"
              />
            </div>
            <button className="p-2.5 rounded-xl border border-border bg-white shadow-sm hover:bg-muted transition-colors shrink-0">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => { setShowAddForm(true); setEditingId(null); }}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Provision Venue
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10 lg:space-y-12">
          {/* Section Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tight text-[#0a0a0a]">Infrastructure Management</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" /> Supervising {venues.length} active geofenced nodes
            </p>
          </div>

          {/* Add Venue Form - Professional Overlay Style */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white border border-border rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-black/5 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-display font-bold tracking-tight italic">
                      {editingId ? 'Refine Node Architecture' : 'Provision New Node'}
                    </h3>
                    <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Legal Entity Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Haveli Sonipat"
                        value={newVenue.name}
                        onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
                        className="w-full h-14 bg-[#f9f9f9] border border-border rounded-2xl px-6 font-semibold tracking-tight focus:bg-white focus:border-primary transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Street Address</label>
                      <input
                        type="text"
                        placeholder="Full physical location"
                        value={newVenue.address}
                        onChange={(e) => setNewVenue({ ...newVenue, address: e.target.value })}
                        className="w-full h-14 bg-[#f9f9f9] border border-border rounded-2xl px-6 font-semibold tracking-tight focus:bg-white focus:border-primary transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Node Category</label>
                      <select
                        value={newVenue.category}
                        onChange={(e) => setNewVenue({ ...newVenue, category: e.target.value })}
                        className="w-full h-14 bg-[#f9f9f9] border border-border rounded-2xl px-6 font-semibold tracking-tight focus:bg-white focus:border-primary transition-all outline-none"
                      >
                        <option>Premium Lounge</option>
                        <option>Garden Cafe</option>
                        <option>Bistro & Roastery</option>
                        <option>Dhaba & Ethnic</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Latitude</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={newVenue.latitude}
                        onChange={(e) => setNewVenue({ ...newVenue, latitude: parseFloat(e.target.value) })}
                        className="w-full h-14 bg-[#f9f9f9] border border-border rounded-2xl px-6 font-semibold tracking-tight focus:bg-white focus:border-primary transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Longitude</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={newVenue.longitude}
                        onChange={(e) => setNewVenue({ ...newVenue, longitude: parseFloat(e.target.value) })}
                        className="w-full h-14 bg-[#f9f9f9] border border-border rounded-2xl px-6 font-semibold tracking-tight focus:bg-white focus:border-primary transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Asset URL (Thumbnail)</label>
                      <input
                        type="text"
                        placeholder="Direct link to image"
                        value={newVenue.imageUrl}
                        onChange={(e) => setNewVenue({ ...newVenue, imageUrl: e.target.value })}
                        className="w-full h-14 bg-[#f9f9f9] border border-border rounded-2xl px-6 font-semibold tracking-tight focus:bg-white focus:border-primary transition-all outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Radius Validation Range: <span className="text-primary font-black">{newVenue.radius}m</span></label>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      value={newVenue.radius}
                      onChange={(e) => setNewVenue({ ...newVenue, radius: parseInt(e.target.value) })}
                      className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleAddVenue}
                      className="px-12 h-16 bg-[#0a0a0a] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10"
                    >
                      {editingId ? 'Update Infrastructure' : 'Authorize Node'}
                    </button>
                    <button 
                      onClick={() => setShowAddForm(false)}
                      className="px-8 h-16 bg-muted/50 text-muted-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Venues Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {venues.map((venue, idx) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white border border-border/50 rounded-[2.5rem] p-8 lg:p-10 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col gap-8 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-colors ${
                      venue.status === 'active' ? 'bg-[#0a0a0a] text-white shadow-xl shadow-black/10' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Store className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-display font-bold tracking-tight italic">{venue.name}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <MapPin className="w-3 h-3" /> {venue.address}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 py-6 border-y border-border/50">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Load</p>
                    <p className="text-xl font-display font-bold tracking-tight italic">{venue.activeUsers} <span className="text-[10px] not-italic text-muted-foreground">Active</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Radius</p>
                    <p className="text-xl font-display font-bold tracking-tight italic">{venue.radius} <span className="text-[10px] not-italic text-muted-foreground">m</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${venue.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      <p className="text-xs font-bold uppercase tracking-tight">{venue.status}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Signal className="w-3 h-3 text-green-500" /> Latency Optimized • {venue.lastSync}
                  </p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => navigate(`/admin/qr-code/${venue.id}`)}
                      className="w-12 h-12 rounded-2xl bg-[#0a0a0a]/5 hover:bg-[#0a0a0a] hover:text-white transition-all flex items-center justify-center group/btn"
                      title="Infrastructure QR"
                    >
                      <QrCode className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button 
                      onClick={() => handleEditClick(venue)}
                      className="w-12 h-12 rounded-2xl bg-[#0a0a0a]/5 hover:bg-[#0a0a0a] hover:text-white transition-all flex items-center justify-center group/btn"
                    >
                      <Edit className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button 
                      onClick={() => handleDeleteVenue(venue.id)}
                      className="w-12 h-12 rounded-2xl bg-[#0a0a0a]/5 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center group/btn"
                    >
                      <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 p-8 flex flex-col justify-between shadow-2xl lg:hidden overflow-y-auto no-scrollbar"
            >
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0a0a0a] rounded-lg flex items-center justify-center font-black text-white text-[10px]">C</div>
                    <span className="font-display font-bold text-lg tracking-tight text-[#0a0a0a]">CoolCliq</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-xl hover:bg-muted">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {[
                    { label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
                    { label: 'Venues', icon: Store, path: '/admin/venues', active: true },
                    { label: 'Moderation', icon: ShieldAlert, path: '/admin/moderation' },
                    { label: 'User Registry', icon: Users, path: '/admin/users' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                        item.active 
                        ? 'bg-[#0a0a0a] text-white shadow-xl shadow-black/20' 
                        : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold tracking-tight">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-4 px-4 py-4 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
