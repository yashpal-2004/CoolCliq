import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Upload, User, ArrowLeft, ChevronRight, Camera } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  const [handle, setHandle] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = async () => {
    if (age && gender && handle) {
      const { data, error } = await supabase.from('profiles').insert([
        {
          handle,
          age: parseInt(age),
          gender,
          status: 'active'
        }
      ]).select();

      if (error) {
        toast.error(`Genesis Failed: ${error.message}`);
      } else {
        toast.success('Identity Genesis Complete');
        navigate('/mobile/qr-scan');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#0a0a0a] font-sans selection:bg-primary/20 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <header className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-white shadow-sm hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center font-black text-white text-sm shadow-lg shadow-primary/20">C</div>
          <span className="font-black text-lg tracking-tighter uppercase italic">CoolCliq</span>
        </div>
      </header>

      <main className="w-full max-w-sm p-8 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Identity <br />Genesis.</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-[0.1em] text-[10px]">Customize your administrative profile</p>
        </div>

        <div className="space-y-10">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 bg-muted rounded-[2.5rem] flex items-center justify-center overflow-hidden border-2 border-dashed border-border group-hover:border-primary transition-colors">
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0a0a0a] text-white rounded-xl flex items-center justify-center cursor-pointer shadow-xl hover:bg-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Upload className="w-4 h-4" />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Unique Handle</label>
               <input
                type="text"
                placeholder="Ex: GhostRider"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full h-16 bg-white border border-border rounded-2xl px-6 font-bold tracking-tight focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Biological Age</label>
               <input
                type="number"
                placeholder="Ex: 24"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full h-16 bg-white border border-border rounded-2xl px-6 font-bold tracking-tight focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Gender Identification</label>
              <div className="grid grid-cols-2 gap-3">
                {['Male', 'Female', 'Non-binary', 'Secret'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setGender(option)}
                    className={`h-14 rounded-xl border font-black uppercase tracking-widest text-[9px] transition-all ${
                      gender === option
                        ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'border-border bg-white text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleContinue}
            disabled={!age || !gender || !handle}
            className="w-full h-16 bg-[#0a0a0a] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-black/10 hover:bg-primary transition-all disabled:opacity-20 flex items-center justify-center gap-3 group"
          >
            Finalize Genesis
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>
    </div>
  );
}
