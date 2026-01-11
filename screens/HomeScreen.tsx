
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, User, Bike, Car, Flame, Settings, LogOut } from 'lucide-react';

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
    window.location.reload();
  };

  const categories = [
    { id: 'mototaxi', name: 'Mototaxi', icon: <Bike size={32} />, color: 'bg-orange-100 text-orange-600', path: '/mototaxi' },
    { id: 'taxiuber', name: 'Taxi/Uber', icon: <Car size={32} />, color: 'bg-blue-100 text-blue-600', path: '#' },
    { id: 'gas', name: 'Gás', icon: <Flame size={32} />, color: 'bg-red-100 text-red-600', path: '/gas' },
  ];

  if (isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#1a1c1e] text-white shadow-2xl relative overflow-hidden">
        {/* Hub Header */}
        <div className="p-6 pt-10 flex flex-col gap-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-400 to-blue-500 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-[10px] bg-[#1a1c1e] flex items-center justify-center overflow-hidden">
                  {userPhoto ? (
                    <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-emerald-400" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Inhambupe Conectada</p>
                <h2 className="text-lg font-bold">Olá, {userName}</h2>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/profile')}
              className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:bg-white/10 hover:text-white transition-all border border-white/5"
            >
              <Settings size={22} />
            </button>
          </div>
        </div>

        {/* Hub Content */}
        <div className="flex-1 bg-white rounded-t-[40px] mt-2 p-8 overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-[#1a1c1e] text-2xl font-bold tracking-tight">O que você precisa hoje?</h3>
            <p className="text-gray-400 text-sm mt-1">Selecione um dos nossos serviços locais.</p>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => cat.path !== '#' ? navigate(cat.path) : alert('Em desenvolvimento')}
                className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 rounded-3xl transition-all group border border-gray-100 active:scale-[0.98]"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110`}>
                    {cat.icon}
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-bold text-[#1a1c1e]">{cat.name}</span>
                    <p className="text-gray-400 text-xs font-medium">Toque para solicitar</p>
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
              className="flex items-center justify-center gap-2 mx-auto text-gray-300 text-xs font-bold uppercase tracking-widest hover:text-red-400 transition"
            >
              <LogOut size={14} />
              Sair da conta
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl -z-10"></div>
      </div>
    );
  }

  // Not Logged In View
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#1a1c1e] text-white shadow-2xl relative">
      <div className="flex flex-col items-center justify-center pt-24 pb-20 px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter text-white uppercase italic">
          Conexão <br />
          <span className="text-emerald-400 not-italic">INHAMBUPE</span>
        </h1>
        <div className="w-12 h-1 bg-emerald-400 mt-4 rounded-full opacity-50"></div>
      </div>

      <div className="flex-1 bg-white rounded-t-[40px] mt-4 p-8 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <span className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Comece por aqui</span>
            <div className="flex gap-1.5">
              <span className="w-6 h-1 bg-[#00e691] rounded-full"></span>
              <span className="w-1.5 h-1 bg-blue-400 rounded-full"></span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-[#1a1c1e] text-2xl font-bold leading-tight">
              Sua cidade, conectada.
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Deseja utilizar os serviços ou trabalhar conosco oferecendo sua especialidade?
            </p>
          </div>
        </div>

        <div className="space-y-4 pb-6">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#1a1c1e] text-white py-5 rounded-2xl font-bold text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            Entrar na minha conta
            <ChevronRight size={20} className="text-emerald-400" />
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/register-user')}
              className="bg-emerald-50 text-emerald-700 py-4 rounded-2xl font-bold text-sm border border-emerald-100 active:scale-95 transition-all text-center"
            >
              Sou Usuário
            </button>
            <button
              onClick={() => navigate('/register-server')}
              className="bg-blue-50 text-blue-700 py-4 rounded-2xl font-bold text-sm border border-blue-100 active:scale-95 transition-all text-center"
            >
              Sou Profissional
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white pb-6 text-center">
        <p className="text-[10px] text-gray-300 font-medium tracking-widest uppercase">
          Inhambupe • Mobilidade • Tecnologia
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
