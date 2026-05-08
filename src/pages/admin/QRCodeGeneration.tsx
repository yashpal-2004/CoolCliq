import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Download, QrCode as QrCodeIcon, LayoutDashboard, Store, ShieldAlert, Users, LogOut, 
  ChevronRight, Printer, Share2, Info, Bell, Search, Menu, X, Filter, MoreVertical, Activity,
  Globe, FileText, Image as ImageIcon, Box
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function QRCodeGeneration() {
  const navigate = useNavigate();
  const { venueId } = useParams();
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

  const venue = {
    id: venueId || 'venue-042',
    name: 'BKC Social',
    address: 'Plot 7, Sector 12, BKC',
  };

  const handleDownloadPDF = () => {
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('COOLCLIQ ADMIN', 20, 25);
    
    // Venue Info
    doc.setTextColor(10, 10, 10);
    doc.setFontSize(18);
    doc.text(`Venue: ${venue.name}`, 20, 60);
    doc.setFontSize(12);
    doc.text(`ID: ${venue.id}`, 20, 70);
    doc.text(`Location: ${venue.address}`, 20, 80);
    
    // QR Area Placeholder
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(55, 100, 100, 100);
    doc.text('SECURE QR TOKEN PLACEHOLDER', 105, 150, { align: 'center' });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('This document contains sensitive administrative tokens. Keep secure.', 105, 280, { align: 'center' });
    
    doc.save(`${venue.name}_QR_Asset.pdf`);
  };

  const handleDownload = () => {
    handleDownloadPDF();
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] font-sans selection:bg-primary/20 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-[#00000005] h-screen p-8 flex flex-col justify-between sticky top-0 z-20">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0a0a0a] rounded-xl flex items-center justify-center font-black text-white text-xs">C</div>
            <span className="font-display font-bold text-xl tracking-tight text-[#0a0a0a]">CoolCliq <span className="text-muted-foreground font-medium text-xs ml-1 uppercase tracking-widest">Admin</span></span>
          </div>

          <nav className="space-y-1.5">
            {[
              { label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
              { label: 'Venues', icon: Store, path: '/admin/venues', active: true },
              { label: 'Moderation', icon: ShieldAlert, path: '/admin/moderation' },
              { label: 'User Registry', icon: Users, path: '/admin/users' },
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
          <span className="text-sm font-semibold tracking-tight">Sign Out</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#fcfcfc] relative overflow-y-auto h-screen pb-24 lg:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#fcfcfc]/80 backdrop-blur-xl border-b border-[#00000005] px-6 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
               <Menu className="w-6 h-6" />
             </button>
             <div className="w-8 h-8 bg-[#0a0a0a] rounded-lg flex items-center justify-center font-black text-white text-[10px]">C</div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/venues')}
              className="p-2.5 rounded-xl border border-border bg-white shadow-sm hover:bg-muted transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-[#0a0a0a]" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">Back to Venues</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3">
             <button 
                onClick={handleDownloadPDF}
                className="px-6 py-2.5 rounded-xl border border-border bg-white font-bold text-sm shadow-sm hover:bg-muted transition-all flex items-center gap-2"
              >
                 <Printer className="w-4 h-4" /> Print Distribution
              </button>
             <button className="px-6 py-2.5 rounded-xl bg-[#0a0a0a] text-white font-bold text-sm shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Share Link
             </button>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10 lg:space-y-12">
          {/* Section Heading */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tight text-[#0a0a0a]">Signal Generation</h1>
            <p className="text-muted-foreground font-medium flex items-center justify-center lg:justify-start gap-2">
              Provisioning cryptographic access assets for {venue.name}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Visual Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-border/50 rounded-[3rem] p-12 lg:p-16 shadow-sm flex flex-col items-center justify-center space-y-12 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-muted/50 blur-[100px] -mr-32 -mt-32 rounded-full" />
               
               <div className="relative group">
                  <div className="absolute -inset-4 bg-[#0a0a0a]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative w-64 h-64 lg:w-80 lg:h-80 bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-black/5 flex items-center justify-center border border-border/50 group-hover:scale-[1.03] transition-transform duration-700">
                    <div className="absolute inset-4 border border-dashed border-[#0a0a0a]/10 rounded-[2.8rem]" />
                    <QrCodeIcon className="w-full h-full text-[#0a0a0a]" strokeWidth={1} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-2xl shadow-xl border border-border flex items-center justify-center font-display font-bold italic text-2xl tracking-tighter">C</div>
                  </div>
               </div>

               <div className="text-center space-y-2">
                  <h3 className="text-2xl font-display font-bold tracking-tight italic uppercase">{venue.name}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{venue.address}</p>
               </div>
            </motion.div>

            {/* Config & Deployment */}
            <div className="space-y-8">
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-white border border-border/50 rounded-[2.5rem] p-10 shadow-sm space-y-10"
               >
                  <div className="space-y-6">
                    <h3 className="text-xl font-display font-bold tracking-tight italic flex items-center gap-3">
                      Asset Configuration <Info className="w-4 h-4 text-[#0a0a0a]" />
                    </h3>
                    
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Distribution Format</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'pdf', icon: FileText, label: 'PDF' },
                            { id: 'png', icon: ImageIcon, label: 'PNG' },
                            { id: 'svg', icon: Box, label: 'SVG' }
                          ].map(format => (
                            <button key={format.id} className={`h-16 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${format.id === 'pdf' ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] shadow-lg shadow-black/10' : 'bg-muted/30 border-border hover:bg-muted'}`}>
                              <format.icon className="w-4 h-4" />
                              <span className="text-[10px] font-bold">{format.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Physical Layout</label>
                        <select className="w-full h-14 bg-[#f9f9f9] border border-border rounded-2xl px-6 font-semibold tracking-tight focus:bg-white focus:border-[#0a0a0a] outline-none appearance-none cursor-pointer">
                          <option>Table Display (4" x 4")</option>
                          <option>Entrance Decal (8" x 8")</option>
                          <option>Large Poster (11" x 17")</option>
                        </select>
                      </div>

                      <div className="space-y-4 pt-2">
                        {[
                          'Hard-code Venue Identity',
                          'Include Proximity Instructions',
                          'Embed Encryption Signature',
                          'Activate Real-time Telemetry'
                        ].map((item, idx) => (
                          <label key={idx} className="flex items-center gap-4 cursor-pointer group">
                            <div className="relative w-5 h-5 border-2 border-border rounded-lg group-hover:border-[#0a0a0a] transition-colors">
                              <input type="checkbox" defaultChecked={idx < 2} className="sr-only peer" />
                              <div className="absolute inset-0.5 bg-[#0a0a0a] rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-[#0a0a0a] transition-colors">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleDownload}
                    className="w-full h-16 bg-[#0a0a0a] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" /> Provision Package
                  </button>
               </motion.div>

            </div>
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
