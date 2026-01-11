
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bike, MapPin, Globe, Users, Loader2, CheckCircle2, Star, XCircle, RotateCcw, Heart, ChevronRight, Navigation, Info, Send } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  photo: string;
  rating: number;
  rides: number;
}

interface Destination {
  name: string;
  price: string;
  type?: 'city' | 'povoado';
}

const MototaxiScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'searching' | 'accepted' | 'rating' | 'selecting_city' | 'selecting_povoado' | 'confirming_trip'>('idle');
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [customDestinationName, setCustomDestinationName] = useState('');

  const destinationCities: Destination[] = [
    { name: 'Alagoinhas', price: '80,00', type: 'city' },
    { name: 'Entre Rios', price: '100,00', type: 'city' },
    { name: 'Satiro Dias', price: '80,00', type: 'city' },
    { name: 'Olindina', price: '80,00', type: 'city' },
    { name: 'Crisópolis', price: '100,00', type: 'city' },
    { name: 'Aporá', price: '70,00', type: 'city' },
    { name: 'Itamira', price: '40,00', type: 'city' },
  ];

  const destinationPovoados: Destination[] = [
    { name: 'Araçatuba', price: '15,00', type: 'povoado' },
    { name: 'Baixa Grande', price: '50,00', type: 'povoado' },
    { name: 'Boa vista', price: '30,00', type: 'povoado' },
    { name: 'Botelho', price: '10,00', type: 'povoado' },
    { name: 'Cai duro', price: '20,00', type: 'povoado' },
    { name: 'Camamun', price: '20,00', type: 'povoado' },
    { name: 'Campo grande', price: '20,00', type: 'povoado' },
    { name: 'Colônia', price: '40,00', type: 'povoado' },
    { name: 'Entroncamento de Baixa grande', price: '30,00', type: 'povoado' },
    { name: 'Entroncamento de Sátiro Dias', price: '30,00', type: 'povoado' },
    { name: 'Flexas', price: '20,00', type: 'povoado' },
    { name: 'Formoso', price: '25,00', type: 'povoado' },
    { name: 'Galo assanhado', price: '15,00', type: 'povoado' },
    { name: 'Juazeiro', price: '10,00', type: 'povoado' },
    { name: 'Km 8', price: '30,00', type: 'povoado' },
    { name: 'Km 29', price: '25,00', type: 'povoado' },
    { name: 'Ladeira do Tabuleiro', price: '10,00', type: 'povoado' },
    { name: 'Lagoa', price: '35,00', type: 'povoado' },
    { name: 'Lagoa Branca', price: '40,00', type: 'povoado' },
    { name: 'Lagoa seca', price: '10,00', type: 'povoado' },
    { name: 'Limoeiro', price: '15,00', type: 'povoado' },
    { name: 'Piçarra', price: '20,00', type: 'povoado' },
    { name: 'Saguim', price: '15,00', type: 'povoado' },
    { name: 'Saquinho', price: '30,00', type: 'povoado' },
    { name: 'Tanquinho', price: '45,00', type: 'povoado' },
    { name: 'Tapera', price: '20,00', type: 'povoado' },
    { name: 'Trinxeira', price: '35,00', type: 'povoado' },
    { name: 'Volta de cima', price: '20,00', type: 'povoado' },
  ];

  const handleUrbanDisplacement = () => {
    setSelectedDestination(null);
    startSearch();
  };

  const handleDestinationSelect = (dest: Destination) => {
    setSelectedDestination(dest);
    setRequestStatus('confirming_trip');
  };

  const handleCustomDestinationSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customDestinationName.trim()) return;
    
    const type = requestStatus === 'selecting_povoado' ? 'povoado' : 'city';
    setSelectedDestination({ name: customDestinationName, price: 'A combinar', type });
    setRequestStatus('confirming_trip');
    setCustomDestinationName('');
  };

  const startSearch = () => {
    setIsSearching(true);
    setRequestStatus('searching');

    // DISPARA CHAMADA GLOBAL (Para simulação no Painel do Profissional)
    const callEvent = new CustomEvent('request_service', {
      detail: {
        id: Math.random().toString(36).substr(2, 9),
        type: 'mototaxi',
        clientName: localStorage.getItem('user_name') || 'Cliente Local',
        origin: 'Centro (Inhambupe)',
        destination: selectedDestination ? selectedDestination.name : 'Deslocamento Urbano',
        value: selectedDestination ? selectedDestination.price : '8,00'
      }
    });
    window.dispatchEvent(callEvent);
    
    setTimeout(() => {
      const randomDriver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
      setCurrentDriver(randomDriver);
      setRequestStatus('accepted');
      setIsSearching(false);
    }, 6000);
  };

  const handleCancel = () => {
    setRequestStatus('idle');
    setIsSearching(false);
    setCurrentDriver(null);
    setUserRating(0);
    setSelectedDestination(null);
    setCustomDestinationName('');
  };

  const handleFinishAndRate = () => {
    setRequestStatus('rating');
  };

  const submitRating = () => {
    alert(`Obrigado! Você avaliou ${currentDriver?.name} com ${userRating} estrelas.`);
    handleCancel();
  };

  const mockDrivers: Driver[] = [
    { id: '1', name: 'Ricardo Silva', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200', rating: 4.9, rides: 1240 },
    { id: '2', name: 'João Santos', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200', rating: 4.8, rides: 856 },
    { id: '3', name: 'Marcos Oliveira', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200', rating: 5.0, rides: 432 },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#1a1c1e] text-white shadow-2xl relative overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6 pt-10">
        <button 
          onClick={() => {
            if (requestStatus === 'selecting_city' || requestStatus === 'selecting_povoado') setRequestStatus('idle');
            else if (requestStatus === 'confirming_trip') {
              if (selectedDestination?.type === 'povoado') setRequestStatus('selecting_povoado');
              else setRequestStatus('selecting_city');
            }
            else navigate('/');
          }}
          className="p-2 bg-[#2d2f31] rounded-xl text-gray-400 hover:text-white transition"
          disabled={isSearching}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
          {requestStatus === 'selecting_city' ? 'Destinos' : 
           requestStatus === 'selecting_povoado' ? 'Povoados' :
           requestStatus === 'confirming_trip' ? 'Confirmação' : 'Mototaxi'}
        </h2>
        <div className="w-10"></div>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 bg-white rounded-t-[40px] p-8 space-y-6 overflow-y-auto no-scrollbar">
        
        {requestStatus === 'idle' && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-[#1a1c1e] text-xl font-bold">Para onde vamos?</h3>
            
            <button
              onClick={handleUrbanDisplacement}
              className="w-full bg-[#1a1c1e] text-white p-6 rounded-[32px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500 rounded-2xl text-[#1a1c1e]">
                  <MapPin size={24} />
                </div>
                <div className="text-left">
                  <span className="text-lg font-bold">Urbano</span>
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-tighter">Preço Fixo R$ 8,00</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setRequestStatus('selecting_povoado')}
              className="w-full bg-gray-50 border border-gray-100 text-[#1a1c1e] p-6 rounded-[32px] flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                  <Users size={24} />
                </div>
                <div className="text-left">
                  <span className="text-lg font-bold">Cidade para Povoado</span>
                  <p className="text-gray-400 text-xs font-medium uppercase">Tarifas fixas</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setRequestStatus('selecting_city')}
              className="w-full bg-gray-50 border border-gray-100 text-[#1a1c1e] p-6 rounded-[32px] flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                  <Globe size={24} />
                </div>
                <div className="text-left">
                  <span className="text-lg font-bold">Intermunicipal</span>
                  <p className="text-gray-400 text-xs font-medium uppercase">Outras cidades</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {(requestStatus === 'selecting_city' || requestStatus === 'selecting_povoado') && (
          <div className="space-y-3 animate-in fade-in pb-10">
            <div className="mb-6">
              <form onSubmit={handleCustomDestinationSubmit} className="relative">
                <input
                  type="text"
                  placeholder={requestStatus === 'selecting_povoado' ? "Nome do povoado..." : "Nome da cidade..."}
                  value={customDestinationName}
                  onChange={(e) => setCustomDestinationName(e.target.value)}
                  className={`w-full ${requestStatus === 'selecting_povoado' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-blue-50/50 border-blue-100'} border-2 text-[#1a1c1e] py-4 pl-5 pr-14 rounded-2xl outline-none font-medium`}
                />
                <button
                  type="submit"
                  disabled={!customDestinationName.trim()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 ${requestStatus === 'selecting_povoado' ? 'bg-emerald-500' : 'bg-blue-500'} text-white rounded-xl flex items-center justify-center disabled:opacity-30`}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>

            {(requestStatus === 'selecting_city' ? destinationCities : destinationPovoados).map((dest, idx) => (
              <button
                key={idx}
                onClick={() => handleDestinationSelect(dest)}
                className="w-full bg-gray-50 border border-gray-100 text-[#1a1c1e] p-5 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors`}>
                    <MapPin size={20} />
                  </div>
                  <span className="font-bold text-lg">{dest.name}</span>
                </div>
                <span className="text-blue-600 font-black">R$ {dest.price}</span>
              </button>
            ))}
          </div>
        )}

        {requestStatus === 'confirming_trip' && selectedDestination && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300 text-center">
            <h3 className="text-[#1a1c1e] text-2xl font-bold">Resumo da Viagem</h3>
            
            <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 space-y-4">
               <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Destino</p>
                <p className="text-[#1a1c1e] font-bold text-xl">{selectedDestination.name}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Valor Estimado</p>
                <p className="text-3xl font-black text-blue-600">
                  {selectedDestination.price === 'A combinar' ? 'A combinar' : `R$ ${selectedDestination.price}`}
                </p>
              </div>
            </div>

            <button
              onClick={startSearch}
              className="w-full bg-[#1a1c1e] text-white py-6 rounded-[32px] font-bold text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              Chamar Mototaxi
              <CheckCircle2 size={24} className="text-emerald-400" />
            </button>
          </div>
        )}

        {requestStatus === 'searching' && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
                <Loader2 size={48} className="text-emerald-500 animate-spin" />
              </div>
              <div className="absolute -top-2 -right-2 p-3 bg-emerald-500 text-white rounded-full shadow-lg">
                <Bike size={24} />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[#1a1c1e] text-2xl font-bold">Emitindo Aviso...</h3>
              <p className="text-gray-400 text-sm max-w-[200px] mx-auto">Os mototaxistas disponíveis em Inhambupe estão recebendo seu chamado agora.</p>
            </div>
            <button onClick={handleCancel} className="text-red-500 font-bold uppercase text-xs tracking-widest mt-8">
              Cancelar
            </button>
          </div>
        )}

        {requestStatus === 'accepted' && currentDriver && (
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="w-full flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg p-1">
                 <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img src={currentDriver.photo} alt={currentDriver.name} className="w-full h-full object-cover" />
                 </div>
              </div>
            </div>
            <h3 className="text-[#1a1c1e] text-2xl font-bold">{currentDriver.name}</h3>
            <div className="w-full space-y-3 mt-8">
              <button onClick={handleFinishAndRate} className="w-full bg-emerald-500 text-[#1a1c1e] py-5 rounded-2xl font-bold">Avaliar</button>
              <button onClick={handleCancel} className="w-full py-4 text-red-500 font-bold">Cancelar</button>
            </div>
          </div>
        )}

        {requestStatus === 'rating' && (
          <div className="flex flex-col items-center py-4">
            <h3 className="text-[#1a1c1e] text-2xl font-bold mb-8">Como foi sua viagem?</h3>
            <div className="flex gap-2 mb-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setUserRating(star)}>
                  <Star size={42} fill={userRating >= star ? "#fbbf24" : "transparent"} className={userRating >= star ? "text-amber-400" : "text-gray-200"} />
                </button>
              ))}
            </div>
            <button disabled={userRating === 0} onClick={submitRating} className="w-full bg-[#1a1c1e] text-white py-5 rounded-3xl font-bold">Enviar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MototaxiScreen;
