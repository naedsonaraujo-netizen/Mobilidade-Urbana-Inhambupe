
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Phone, MapPin, Camera, LogOut, Trash2, Star, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Usuário');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'server'>('user');

  useEffect(() => {
    const name = localStorage.getItem('user_name');
    const photo = localStorage.getItem('temp_user_photo');
    const role = localStorage.getItem('user_role') as 'user' | 'server';
    
    if (name) setUserName(name);
    if (photo) setUserPhoto(photo);
    if (role) setUserRole(role);
  }, []);

  // Mock de estatísticas do usuário
  const stats = {
    rating: 4.9,
    completedRides: userRole === 'server' ? 156 : 28,
    cancelledRides: userRole === 'server' ? 5 : 3
  };

  const handleLogout = () => {
    localStorage.removeItem('is_logged_in');
    window.location.href = '#/';
    window.location.reload();
  };

  const handleClearData = () => {
    if (confirm("Isso apagará todos os seus dados e fotos do aplicativo. Continuar?")) {
      localStorage.clear();
      window.location.href = '#/';
      window.location.reload();
    }
  };

  const bgColor = userRole === 'server' ? 'bg-[#0a1128]' : 'bg-[#1a1c1e]';
  const accentColor = userRole === 'server' ? 'text-blue-400' : 'text-emerald-400';
  const primaryBtnColor = userRole === 'server' ? 'bg-blue-600' : 'bg-emerald-500';

  return (
    <div className={`flex flex-col min-h-screen max-w-md mx-auto ${bgColor} text-white shadow-2xl relative overflow-hidden`}>
      
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6 pt-10">
        <button 
          onClick={() => navigate(userRole === 'server' ? '/server-dashboard' : '/')}
          className={`p-2 ${userRole === 'server' ? 'bg-blue-900/40' : 'bg-[#2d2f31]'} rounded-xl text-gray-400 hover:text-white transition`}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className={`text-sm font-bold uppercase tracking-widest ${userRole === 'server' ? 'text-blue-300' : 'text-gray-400'}`}>
          {userRole === 'server' ? 'Painel Profissional' : 'Meu Perfil'}
        </h2>
        <div className="w-10"></div>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center px-8 py-4">
        <div className="relative">
          <div className={`w-32 h-32 rounded-[40px] bg-gradient-to-tr ${userRole === 'server' ? 'from-blue-400 to-indigo-600' : 'from-emerald-400 to-blue-500'} p-1 shadow-2xl rotate-3`}>
            <div className={`w-full h-full rounded-[36px] ${bgColor} flex items-center justify-center overflow-hidden -rotate-3`}>
              {userPhoto ? (
                <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className={accentColor} />
              )}
            </div>
          </div>
          <button className={`absolute bottom-0 right-0 p-3 ${primaryBtnColor} rounded-2xl text-white shadow-lg border-4 ${userRole === 'server' ? 'border-[#0a1128]' : 'border-[#1a1c1e]'} hover:scale-110 transition-transform`}>
            <Camera size={18} />
          </button>
        </div>
        <div className="flex flex-col items-center mt-6">
          <h1 className="text-2xl font-bold">{userName}</h1>
          <div className={`flex items-center gap-1.5 mt-1 ${accentColor} text-sm font-bold uppercase tracking-widest`}>
            {userRole === 'server' && <ShieldCheck size={14} />}
            {userRole === 'server' ? 'Servidor Verificado' : 'Membro Conexão'}
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="px-8 mt-4 grid grid-cols-3 gap-3">
        <div className={`${userRole === 'server' ? 'bg-blue-900/20' : 'bg-[#2d2f31]'} p-3 rounded-2xl flex flex-col items-center justify-center border border-white/5`}>
          <div className="flex items-center gap-1 text-amber-400 mb-1">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-black">{stats.rating}</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Avaliação</p>
        </div>

        <div className={`${userRole === 'server' ? 'bg-blue-900/20' : 'bg-[#2d2f31]'} p-3 rounded-2xl flex flex-col items-center justify-center border border-white/5`}>
          <div className={`flex items-center gap-1 ${accentColor} mb-1`}>
            <CheckCircle2 size={14} />
            <span className="text-sm font-black">{stats.completedRides}</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Serviços</p>
        </div>

        <div className={`${userRole === 'server' ? 'bg-blue-900/20' : 'bg-[#2d2f31]'} p-3 rounded-2xl flex flex-col items-center justify-center border border-white/5`}>
          <div className="flex items-center gap-1 text-red-400 mb-1">
            <XCircle size={14} />
            <span className="text-sm font-black">{stats.cancelledRides}</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Cancelados</p>
        </div>
      </div>

      {/* Info Cards Container */}
      <div className="flex-1 bg-white rounded-t-[40px] mt-8 p-8 space-y-4">
        <div className={`flex items-center gap-4 p-4 ${userRole === 'server' ? 'bg-blue-50' : 'bg-gray-50'} rounded-2xl border border-gray-100`}>
          <div className={`p-3 ${userRole === 'server' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'} rounded-xl`}>
            <Phone size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WhatsApp Profissional</p>
            <p className="text-[#1a1c1e] font-semibold">(75) 99999-9999</p>
          </div>
        </div>

        <div className="pt-6 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 text-red-500 font-bold border-2 border-red-50 border-dashed rounded-2xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sair da Conta
          </button>

          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-center gap-3 py-3 text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            <Trash2 size={14} />
            Apagar Meus Dados
          </button>
        </div>
      </div>

      <div className={`absolute top-0 right-0 w-64 h-64 ${userRole === 'server' ? 'bg-blue-500/10' : 'bg-emerald-500/10'} rounded-full -mr-32 -mt-32 blur-3xl -z-10`}></div>
    </div>
  );
};

export default ProfileScreen;
