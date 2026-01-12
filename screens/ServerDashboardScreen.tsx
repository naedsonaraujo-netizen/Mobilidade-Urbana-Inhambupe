
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Wallet, Settings, PhoneIncoming, X, Check, Timer, AlertCircle, Sparkles, Bike, Car, Flame } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

interface IncomingCall {
  id: string;
  type: 'mototaxi' | 'gas' | 'motorista';
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
  const [credits, setCredits] = useState(0);
  const [trustCredits, setTrustCredits] = useState(0);
  const [serverCategory, setServerCategory] = useState<string | null>(null);
  
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [callTimer, setCallTimer] = useState(60);
  
  const timerRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<any>(null);

  useEffect(() => {
    setUserName(localStorage.getItem('user_name') || 'Profissional');
    setUserPhoto(localStorage.getItem('temp_user_photo'));
    const category = localStorage.getItem('server_service');
    setServerCategory(category);
    setIsOnline(localStorage.getItem('server_online') === 'true');
    
    const savedCredits = localStorage.getItem('server_credits');
    const savedTrust = localStorage.getItem('server_trust_credits');
    
    setCredits(savedCredits ? parseInt(savedCredits) : 0);
    setTrustCredits(savedTrust ? parseInt(savedTrust) : 0);

    // Mapeamento de categorias
    const typeMap: Record<string, string> = {
      'mototaxista': 'mototaxi',
      'distribuidor_gas': 'gas',
      'motorista': 'motorista'
    };

    const myService = category ? typeMap[category] : null;

    // Escuta o Firestore para chamadas pendentes da minha categoria
    let unsubscribeFirestore: any = null;

    if (localStorage.getItem('server_online') === 'true' && myService) {
      const q = query(
        collection(db, "chamadas"), 
        where("type", "==", myService),
        where("status", "==", "pendente")
      );

      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const callData = { id: change.doc.id, ...change.doc.data() } as IncomingCall;
            
            // Verifica créditos
            const currentCredits = parseInt(localStorage.getItem('server_credits') || '0');
            const currentTrust = parseInt(localStorage.getItem('server_trust_credits') || '0');

            if (currentCredits <= 0 && currentTrust <= 0) {
              setIsOnline(false);
              localStorage.setItem('server_online', 'false');
              alert("AkiTen informa: Sem créditos! Recarregue para receber chamadas.");
              return;
            }

            setIncomingCall(callData);
            setCallTimer(60);
            startSound();
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
              setCallTimer(p => {
                if (p <= 1) {
                  stopSound();
                  setIncomingCall(null);
                  return 0;
                }
                return p - 1;
              });
            }, 1000);
          }
          if (change.type === "removed") {
             if (incomingCall && change.doc.id === incomingCall.id) {
               stopSound();
               setIncomingCall(null);
             }
          }
        });
      });
    }

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      stopSound();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOnline]);

  const getCategoryMeta = () => {
    switch (serverCategory) {
      case 'motorista': return { label: 'Viagens', icon: <Car size={28} />, color: 'text-indigo-400' };
      case 'distribuidor_gas': return { label: 'Entregas', icon: <Flame size={28} />, color: 'text-red-400' };
      default: return { label: 'Corridas', icon: <Bike size={28} />, color: 'text-[#00d1a0]' };
    }
  };

  const meta = getCategoryMeta();

  const startSound = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playTone = () => {
      if (!audioCtxRef.current) return;
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.3);
    };
    oscillatorRef.current = setInterval(playTone, 1000);
  };

  const stopSound = () => { if (oscillatorRef.current) clearInterval(oscillatorRef.current); };

  const acceptCall = async () => {
    if (!incomingCall) return;
    stopSound();
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Desconta créditos
    if (credits > 0) {
      const newCredits = credits - 1;
      setCredits(newCredits);
      localStorage.setItem('server_credits', newCredits.toString());
    } else if (trustCredits > 0) {
      const newTrust = trustCredits - 1;
      setTrustCredits(newTrust);
      localStorage.setItem('server_trust_credits', newTrust.toString());
    }

    try {
      // Atualiza o Firestore para avisar o cliente
      await updateDoc(doc(db, "chamadas", incomingCall.id), {
        status: 'aceito',
        driver: {
          id: userName,
          name: userName,
          photo: userPhoto || '',
          rating: 4.9,
          rides: 1240
        }
      });

      // Abre o mapa
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(incomingCall.origin + ', Inhambupe, BA')}`;
      window.open(mapsUrl, '_blank');
      setIncomingCall(null);
    } catch (e) {
      console.error("Erro ao aceitar corrida:", e);
      alert("Com certeza a corrida já foi aceita por outro piloto!");
      setIncomingCall(null);
    }
  };

  const totalPossibleCredits = credits + trustCredits;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#050a1e] text-white shadow-2xl relative overflow-hidden font-inter">
      
      {incomingCall && (
        <div className="absolute inset-0 z-[100] bg-[#050a1e] flex flex-col items-center justify-between p-12 animate-in slide-in-from-bottom-full duration-500">
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="w-24 h-24 bg-[#00d1a0] rounded-[32px] flex items-center justify-center animate-bounce shadow-2xl shadow-emerald-500/20">
              <PhoneIncoming size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-black italic text-center uppercase tracking-tight">{incomingCall.clientName} solicita!</h1>
            <div className="bg-white/10 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <Timer size={16} className="text-[#00d1a0]" />
              <span className="text-sm font-black text-[#00d1a0]">Expira em {callTimer}s</span>
            </div>
          </div>

          <div className="w-full bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-6 shadow-inner">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Local de Encontro:</p>
              <p className="font-black text-xl text-white">{incomingCall.origin}</p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Para:</p>
              <p className="font-black text-white">{incomingCall.destination}</p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor da Corrida:</p>
              <p className="text-4xl font-black text-[#00d1a0]">R$ {incomingCall.value}</p>
            </div>
          </div>

          <div className="w-full flex gap-6 mb-8">
            <button onClick={() => { stopSound(); setIncomingCall(null); }} className="flex-1 h-24 bg-red-500 rounded-[32px] flex items-center justify-center shadow-lg active:scale-95 transition-transform">
              <X size={40} className="text-white" />
            </button>
            <button onClick={acceptCall} className="flex-1 h-24 bg-[#00d1a0] rounded-[32px] flex items-center justify-center shadow-lg active:scale-95 transition-transform">
              <Check size={40} className="text-white" />
            </button>
          </div>
        </div>
      )}

      <div className="p-6 pt-12 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#00d1a0] p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full rounded-[14px] bg-[#050a1e] flex items-center justify-center overflow-hidden">
               {userPhoto ? <img src={userPhoto} className="w-full h-full object-cover" /> : <User size={24} className="text-[#00d1a0]" />}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-black">{userName}</h2>
            <p className="text-[#00d1a0] text-[10px] font-black uppercase tracking-widest">{serverCategory?.replace('_', ' ') || 'Parceiro AkiTen'}</p>
          </div>
        </div>
        <button onClick={() => navigate('/profile')} className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-colors"><Settings size={22} /></button>
      </div>

      <div className="flex-1 bg-white rounded-t-[48px] p-8 space-y-6 overflow-y-auto no-scrollbar pb-24 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        
        {totalPossibleCredits === 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
            <AlertCircle className="text-amber-600 shrink-0" size={20} />
            <div>
              <p className="text-amber-900 text-xs font-bold uppercase tracking-tight">Saldo zerado</p>
              <p className="text-amber-700 text-[11px] font-medium leading-tight mt-1">
                Com certeza você precisa de créditos para receber chamadas. Recarregue agora!
              </p>
            </div>
          </div>
        )}

        <div className={`p-6 rounded-[32px] border-2 transition-all ${isOnline ? 'bg-emerald-50 border-[#00d1a0]' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-[10px] font-black uppercase ${isOnline ? 'text-[#00d1a0]' : 'text-gray-400'}`}>Painel AkiTen</p>
              <h3 className={`text-xl font-black ${isOnline ? 'text-emerald-900' : 'text-gray-600'}`}>{isOnline ? 'ESTOU ONLINE' : 'ESTOU OFFLINE'}</h3>
            </div>
            <button 
              onClick={() => {
                if (!isOnline && totalPossibleCredits <= 0) {
                  alert("Você precisa de créditos para ficar online!");
                  return;
                }
                const newStatus = !isOnline;
                setIsOnline(newStatus);
                localStorage.setItem('server_online', newStatus.toString());
              }} 
              className={`w-16 h-8 rounded-full relative transition-colors ${isOnline ? 'bg-[#00d1a0]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isOnline ? 'translate-x-8' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        <div className="bg-[#050a1e] p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center mb-6">
            <div>
              <p className="text-[#00d1a0] text-[10px] font-black uppercase mb-1">Saldo Total</p>
              <h4 className="text-white text-4xl font-black">{totalPossibleCredits} <span className="text-[#00d1a0] text-sm tracking-tighter uppercase font-bold">{meta.label}</span></h4>
              {trustCredits > 0 && (
                 <p className="text-gray-400 text-[9px] mt-1 font-bold uppercase tracking-widest">Incluindo {trustCredits} de confiança</p>
              )}
            </div>
            <div className={`p-4 bg-white/5 rounded-2xl ${meta.color}`}>{meta.icon}</div>
          </div>
          <button 
            onClick={() => navigate('/refill-credits')}
            className="w-full bg-[#00d1a0] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            Comprar {meta.label}
          </button>
        </div>

        <div className="pt-4">
          <h4 className="text-[#050a1e] font-black text-[10px] uppercase tracking-[0.2em] mb-4">Avisos Inhambupe</h4>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Como funciona a Confiança?</p>
               <p className="text-[#050a1e] text-[11px] font-medium leading-relaxed">
                 Com certeza a gente confia em você! Ao enviar o comprovante, liberamos 2 {meta.label.toLowerCase()} de confiança na hora para você não parar. Elas serão descontadas do seu pacote quando validarmos seu PIX.
               </p>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ServerDashboardScreen;
