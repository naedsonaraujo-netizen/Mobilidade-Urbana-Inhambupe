
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, User, Bike, Car, Flame, Settings, LogOut, MapPin, Briefcase, UserCircle2 } from 'lucide-react';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('is_logged_in') === 'true';
    setIsLoggedIn(auth);
    if (auth) {
      setUserName(localStorage.getItem('user_name') || 'Usuário');
      setUserPhoto(localStorage.getItem('temp_user_photo'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('user_role');
    window.location.reload();
  };

  const categories = [
    { id: 'mototaxi', name: 'Mototaxi', icon: <Bike size={32} />, color: 'bg-emerald-50 text-emerald-600', path: '/mototaxi' },
    { id: 'taxiuber', name: 'Taxi/Uber', icon: <Car size={32} />, color: 'bg-blue-50 text-blue-600', path: '#' },
    { id: 'gas', name: 'Entrega de Gás', icon: <Flame size={32} />, color: 'bg-red-50 text-red-600', path: '/gas' },
  ];

  if (isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#050a1e] text-white shadow-2xl relative overflow-hidden">
        {/* Hub Header */}
        <div className="p-6 pt-12 flex flex-col gap-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#00d1a0] p-0.5 shadow-lg shadow-emerald-900/40">
                <div className="w-full h-full rounded-[14px] bg-[#050a1e] flex items-center justify-center overflow-hidden">
                  {userPhoto ? (
                    <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-[#00d1a0]" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-[#00d1a0] text-[10px] font-black uppercase tracking-widest">Inhambupe • AkiTen</p>
                <h2 className="text-xl font-bold">Na hora, {userName}!</h2>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/profile')}
              className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:bg-white/10 hover:text-white transition-all border border-white/10"
            >
              <Settings size={22} />
            </button>
          </div>
        </div>

        {/* Hub Content */}
        <div className="flex-1 bg-white rounded-t-[40px] mt-2 p-8 overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-[#050a1e] text-2xl font-black tracking-tight">O que você precisa agora?</h3>
            <p className="text-gray-400 text-sm mt-1 font-medium">Com certeza temos o que você procura.</p>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => cat.path !== '#' ? navigate(cat.path) : alert('Com certeza essa função chegará em breve!')}
                className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-emerald-50 rounded-[32px] transition-all group border border-gray-100 active:scale-[0.98]"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110`}>
                    {cat.icon}
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-black text-[#050a1e]">{cat.name}</span>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter">Disponível agora</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:text-[#00d1a0] shadow-sm transition-colors">
                  <ChevronRight size={20} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 text-center pb-8">
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 mx-auto text-gray-300 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition"
            >
              <LogOut size={14} />
              Sair da conta AkiTen
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d1a0]/10 rounded-full -mr-32 -mt-32 blur-3xl -z-10"></div>
      </div>
    );
  }

  // Not Logged In View - Optimized for First Access
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#050a1e] text-white shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

      <div className="flex flex-col items-center justify-center pt-24 pb-12 px-8 text-center relative z-10">
        <div className="w-20 h-20 bg-[#00d1a0] rounded-[28px] flex items-center justify-center shadow-2xl shadow-emerald-900/50 mb-6 transform rotate-3">
          <MapPin size={40} className="text-white -rotate-3" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Aki<span className="text-[#00d1a0] not-italic">Ten</span>
        </h1>
        <p className="text-[#00d1a0] text-[10px] font-black uppercase tracking-[0.4em] mt-2">Inhambupe • Bahia</p>
      </div>

      <div className="flex-1 bg-white rounded-t-[48px] p-8 flex flex-col justify-between relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Como vamos usar o app hoje?</span>
            <div className="flex gap-1.5">
              <span className="w-8 h-1.5 bg-[#00d1a0] rounded-full"></span>
              <span className="w-2 h-1.5 bg-[#2563eb] rounded-full"></span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <button
              onClick={() => navigate('/register-user')}
              className="w-full bg-emerald-50 border border-emerald-100 p-6 rounded-[32px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm transition-transform group-hover:scale-110">
                  <UserCircle2 size={32} />
                </div>
                <div className="text-left">
                  <span className="text-xl font-black text-[#050a1e]">Sou Usuário</span>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-tight">Quero pedir serviços</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-emerald-200" />
            </button>

            <button
              onClick={() => navigate('/register-server')}
              className="w-full bg-blue-50 border border-blue-100 p-6 rounded-[32px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                  <Briefcase size={32} />
                </div>
                <div className="text-left">
                  <span className="text-xl font-black text-[#050a1e]">Sou Profissional</span>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-tight">Quero trabalhar no app</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-blue-200" />
            </button>
          </div>
        </div>

        <div className="pt-6 text-center space-y-4">
           <p className="text-gray-400 text-xs font-medium leading-relaxed px-4">
              Tudo o que você precisa em Inhambupe em um só lugar. Escolha seu perfil para começar.
           </p>
           <p className="text-[10px] text-gray-300 font-black tracking-widest uppercase pb-4">
              AkiTen v1.1 • Praticidade em suas mãos
           </p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
