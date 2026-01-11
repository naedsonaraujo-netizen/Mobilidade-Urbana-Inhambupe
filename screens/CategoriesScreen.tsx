
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bike, Car, Flame, ChevronRight, Settings, ChevronLeft, ShieldCheck } from 'lucide-react';

const CategoriesScreen: React.FC = () => {
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

  const handleLogout = () => {
    localStorage.removeItem('is_logged_in');
    window.location.href = '/';
  };

  const handleCategoryClick = (id: string) => {
    if (id === 'mototaxi') {
      navigate('/mototaxi');
    } else if (id === 'gas') {
      navigate('/gas');
    } else {
      alert(`Categoria ${id} selecionada. Em desenvolvimento.`);
    }
  };

  const categories = [
    { id: 'mototaxi', name: 'Mototaxi', icon: <Bike size={32} />, color: 'bg-orange-100 text-orange-600' },
    { id: 'taxiuber', name: 'Taxi/Uber', icon: <Car size={32} />, color: 'bg-blue-100 text-blue-600' },
    { id: 'gas', name: 'Gás', icon: <Flame size={32} />, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#1a1c1e] text-white shadow-2xl relative overflow-hidden">
      
      {/* Top Header Section */}
      <div className="p-6 pt-10 flex flex-col gap-6">
        <div className="flex items-center justify-between w-full">
           <button 
            onClick={() => navigate('/')}
            className="p-2 bg-[#2d2f31] rounded-xl text-gray-400 hover:text-white transition"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:bg-white/10 hover:text-white transition-all border border-white/5"
          >
            <Settings size={22} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${userRole === 'server' ? 'from-blue-400 to-indigo-600' : 'from-emerald-400 to-blue-500'} p-0.5 shadow-lg`}>
            <div className="w-full h-full rounded-[14px] bg-[#1a1c1e] flex items-center justify-center overflow-hidden">
              {userPhoto ? (
                <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User size={24} className={userRole === 'server' ? 'text-blue-400' : 'text-emerald-400'} />
              )}
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Olá,</p>
            <h2 className="text-xl font-bold">{userName}</h2>
          </div>
        </div>

        {/* Quick Access to Server Dashboard if logged as server */}
        {userRole === 'server' && (
          <button 
            onClick={() => navigate('/server-dashboard')}
            className="w-full bg-blue-600/10 border border-blue-500/30 p-4 rounded-2xl flex items-center justify-between group active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-blue-400" />
              <span className="text-sm font-bold text-blue-300">Acessar Painel do Profissional</span>
            </div>
            <ChevronRight size={18} className="text-blue-500" />
          </button>
        )}
      </div>

      {/* Main Content Card */}
      <div className="flex-1 bg-white rounded-t-[40px] mt-2 p-8 overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-[#1a1c1e] text-2xl font-bold tracking-tight">O que você precisa hoje?</h3>
          <p className="text-gray-400 text-sm mt-1">Selecione uma categoria de serviço.</p>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 rounded-3xl transition-all group border border-gray-100 active:scale-[0.98]"
            >
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110`}>
                  {cat.icon}
                </div>
                <div className="text-left">
                  <span className="text-lg font-bold text-[#1a1c1e]">{cat.name}</span>
                  <p className="text-gray-400 text-xs font-medium">Serviço rápido e seguro</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:text-emerald-500 shadow-sm">
                <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center pb-8">
          <button 
            onClick={handleLogout}
            className="text-gray-300 text-xs font-bold uppercase tracking-widest hover:text-red-400 transition"
          >
            Sair da conta
          </button>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl -z-10"></div>
    </div>
  );
};

export default CategoriesScreen;
