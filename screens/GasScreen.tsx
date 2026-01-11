
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Flame, Info, ChevronRight, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

interface GasBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
  color: string;
  borderColor: string;
}

const GasScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const brands: GasBrand[] = [
    { 
      id: 'todas', 
      name: 'Todas as Marcas', 
      logo: 'https://images.unsplash.com/photo-1584263347416-85a696b4eda7?auto=format&fit=crop&q=80&w=200&h=200',
      description: 'Ver distribuidores multimarcas',
      color: 'bg-gray-100',
      borderColor: 'border-gray-200'
    },
    { 
      id: 'supergasbras', 
      name: 'Supergásbras', 
      logo: 'https://logodownload.org/wp-content/uploads/2017/04/supergasbras-logo-1.png', 
      description: 'Energia para o seu dia a dia',
      color: 'bg-orange-50',
      borderColor: 'border-orange-100'
    },
    { 
      id: 'nacionalgas', 
      name: 'Nacional Gás', 
      logo: 'https://logodownload.org/wp-content/uploads/2019/11/nacional-gas-logo.png',
      description: 'A energia da nossa gente',
      color: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    { 
      id: 'ultragaz', 
      name: 'Ultragaz', 
      logo: 'https://media.licdn.com/dms/image/C4D0BAQF_Jp_v1_z_Xg/company-logo_200_200/0/1630572111553?e=2147483647&v=beta&t=yq0n0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0',
      description: 'Quem faz usa Ultragaz',
      color: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      id: 'liquigas', 
      name: 'Liquigás', 
      logo: 'https://logodownload.org/wp-content/uploads/2017/05/liquigas-logo.png',
      description: 'Sua escolha inteligente',
      color: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
  ];

  const handleBrandSelect = (brandName: string) => {
    setSelectedBrand(brandName);
    setIsSearching(true);

    // DISPARA CHAMADA GLOBAL (Para prestadores de GÁS)
    const callEvent = new CustomEvent('request_service', {
      detail: {
        id: Math.random().toString(36).substr(2, 9),
        type: 'gas',
        clientName: localStorage.getItem('user_name') || 'Morador Local',
        origin: 'Rua Principal (Centro)',
        destination: 'Residência do Cliente',
        value: '95,00'
      }
    });
    window.dispatchEvent(callEvent);

    setTimeout(() => {
      setIsSearching(false);
      alert(`Um entregador da ${brandName} aceitou seu pedido! Ele chegará em breve.`);
      navigate('/');
    }, 8000);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#1a1c1e] text-white shadow-2xl relative overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6 pt-10">
        <button 
          onClick={() => navigate('/')}
          className="p-2 bg-[#2d2f31] rounded-xl text-gray-400 hover:text-white transition"
          disabled={isSearching}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Entrega de Gás</h2>
        <div className="w-10"></div>
      </div>

      {isSearching ? (
        <div className="flex-1 bg-white rounded-t-[40px] flex flex-col items-center justify-center p-12 text-center space-y-6">
           <div className="relative">
              <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <Loader2 size={48} className="text-red-500 animate-spin" />
              </div>
              <div className="absolute -top-2 -right-2 p-3 bg-red-500 text-white rounded-full shadow-lg">
                <Flame size={24} />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[#1a1c1e] text-2xl font-bold">Buscando Entregador...</h3>
              <p className="text-gray-400 text-sm">Estamos avisando os distribuidores da marca {selectedBrand} em Inhambupe.</p>
            </div>
            <button onClick={() => setIsSearching(false)} className="text-red-500 font-bold uppercase text-xs tracking-widest mt-8">
              Cancelar Pedido
            </button>
        </div>
      ) : (
        <>
          <div className="px-8 pb-8 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="p-4 bg-red-500/10 rounded-2xl text-red-500">
              <Flame size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Distribuidoras</h1>
              <p className="text-gray-400 text-sm">Preço médio: R$ 95,00</p>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-t-[40px] p-8 space-y-6 overflow-y-auto no-scrollbar">
            <div className="space-y-4">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleBrandSelect(brand.name)}
                  className={`w-full ${brand.color} border ${brand.borderColor} p-4 rounded-[32px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-sm overflow-hidden border border-gray-100">
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${brand.name}&background=f3f4f6&color=6b7280&bold=true`;
                        }}
                      />
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-black text-[#1a1c1e]">{brand.name}</span>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Toque para pedir</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GasScreen;
