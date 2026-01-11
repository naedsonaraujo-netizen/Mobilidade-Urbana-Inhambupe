
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Camera, User, Phone, CheckCircle2, Lock, Eye, EyeOff, Briefcase, ChevronRight, AlertCircle, Info } from 'lucide-react';

const ServerRegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    photo: null as string | null,
    selectedService: null as { id: string, name: string } | null
  });

  const [showPassword, setShowPassword] = useState(false);

  // Recupera o serviço selecionado da navegação anterior
  useEffect(() => {
    const state = location.state as { selectedService?: { id: string, name: string }, formData?: any };
    if (state?.selectedService) {
      setFormData(prev => ({ ...prev, selectedService: state.selectedService || null }));
    }
    // Se voltamos da seleção, tentamos recuperar os dados preenchidos antes
    const savedData = localStorage.getItem('server_register_draft');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(prev => ({ ...prev, ...parsed, selectedService: state?.selectedService || parsed.selectedService }));
    }
  }, [location]);

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
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    // Salva rascunho para não perder ao ir selecionar o serviço
    localStorage.setItem('server_register_draft', JSON.stringify(newFormData));
  };

  const handleSelectService = () => {
    // Salva o estado atual antes de navegar
    localStorage.setItem('server_register_draft', JSON.stringify(formData));
    navigate('/select-service');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedService) {
      alert("Por favor, selecione um serviço para oferecer antes de finalizar.");
      return;
    }
    
    localStorage.removeItem('server_register_draft');
    localStorage.setItem('temp_login_name', formData.firstName);
    if (formData.photo) {
      localStorage.setItem('temp_user_photo', formData.photo);
    }
    localStorage.setItem('user_role', 'server');
    localStorage.setItem('server_service', formData.selectedService.id);

    alert(`Cadastro de Servidor (${formData.selectedService.name}) realizado com sucesso!`);
    navigate('/login');
  };

  const isFormValid = formData.firstName && formData.lastName && formData.phone && formData.password && formData.selectedService;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#0a1128] text-white shadow-2xl relative overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6">
        <button 
          onClick={() => {
            localStorage.removeItem('server_register_draft');
            navigate('/');
          }}
          className="p-2 bg-blue-900/40 rounded-xl text-blue-300 hover:text-white transition"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-300">Novo Servidor</h2>
        <div className="w-10"></div>
      </div>

      {/* Header Info */}
      <div className="px-8 pt-2 pb-6">
        <h1 className="text-3xl font-bold text-white">Trabalhe conosco</h1>
        <p className="text-blue-300 text-sm mt-1">Sua conta terá ferramentas exclusivas para prestadores.</p>
      </div>

      {/* White Content Card */}
      <div className="flex-1 bg-white rounded-t-[40px] p-8 pb-12 overflow-y-auto no-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo Upload Section */}
          <div className="flex flex-col items-center mb-2">
            <div 
              onClick={handlePhotoClick}
              className="relative w-28 h-28 rounded-3xl bg-blue-50 flex items-center justify-center cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-500 transition-colors overflow-hidden group"
            >
              {formData.photo ? (
                <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-blue-300 group-hover:text-blue-500">
                  <Camera size={32} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">Foto Profissional</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Service Picker Button */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Serviço a Oferecer *</label>
            <button
              type="button"
              onClick={handleSelectService}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                formData.selectedService 
                ? 'bg-blue-50 border-blue-500 text-blue-700' 
                : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <Briefcase size={20} className={formData.selectedService ? 'text-blue-500' : 'text-gray-300'} />
                <span className="font-bold">
                  {formData.selectedService ? formData.selectedService.name : 'Selecione sua categoria'}
                </span>
              </div>
              <ChevronRight size={20} />
            </button>
            
            {/* Nova descrição explicativa */}
            <div className="flex items-start gap-2 px-1 mt-2">
              <Info size={14} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Definir sua categoria é essencial para que os clientes encontrem você na modalidade correta de serviço e recebam suas notificações.
              </p>
            </div>

            {!formData.selectedService && (
              <p className="flex items-center gap-1.5 text-[10px] text-orange-500 font-bold uppercase ml-1 mt-2">
                <AlertCircle size={12} /> Seleção obrigatória para continuar
              </p>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nome</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Seu nome"
                  className="w-full bg-gray-50 border border-gray-200 text-[#1a1c1e] py-4 px-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Sobrenome</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Sobrenome"
                  className="w-full bg-gray-50 border border-gray-200 text-[#1a1c1e] py-4 px-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">WhatsApp de Trabalho</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                  <Phone size={18} />
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(75) 99999-9999"
                  className="w-full bg-gray-50 border border-gray-200 text-[#1a1c1e] py-4 pl-12 pr-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Senha de Acesso</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Crie uma senha"
                  className="w-full bg-gray-50 border border-gray-200 text-[#1a1c1e] py-4 pl-12 pr-12 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl mt-4 ${
              isFormValid 
              ? 'bg-[#0a1128] text-white active:scale-[0.98]' 
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            Finalizar Cadastro Servidor
            <CheckCircle2 size={20} className={isFormValid ? 'text-blue-400' : 'text-gray-300'} />
          </button>
        </form>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl -z-10"></div>
    </div>
  );
};

export default ServerRegisterScreen;
