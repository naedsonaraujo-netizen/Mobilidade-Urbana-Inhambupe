
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Power, Wallet, Plus, Bell, History, Settings, ShieldCheck, Star, LogOut, PhoneIncoming, X, Check, Timer, AlertCircle } from 'lucide-react';

interface IncomingCall {
  id: string;
  type: 'mototaxi' | 'gas';
  clientName: string;
  origin: string;
  destination: string;
  value: string;
}

const ServerDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [userName, setUserName] = useState('Profissional');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [credits, setCredits] = useState(25);
  const [serverCategory, setServerCategory] = useState<string | null>(null);
  
  // Estados da Chamada
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [callTimer, setCallTimer] = useState(60);
  const [showTimeoutNotice, setShowTimeoutNotice] = useState(false);
  
  const timerRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<any>(null);

  useEffect(() => {
    setUserName(localStorage.getItem('user_name') || 'Profissional');
    setUserPhoto(localStorage.getItem('temp_user_photo'));
    const category = localStorage.getItem('server_service');
    setServerCategory(category);
    setIsOnline(localStorage.getItem('server_online') === 'true');

    const handleGlobalCall = (e: any) => {
      const callData = e.detail as IncomingCall;
      const myCategory = localStorage.getItem('server_service');
      const onlineStatus = localStorage.getItem('server_online') === 'true';

      // Lógica de Categoria: 'mototaxista' recebe 'mototaxi', 'distribuidor_gas' recebe 'gas'
      if (onlineStatus && myCategory && myCategory.includes(callData.type)) {
        triggerCall(callData);
      }
    };

    window.addEventListener('request_service', handleGlobalCall);
    return () => {
      window.removeEventListener('request_service', handleGlobalCall);
      stopSound();
    };
  }, []);

  // Função para simular som de telefone (Beep rítmico)
  const startSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (oscillatorRef.current) clearInterval(oscillatorRef.current);

      const playTone = () => {
        if (!audioCtxRef.current) return;
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, audioCtxRef.current.currentTime + 0.4);
        
        gain.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.4);
      };

      playTone();
      oscillatorRef.current = setInterval(playTone, 1500);
    } catch (e) {
      console.error("Erro ao iniciar som", e);
    }
  };

  const stopSound = () => {
    if (oscillatorRef.current) {
      clearInterval(oscillatorRef.current);
      oscillatorRef.current = null;
    }
    if ('vibrate' in navigator) navigator.vibrate(0);
  };

  const triggerCall = (call: IncomingCall) => {
    setIncomingCall(call);
    setCallTimer(60);
    setShowTimeoutNotice(false);
    startSound();

    if ('vibrate' in navigator) {
      navigator.vibrate([1000, 500, 1000, 500, 1000]);
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCallTimer((prev) => {
        if (prev <= 1) {
          handleCallTimeout();
          return 0;
        }
        if (prev % 4 === 0 && 'vibrate' in navigator) {
          navigator.vibrate([1000, 500]);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCallTimeout = () => {
    stopSound();
    if (timerRef.current) clearInterval(timerRef.current);
    setIncomingCall(null);
    setShowTimeoutNotice(true);
    setTimeout(() => setShowTimeoutNotice(false), 8000);
  };

  const acceptCall = () => {
    if (!incomingCall) return;

    stopSound();
    if (timerRef.current) clearInterval(timerRef.current);

    const clientOrigin = incomingCall.origin;
    const clientName = incomingCall.clientName;

    // Redirecionamento para o Google Maps com o endereço de ORIGEM do cliente
    // Adicionamos "Inhambupe, BA" para garantir que a busca seja local
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clientOrigin + ', Inhambupe, BA')}`;
    
    alert(`Chamada de ${clientName} aceita!\n\nAbrindo localização do cliente no Google Maps.`);
    
    // Abre o Google Maps em uma nova aba (no celular isso abre o App nativo)
    window.open(mapsUrl, '_blank');

    setIncomingCall(null);
    setCredits(prev => Math.max(0, prev - 1));
  };

  const declineCall = () => {
    stopSound();
    if (timerRef.current) clearInterval(timerRef.current);
    setIncomingCall(null);
  };

  const toggleAvailability = () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    localStorage.setItem('server_online', String(nextStatus));
    if (!nextStatus) stopSound();
  };

  const handleLogout = () => {
    if (confirm("Deseja realmente sair da sua conta?")) {
      stopSound();
      localStorage.removeItem('is_logged_in');
      localStorage.removeItem('server_online');
      navigate('/', { replace: true });
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#0a1128] text-white shadow-2xl relative overflow-hidden">
      
      {/* TELA DE CHAMADA RECEBIDA */}
      {incomingCall && (
        <div className="absolute inset-0 z-[100] bg-[#0a1128] flex flex-col items-center justify-between p-12 animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center gap-6 mt-12">
            <div className="relative">
              <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center animate-ping absolute inset-0"></div>
              <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center relative shadow-2xl border-4 border-white/10">
                <PhoneIncoming size={48} className="text-white animate-bounce" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-3">Nova Chamada de Serviço</p>
              <h1 className="text-4xl font-black mb-2">{incomingCall.clientName}</h1>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 py-2 px-5 rounded-full border border-orange-500/30">
                <Timer size={18} className="text-orange-500" />
                <span className="text-sm font-black text-orange-400">Expira em {callTimer}s</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-5 backdrop-blur-xl">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipo de Serviço</span>
              <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase">
                {incomingCall.type}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Local de Busca (Origem)</p>
              <p className="font-bold text-xl text-white">{incomingCall.origin}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Destino Final</p>
              <p className="font-bold text-lg text-blue-300">{incomingCall.destination}</p>
            </div>
            <div className="pt-5 border-t border-white/10 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Valor do Ganho</p>
                <p className="text-3xl font-black text-emerald-400">R$ {incomingCall.value}</p>
              </div>
            </div>
          </div>

          <div className="w-full flex gap-8 mb-12">
            <button 
              onClick={declineCall}
              className="flex-1 h-24 bg-red-500 rounded-[32px] flex items-center justify-center shadow-lg shadow-red-900/40 active:scale-90 transition-transform"
            >
              <X size={40} strokeWidth={3} />
            </button>
            <button 
              onClick={acceptCall}
              className="flex-1 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center shadow-lg shadow-emerald-900/40 active:scale-90 transition-transform"
            >
              <Check size={40} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICAÇÃO DE TIMEOUT */}
      {showTimeoutNotice && (
        <div className="absolute top-10 left-6 right-6 z-[110] bg-[#c2410c] p-6 rounded-[24px] shadow-2xl flex items-center gap-5 animate-in slide-in-from-top-full duration-500 border border-orange-400/30">
          <div className="bg-white/20 p-3 rounded-2xl">
            <AlertCircle size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black uppercase tracking-widest text-white">Chamada Cancelada</p>
            <p className="text-[11px] font-medium text-orange-100 leading-tight mt-1">
              O tempo de 60 segundos expirou sem aceite.
            </p>
          </div>
          <button onClick={() => setShowTimeoutNotice(false)} className="opacity-40 hover:opacity-100 p-2">
            <X size={20} />
          </button>
        </div>
      )}

      {/* DASHBOARD UI */}
      <div className="flex justify-between items-center p-6 pt-10">
        <button onClick={handleLogout} className="p-2 bg-red-500/10 rounded-xl text-red-400"><LogOut size={22} /></button>
        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-300">Painel Profissional</h2>
        <button onClick={() => navigate('/profile')} className="p-2 bg-blue-900/40 rounded-xl text-blue-300"><Settings size={22} /></button>
      </div>

      <div className="px-8 pb-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-400 to-indigo-600 p-0.5">
          <div className="w-full h-full rounded-[22px] bg-[#0a1128] flex items-center justify-center overflow-hidden">
            {userPhoto ? <img src={userPhoto} className="w-full h-full object-cover" /> : <User size={32} className="text-blue-400" />}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{userName}</h1>
          <span className="text-blue-300 text-[10px] font-bold uppercase tracking-widest border border-blue-500/30 px-2 py-0.5 rounded-md">
            {serverCategory?.replace('_', ' ') || 'Servidor'}
          </span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-[40px] p-8 space-y-6 overflow-y-auto no-scrollbar pb-24">
        
        {/* Status de Online */}
        <div className={`p-6 rounded-[32px] border transition-all ${isOnline ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-xs font-bold uppercase ${isOnline ? 'text-emerald-600' : 'text-gray-400'}`}>Status</p>
              <h3 className={`text-xl font-black ${isOnline ? 'text-emerald-800' : 'text-gray-600'}`}>{isOnline ? 'ESTOU ONLINE' : 'ESTOU OFFLINE'}</h3>
            </div>
            <button onClick={toggleAvailability} className={`relative w-16 h-8 rounded-full transition-colors ${isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isOnline ? 'translate-x-8' : 'translate-x-0'} flex items-center justify-center`}>
                <Power size={12} className={isOnline ? 'text-emerald-500' : 'text-gray-300'} />
              </div>
            </button>
          </div>
        </div>

        {/* Carteira */}
        <div className="bg-[#0a1128] p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-400 text-[10px] font-bold uppercase mb-1">Meus Créditos</p>
                <h4 className="text-white text-3xl font-black">{credits} <span className="text-blue-400 text-sm font-bold">créditos</span></h4>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400"><Wallet size={24} /></div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all">
              <Plus size={20} />
              Recarregar Créditos
            </button>
          </div>
        </div>

        <div className="text-center opacity-30 pt-4">
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Inhambupe Conectada • v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default ServerDashboardScreen;
