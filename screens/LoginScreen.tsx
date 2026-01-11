
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Lock, Eye, EyeOff, LogIn, HelpCircle } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem('temp_login_name');
    if (savedLogin) {
      setLogin(savedLogin);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação pequena de processamento
    setTimeout(() => {
      localStorage.setItem('is_logged_in', 'true');
      localStorage.setItem('user_name', login);
      
      const role = localStorage.getItem('user_role');
      
      if (role === 'server') {
        navigate('/server-dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }, 500);
  };

  const handleForgotPassword = () => {
    alert('Funcionalidade de recuperação de senha será enviada para o seu telefone cadastrado.');
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#1a1c1e] text-white shadow-2xl relative overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6">
        <button 
          onClick={() => navigate('/')}
          className="p-2 bg-[#2d2f31] rounded-xl text-gray-400 hover:text-white transition"
          disabled={isLoading}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Login</h2>
        <div className="w-10"></div>
      </div>

      {/* Header Info */}
      <div className="px-8 pt-6 pb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter text-white uppercase italic">
          Conexão <br />
          <span className="text-emerald-400 not-italic">INHAMBUPE</span>
        </h1>
        <p className="text-gray-400 text-sm mt-4">Acesse sua conta para continuar.</p>
      </div>

      {/* White Content Card */}
      <div className="flex-1 bg-white rounded-t-[40px] p-8 flex flex-col justify-between">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Seu Login (Nome)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Seu nome de usuário"
                  className="w-full bg-gray-50 border border-gray-200 text-[#1a1c1e] py-4 pl-12 pr-4 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all placeholder:text-gray-300 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Senha</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Sua senha secreta"
                  className="w-full bg-gray-50 border border-gray-200 text-[#1a1c1e] py-4 pl-12 pr-12 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all placeholder:text-gray-300 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-emerald-500 text-sm font-semibold hover:text-emerald-600 flex items-center gap-1 transition-colors"
              >
                <HelpCircle size={14} />
                Esqueci minha senha
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1a1c1e] text-white py-5 rounded-2xl font-bold text-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl mt-4 disabled:opacity-70"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
            {!isLoading && <LogIn size={20} className="text-emerald-400" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-xs">Ainda não tem conta?</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => navigate('/register-user')}
                className="text-emerald-500 text-sm font-bold hover:underline"
                disabled={isLoading}
              >
                Usuário
              </button>
              <span className="text-gray-200">|</span>
              <button 
                onClick={() => navigate('/register-server')}
                className="text-blue-500 text-sm font-bold hover:underline"
                disabled={isLoading}
              >
                Profissional
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-32 -mb-32 blur-3xl -z-10"></div>
    </div>
  );
};

export default LoginScreen;
