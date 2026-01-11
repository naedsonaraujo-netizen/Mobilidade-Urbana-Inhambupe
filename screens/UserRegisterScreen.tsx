
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, User, Phone, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';

const UserRegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    photo: null as string | null
  });

  const [showPassword, setShowPassword] = useState(false);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Define explicitamente como usuário comum
    localStorage.setItem('user_role', 'user');
    localStorage.setItem('temp_login_name', formData.firstName);
    
    if (formData.photo) {
      localStorage.setItem('temp_user_photo', formData.photo);
    }
    
    alert(`Cadastro realizado com sucesso! Seu login é: ${formData.firstName}`);
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#1a1c1e] text-white shadow-2xl relative overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6">
        <button 
          onClick={() => navigate('/')}
          className="p-2 bg-[#2d2f31] rounded-xl text-gray-400 hover:text-white transition"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Novo Usuário</h2>
        <div className="w-10"></div>
      </div>

      {/* Header Info */}
      <div className="px-8 pt-2 pb-10">
        <h1 className="text-3xl font-bold text-white">Crie sua conta</h1>
        <p className="text-gray-400 text-sm mt-1">Preencha os dados para começar a usar o App.</p>
      </div>

      {/* White Content Card */}
      <div className="flex-1 bg-white rounded-t-[40px] p-8 pb-12 overflow-y-auto no-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo Upload Section */}
          <div className="flex flex-col items-center mb-4">
            <div 
              onClick={handlePhotoClick}
              className="relative w-28 h-28 rounded-3xl bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-emerald-400 transition-colors overflow-hidden group"
            >
              {formData.photo ? (
                <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400 group-hover:text-emerald-500">
                  <Camera size={32} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">Adicionar Foto</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Camera size={20} className="text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nome (Este será seu Login)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Seu primeiro nome"
                  className="w-full bg-gray-50 border border-gray-200 text-[#1a1c1e] py-4 pl-12 pr-4 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Sobrenome</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={18} className="opacity-50" />
                </span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Seu sobrenome"
                  className="w-full bg-gray-50 border border-gray-200 text-[#1a1c1e] py-4 pl-12 pr-4 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Telefone / WhatsApp</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone size={18} />
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(75) 00000-0000"
                  className="w-full bg-gray-50 border border-gray-200 text-[#1a1c1e] py-4 pl-12 pr-4 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Crie uma Senha</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Digite sua senha"
                  className="w-full bg-gray-50 border border-gray-200 text-[#1a1c1e] py-4 pl-12 pr-12 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
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
          </div>

          <button
            type="submit"
            className="w-full bg-[#1a1c1e] text-white py-5 rounded-2xl font-bold text-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl mt-8"
          >
            Finalizar Cadastro
            <CheckCircle2 size={20} className="text-emerald-400" />
          </button>
        </form>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl -z-10"></div>
    </div>
  );
};

export default UserRegisterScreen;
