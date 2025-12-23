
import React from 'react';
import { View } from '../types';
import { ShoppingBag, History, Home, Box, Smartphone, Zap, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, cartCount }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-morphism border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView(View.HOME)}
          >
            <div className="bg-slate-900 p-2.5 rounded-2xl group-hover:bg-indigo-600 transition-all duration-500 shadow-lg group-hover:rotate-6">
              <Shield className="text-white w-6 h-6 fill-current" />
            </div>
            <div className="flex flex-col">
               <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600 leading-tight uppercase tracking-tighter">
                THE SHIELD POINT
              </h1>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">SECURE SERVICE</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {['Trang chủ', 'Sản phẩm', 'Lịch sử'].map((label, idx) => {
              const views = [View.HOME, View.CATALOG, View.ORDER_HISTORY];
              const isActive = currentView === views[idx];
              return (
                <button 
                  key={label}
                  onClick={() => setView(views[idx])}
                  className={`relative py-2 transition-all font-bold text-sm tracking-wide ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {label}
                  {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"></span>}
                </button>
              );
            })}
            <button 
              onClick={() => setView(View.MACHINE_SIMULATOR)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              Tại máy bán hàng
            </button>
          </nav>

          <button 
            onClick={() => setView(View.CART)}
            className={`group relative p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all ${cartCount > 0 ? 'animate-pulse-short' : ''}`}
          >
            <ShoppingBag className="w-6 h-6 text-slate-700 group-hover:text-indigo-600 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-xl border-4 border-white shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {children}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-slate-950/90 backdrop-blur-2xl rounded-[2rem] border border-white/10 px-8 flex justify-between items-center z-50 shadow-2xl">
        <button onClick={() => setView(View.HOME)} className={`flex flex-col items-center gap-1.5 transition-all ${currentView === View.HOME ? 'text-indigo-400' : 'text-slate-500'}`}>
          <Home className={`w-6 h-6 ${currentView === View.HOME ? 'fill-current' : ''}`} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Home</span>
        </button>
        <button onClick={() => setView(View.CATALOG)} className={`flex flex-col items-center gap-1.5 transition-all ${currentView === View.CATALOG ? 'text-indigo-400' : 'text-slate-500'}`}>
          <Box className={`w-6 h-6 ${currentView === View.CATALOG ? 'fill-current' : ''}`} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Shop</span>
        </button>
        <button onClick={() => setView(View.CART)} className={`relative flex flex-col items-center gap-1.5 transition-all ${currentView === View.CART ? 'text-indigo-400' : 'text-slate-500'}`}>
          <ShoppingBag className={`w-6 h-6 ${currentView === View.CART ? 'fill-current' : ''}`} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Cart</span>
          {cartCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>}
        </button>
        <button onClick={() => setView(View.ORDER_HISTORY)} className={`flex flex-col items-center gap-1.5 transition-all ${currentView === View.ORDER_HISTORY ? 'text-indigo-400' : 'text-slate-500'}`}>
          <History className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Orders</span>
        </button>
      </nav>
      
      <style>{`
        @keyframes pulse-short {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-pulse-short {
          animation: pulse-short 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Layout;
