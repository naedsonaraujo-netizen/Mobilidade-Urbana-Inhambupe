
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Lock, Eye, EyeOff, LogIn, HelpCircle, MapPin } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem('temp_login_name');
    if (savedLogin) setLogin(savedLogin);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('is_logged_in', 'true');
      localStorage.setItem('user_name', login);
      const role = localStorage.getItem('user_role');
      navigate(role === 'server' ? '/server-dashboard' : '/', { replace: true });
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#050a1e] text-white shadow-2xl relative overflow-hidden">
      
      <div className="p-6 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="p-2 bg-white/5 rounded-xl text-gray-400">
          <ChevronLeft size={24} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#00d1a0]">AkiTen Login</span>
        <div className="w-10"></div>
      </div>

      <div className="px-8 pt-8 pb-12 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-[#00d1a0] rounded-2xl flex items-center justify-center shadow-lg mb-6">
          <MapPin size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-black uppercase italic">
          Aki<span className="text-[#00d1a0] not-italic">Ten</span>
        </h1>
        <p className="text-gray-400 text-sm mt-3 font-medium">Pronto para começar? Vamos nessa!</p>
      </div>

      <div className="flex-1 bg-white rounded-t-[48px] p-8 flex flex-col justify-between">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Usuário</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                  placeholder="Seu nome de usuário"
                  className="w-full bg-gray-50 border-2 border-transparent text-[#050a1e] py-4 pl-12 pr-4 rounded-2xl focus:border-[#00d1a0] focus:bg-white outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent text-[#050a1e] py-4 pl-12 pr-12 rounded-2xl focus:border-[#00d1a0] focus:bg-white outline-none transition-all font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button type="button" className="text-[#00d1a0] text-xs font-bold uppercase tracking-widest hover:underline ml-1">
              Esqueci minha senha
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#050a1e] text-white py-5 rounded-[28px] font-black text-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            {isLoading ? 'Conectando...' : 'Entrar Agora'}
            {!isLoading && <LogIn size={20} className="text-[#00d1a0]" />}
          </button>
        </form>

        <div className="text-center">
           <p className="text-gray-400 text-xs font-medium">Ainda não faz parte do AkiTen?</p>
           <button onClick={() => navigate('/register-user')} className="text-[#2563eb] text-sm font-black uppercase tracking-widest mt-1">
             Criar minha conta
           </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
