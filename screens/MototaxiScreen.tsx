
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bike, MapPin, Globe, Users, Loader2, Star, ChevronRight, Map, Search, MessageCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Driver { id: string; name: string; photo: string; rating: number; rides: number; }
interface Destination { name: string; price: string; isCustom?: boolean; }

const MototaxiScreen: React.FC = () => {
  const navigate = useNavigate();
  const [requestStatus, setRequestStatus] = useState<'idle' | 'selecting_povoado' | 'selecting_city' | 'searching' | 'accepted'>('idle');
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  const destinationCities: Destination[] = [
    { name: 'Alagoinhas', price: '80,00' },
    { name: 'Entre Rios', price: '100,00' },
    { name: 'Satiro Dias', price: '80,00' },
    { name: 'Olindina', price: '80,00' },
    { name: 'Salvador', price: '350,00' },
    { name: 'Feira de Santana', price: '200,00' },
  ];

  const destinationPovoados: Destination[] = [
    { name: 'Volta de cima', price: '50,00' },
    { name: 'Colônia', price: '45,00' },
    { name: 'Entroncamento de Sátiro Dias', price: '15,00' },
    { name: 'Ladeira do Tabuleiro', price: '20,00' },
    { name: 'Tapera', price: '35,00' },
    { name: 'Km 8', price: '30,00' },
    { name: 'Km 29', price: '30,00' },
    { name: 'Lagoa seca', price: '15,00' },
    { name: 'Camamun', price: '15,00' },
    { name: 'Botelho', price: '35,00' },
    { name: 'Formoso', price: '20,00' },
    { name: 'Juazeiro', price: '15,00' },
    { name: 'Cai duro', price: '20,00' },
  ];

  // Monitora o status da chamada no Firebase em tempo real
  useEffect(() => {
    if (!activeRequestId) return;

    const unsubscribe = onSnapshot(doc(db, "chamadas", activeRequestId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === 'aceito' && data.driver) {
          setCurrentDriver(data.driver);
          setRequestStatus('accepted');
        }
      }
    });

    return () => unsubscribe();
  }, [activeRequestId]);

  const filteredPovoados = destinationPovoados.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCities = destinationCities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startSearch = async (dest?: Destination) => {
    const destination = dest || { name: 'Giro Urbano', price: '8,00' };
    setSelectedDestination(destination);
    setRequestStatus('searching');

    try {
      // Cria a chamada no Firestore
      const docRef = await addDoc(collection(db, "chamadas"), {
        type: 'mototaxi',
        clientName: localStorage.getItem('user_name') || 'Cidadão Inhambupense',
        origin: 'Minha Localização',
        destination: destination.name,
        value: destination.price,
        status: 'pendente',
        createdAt: Date.now()
      });
      
      setActiveRequestId(docRef.id);
      console.log("AkiTen: Chamada enviada para nuvem!", docRef.id);
    } catch (error) {
      console.error("Erro ao enviar chamada:", error);
      alert("Erro ao conectar com a rede AkiTen. Verifique sua internet.");
      setRequestStatus('idle');
    }
  };

  const handleCancel = async () => {
    if (activeRequestId) {
      try {
        await deleteDoc(doc(db, "chamadas", activeRequestId));
      } catch (e) {}
    }
    setRequestStatus('idle');
    setActiveRequestId(null);
  };

  const handleBack = () => {
    if (requestStatus === 'selecting_povoado' || requestStatus === 'selecting_city') {
      setRequestStatus('idle');
      setSearchQuery('');
    } else if (requestStatus === 'searching') {
      handleCancel();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#050a1e] text-white shadow-2xl relative overflow-hidden font-inter">
      
      <div className="flex justify-between items-center p-6 pt-12 shrink-0">
        <button onClick={handleBack} className="p-2 bg-white/5 rounded-xl text-gray-400">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00d1a0]">AkiTen Mototaxi</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-white rounded-t-[48px] p-8 overflow-y-auto shadow-[0_-20px_50px_rgba(0,0,0,0.3)] min-h-0">
        
        {requestStatus === 'idle' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div>
              <h3 className="text-[#050a1e] text-2xl font-black italic">Com certeza!</h3>
              <p className="text-gray-400 text-sm mt-1 font-medium">Para onde vamos agora?</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => startSearch()} 
                className="w-full bg-[#050a1e] text-white p-6 rounded-[32px] flex items-center justify-between shadow-xl active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#00d1a0] rounded-2xl text-white group-hover:scale-110 transition-transform"><Bike size={24} /></div>
                  <div className="text-left">
                    <span className="text-lg font-black italic">Deslocamento Urbano</span>
                    <p className="text-[#00d1a0] text-[10px] font-black uppercase tracking-widest">Preço R$ 8,00</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-white/20" />
              </button>

              <button 
                onClick={() => { setRequestStatus('selecting_povoado'); setSearchQuery(''); }} 
                className="w-full bg-gray-50 border border-gray-100 text-[#050a1e] p-6 rounded-[32px] flex items-center justify-between active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-[#2563eb] group-hover:scale-110 transition-transform"><Users size={24} /></div>
                  <div className="text-left">
                    <span className="text-lg font-black italic">Cidade para Povoado</span>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Ver Povoados</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-200" />
              </button>

              <button 
                onClick={() => { setRequestStatus('selecting_city'); setSearchQuery(''); }} 
                className="w-full bg-gray-50 border border-gray-100 text-[#050a1e] p-6 rounded-[32px] flex items-center justify-between active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-[#00d1a0] group-hover:scale-110 transition-transform"><Globe size={24} /></div>
                  <div className="text-left">
                    <span className="text-lg font-black italic">Para outras Cidades</span>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Viagens Regionais</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-200" />
              </button>
            </div>
          </div>
        )}

        {(requestStatus === 'selecting_povoado' || requestStatus === 'selecting_city') && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#050a1e] text-2xl font-black italic">
                  {requestStatus === 'selecting_povoado' ? 'Povoados' : 'Outras Cidades'}
                </h3>
                <p className="text-gray-400 text-sm mt-1 font-medium">Selecione ou busque um destino.</p>
              </div>
            </div>

            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00d1a0] transition-colors">
                <Search size={20} />
              </span>
              <input
                type="text"
                placeholder={requestStatus === 'selecting_povoado' ? "Buscar povoado..." : "Para qual cidade vamos?"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#00d1a0] py-5 pl-14 pr-4 rounded-[28px] text-[#050a1e] font-black outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-3 pb-24">
              {(requestStatus === 'selecting_povoado' ? filteredPovoados : filteredCities).map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => startSearch(dest)}
                  className="w-full p-5 bg-gray-50 rounded-[28px] flex items-center justify-between border-2 border-transparent hover:border-[#00d1a0] active:bg-emerald-50 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center ${requestStatus === 'selecting_povoado' ? 'text-blue-500' : 'text-emerald-500'} shadow-sm group-hover:scale-110 transition-transform`}>
                      {requestStatus === 'selecting_povoado' ? <MapPin size={20} /> : <Map size={20} />}
                    </div>
                    <span className="text-[#050a1e] font-black text-sm">{dest.name}</span>
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                    <span className={`font-black text-xs ${requestStatus === 'selecting_povoado' ? 'text-blue-600' : 'text-[#00d1a0]'}`}>
                      R$ {dest.price}
                    </span>
                  </div>
                </button>
              ))}

              {(searchQuery.length > 0) && (
                <button
                  onClick={() => startSearch({ name: searchQuery, price: 'A Combinar', isCustom: true })}
                  className="w-full p-6 bg-[#050a1e] text-white rounded-[32px] flex items-center justify-between shadow-xl active:scale-95 transition-all mt-6 animate-in zoom-in-95 duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#00d1a0] rounded-2xl flex items-center justify-center text-white">
                      <MessageCircle size={24} />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black block leading-none">
                        Solicitar para "{searchQuery}"
                      </span>
                      <p className="text-[#00d1a0] text-[10px] font-black uppercase tracking-widest mt-1">Negociar com Piloto</p>
                    </div>
                  </div>
                  <div className="bg-white/10 px-3 py-1 rounded-full">
                    <span className="text-white font-black text-[10px] uppercase">A Combinar</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {requestStatus === 'searching' && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-8 animate-in fade-in">
            <div className="relative">
              <div className="w-44 h-44 bg-emerald-50 rounded-full flex items-center justify-center animate-pulse">
                <Loader2 size={64} className="text-[#00d1a0] animate-spin" />
              </div>
              <div className="absolute top-2 right-2 p-5 bg-[#050a1e] text-[#00d1a0] rounded-[32px] shadow-2xl">
                <Bike size={36} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-[#050a1e] text-3xl font-black italic uppercase">Buscando piloto...</h3>
              <p className="text-gray-400 text-sm font-medium max-w-[250px] mx-auto leading-relaxed">
                Chamando todos os pilotos de Inhambupe. Na hora que um aceitar, avisamos aqui!
              </p>
            </div>
            <button 
              onClick={handleCancel} 
              className="px-8 py-3 bg-red-50 text-red-500 rounded-full font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
            >
              Cancelar Chamada
            </button>
          </div>
        )}

        {requestStatus === 'accepted' && currentDriver && (
          <div className="flex flex-col items-center animate-in zoom-in duration-500 py-4 text-center pb-20">
            <div className="w-36 h-36 bg-[#00d1a0] rounded-[48px] p-1.5 shadow-2xl mb-8 transform -rotate-3">
              {currentDriver.photo ? (
                <img src={currentDriver.photo} className="w-full h-full object-cover rounded-[44px] rotate-3 shadow-inner" alt="Piloto" />
              ) : (
                <div className="w-full h-full bg-[#050a1e] rounded-[44px] rotate-3 flex items-center justify-center text-[#00d1a0]">
                  <Bike size={48} />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-[#050a1e] text-3xl font-black uppercase italic">{currentDriver.name}</h3>
              <div className="flex items-center justify-center gap-1 text-amber-400">
                <Star size={16} fill="currentColor" />
                <span className="font-black text-lg">{currentDriver.rating || '5.0'}</span>
                <span className="text-gray-300 text-xs ml-1 font-bold">• {currentDriver.rides || '0'} Viagens</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-50 p-6 rounded-[32px] mt-8 flex justify-between items-center border border-gray-100">
              <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Destino</p>
                <p className="text-[#050a1e] font-black text-lg truncate max-w-[150px]">{selectedDestination?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</p>
                <p className={`${selectedDestination?.price === 'A Combinar' ? 'text-blue-500' : 'text-[#00d1a0]'} font-black text-lg`}>
                  {selectedDestination?.price === 'A Combinar' ? 'A Combinar' : `R$ ${selectedDestination?.price}`}
                </p>
              </div>
            </div>

            <div className="w-full space-y-4 mt-10">
              <button onClick={() => navigate('/')} className="w-full bg-[#050a1e] text-white py-6 rounded-[32px] font-black text-lg shadow-xl active:scale-95 transition-all">
                Concluir Viagem
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MototaxiScreen;
