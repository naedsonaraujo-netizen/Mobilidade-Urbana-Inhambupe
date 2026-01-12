
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Wallet, Check, Copy, Camera, Send, ShieldCheck, Info, Sparkles, Bike, Car, Flame } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  amount: number;
  price: string;
  isFree?: boolean;
}

const RefillCreditsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isFreeUsed, setIsFreeUsed] = useState(false);
  const [step, setStep] = useState<'selection' | 'payment'>('selection');
  const [proof, setProof] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('mototaxista');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsFreeUsed(localStorage.getItem('server_free_used') === 'true');
    const savedCategory = localStorage.getItem('server_service') || 'mototaxista';
    setCategory(savedCategory);
  }, []);

  const getPackagesByCategory = (): Package[] => {
    const freeBase = { id: 'free', name: 'Degustação AkiTen', amount: 3, price: 'Grátis', isFree: true };
    
    switch (category) {
      case 'motorista':
        return [
          { ...freeBase, amount: 2, name: 'Degustação Motorista' },
          { id: 'm10', name: 'Plano City', amount: 10, price: 'R$ 25,00' },
          { id: 'm25', name: 'Plano Estrada', amount: 25, price: 'R$ 55,00' },
          { id: 'm60', name: 'Plano Regional', amount: 60, price: 'R$ 120,00' },
        ];
      case 'distribuidor_gas':
        return [
          { ...freeBase, amount: 5, name: 'Degustação Gás' },
          { id: 'g15', name: 'Lote Pequeno', amount: 15, price: 'R$ 30,00' },
          { id: 'g40', name: 'Lote Médio', amount: 40, price: 'R$ 70,00' },
          { id: 'g100', name: 'Lote Distribuidor', amount: 100, price: 'R$ 150,00' },
        ];
      case 'mototaxista':
      default:
        return [
          freeBase,
          { id: 'p15', name: 'Plano Bronze', amount: 15, price: 'R$ 15,00' },
          { id: 'p40', name: 'Plano Prata', amount: 40, price: 'R$ 35,00' },
          { id: 'p100', name: 'Plano Ouro', amount: 100, price: 'R$ 80,00' },
        ];
    }
  };

  const currentPackages = getPackagesByCategory();

  const getCategoryDetails = () => {
    switch (category) {
      case 'motorista': return { icon: <Car size={20} />, label: 'Viagens', color: 'text-indigo-500' };
      case 'distribuidor_gas': return { icon: <Flame size={20} />, label: 'Entregas', color: 'text-red-500' };
      default: return { icon: <Bike size={20} />, label: 'Corridas', color: 'text-emerald-500' };
    }
  };

  const details = getCategoryDetails();

  const handleCopyPix = () => {
    navigator.clipboard.writeText('75999685162');
    alert('Chave PIX copiada! Com certeza já está na sua área de transferência.');
  };

  const handleSelect = (pkg: Package) => {
    if (pkg.isFree) {
      if (isFreeUsed) {
        alert("Com certeza você já aproveitou sua experiência grátis! Escolha um dos nossos planos.");
        return;
      }
      const currentCredits = parseInt(localStorage.getItem('server_credits') || '0');
      localStorage.setItem('server_credits', (currentCredits + pkg.amount).toString());
      localStorage.setItem('server_free_used', 'true');
      alert(`AkiTen informa: Seus ${pkg.amount} créditos de experiência foram adicionados! Aproveite.`);
      navigate('/server-dashboard');
      return;
    }
    setSelectedPackage(pkg);
    setStep('payment');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = () => {
    if (!proof) {
      alert("Por favor, anexe o comprovante para que possamos validar.");
      return;
    }
    const currentTrustCredits = parseInt(localStorage.getItem('server_trust_credits') || '0');
    localStorage.setItem('server_trust_credits', (currentTrustCredits + 2).toString());
    alert("Comprovante enviado! Na hora! \n\nLiberamos 2 CRÉDITOS DE CONFIANÇA imediatos para você continuar trabalhando. O restante cairá após a validação do administrador!");
    navigate('/server-dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#050a1e] text-white shadow-2xl relative overflow-hidden font-inter">
      
      <div className="flex justify-between items-center p-6 pt-12">
        <button 
          onClick={() => step === 'payment' ? setStep('selection') : navigate('/server-dashboard')}
          className="p-2 bg-white/5 rounded-xl text-gray-400"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00d1a0]">AkiTen Recarga</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-white rounded-t-[48px] p-8 space-y-6 overflow-y-auto no-scrollbar shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        
        {step === 'selection' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#050a1e] text-2xl font-black">Turbine sua conta</h3>
                <p className="text-gray-400 text-sm mt-1 font-medium">Planos exclusivos para {category.replace('_', ' ')}.</p>
              </div>
              <div className={`p-4 rounded-2xl bg-gray-50 ${details.color}`}>
                {details.icon}
              </div>
            </div>

            <div className="space-y-3">
              {currentPackages.map((pkg) => {
                const isFreeDisabled = pkg.isFree && isFreeUsed;
                return (
                  <button
                    key={pkg.id}
                    disabled={isFreeDisabled}
                    onClick={() => handleSelect(pkg)}
                    className={`w-full p-5 rounded-[28px] border-2 transition-all flex items-center justify-between group active:scale-[0.98] ${
                      isFreeDisabled 
                      ? 'bg-gray-50 border-gray-100 opacity-50 grayscale cursor-not-allowed' 
                      : pkg.isFree 
                        ? 'bg-emerald-50 border-emerald-100 hover:border-[#00d1a0]' 
                        : 'bg-gray-50 border-transparent hover:border-[#00d1a0]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${pkg.isFree ? 'bg-[#00d1a0] text-white' : 'bg-[#050a1e] text-[#00d1a0]'}`}>
                        <Wallet size={20} />
                      </div>
                      <div className="text-left">
                        <span className={`text-sm font-black uppercase tracking-tight ${isFreeDisabled ? 'text-gray-400' : 'text-[#050a1e]'}`}>
                          {pkg.name}
                        </span>
                        <p className="text-xs font-bold text-gray-400">{pkg.amount} {details.label}</p>
                      </div>
                    </div>
                    <div className={`font-black text-lg ${pkg.isFree ? 'text-[#00d1a0]' : 'text-[#050a1e]'}`}>
                      {pkg.price}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="p-5 bg-blue-50 rounded-[28px] border border-blue-100 flex gap-3">
              <Sparkles className="text-blue-500 shrink-0" size={20} />
              <p className="text-blue-900 text-[11px] font-bold leading-relaxed uppercase italic tracking-tighter">
                Novidade: Ao enviar o comprovante, liberamos 2 {details.label.toLowerCase()} de confiança na hora!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h3 className="text-[#050a1e] text-2xl font-black">Pagamento Seguro</h3>
              <p className="text-gray-400 text-sm mt-1 font-medium">PIX para {selectedPackage?.name}</p>
            </div>

            <div className="bg-[#050a1e] p-6 rounded-[32px] text-white space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#00d1a0] text-[10px] font-black uppercase mb-1">Valor a pagar</p>
                  <p className="text-2xl font-black">{selectedPackage?.price}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    Carga: {selectedPackage?.amount} {details.label}
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl text-[#00d1a0]">
                   <ShieldCheck size={24} />
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Chave PIX (Telefone)</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-black tracking-widest">75999685162</p>
                  <button onClick={handleCopyPix} className="p-2 text-[#00d1a0] hover:bg-white/10 rounded-xl transition-colors">
                    <Copy size={20} />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Titular: Naedson Messias Araujo da Conceição</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Anexar Comprovante</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-video rounded-[32px] border-4 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                  proof ? 'border-[#00d1a0]' : 'border-gray-100 hover:border-emerald-200'
                }`}
              >
                {proof ? (
                  <img src={proof} alt="Comprovante" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <Camera size={40} />
                    <span className="text-xs font-black uppercase tracking-widest">Toque para anexar</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            <button
              onClick={handleSubmitProof}
              className="w-full bg-[#050a1e] text-white py-6 rounded-[32px] font-black text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Confirmar Envio
              <Send size={20} className="text-[#00d1a0]" />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default RefillCreditsScreen;
