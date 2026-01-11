
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bike, Car, Flame, ChevronRight, Briefcase } from 'lucide-react';

const ServiceSelectionScreen: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    { id: 'mototaxista', name: 'Mototaxista', icon: <Bike size={32} />, color: 'bg-blue-100 text-blue-600', description: 'Transporte rápido em duas rodas' },
    { id: 'motorista', name: 'Motorista Particular', icon: <Car size={32} />, color: 'bg-indigo-100 text-indigo-600', description: 'Taxi ou Uber particular' },
    { id: 'distribuidor_gas', name: 'Distribuidor de Gás', icon: <Flame size={32} />, color: 'bg-cyan-100 text-cyan-600', description: 'Revenda de botijão residencial' },
  ];

  const handleSelect = (serviceId: string, serviceName: string) => {
    // Retorna para o cadastro enviando o serviço escolhido via state
    navigate('/register-server', { 
      state: { 
        selectedService: { id: serviceId, name: serviceName } 
      },
      replace: true 
    });
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#0a1128] text-white shadow-2xl relative overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6 pt-10">
        <button 
          onClick={() => navigate('/register-server')}
          className="p-2 bg-blue-900/40 rounded-xl text-blue-300 hover:text-white transition"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-300">Área do Profissional</h2>
        <div className="w-10"></div>
      </div>

      {/* Header Info */}
      <div className="px-8 pb-8 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
        <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
          <Briefcase size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Sua Especialidade</h1>
          <p className="text-blue-300 text-sm">O que você oferecerá no app?</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 bg-white rounded-t-[40px] p-8 space-y-4">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">
          Selecione sua categoria de atuação:
        </p>

        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => handleSelect(service.id, service.name)}
            className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-blue-50 rounded-[32px] transition-all group border border-gray-100 hover:border-blue-100 active:scale-[0.98] text-left"
          >
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110`}>
                {service.icon}
              </div>
              <div>
                <span className="text-lg font-bold text-[#1a1c1e]">{service.name}</span>
                <p className="text-gray-400 text-xs font-medium">{service.description}</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-200 group-hover:text-blue-500 shadow-sm transition-colors">
              <ChevronRight size={20} />
            </div>
          </button>
        ))}

        <div className="pt-8 text-center px-4">
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <p className="text-blue-800 text-sm leading-relaxed">
              <strong>Painel do Servidor:</strong> Como profissional, você poderá ativar sua visibilidade e receber chamados em tempo real.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl -z-10"></div>
    </div>
  );
};

export default ServiceSelectionScreen;
