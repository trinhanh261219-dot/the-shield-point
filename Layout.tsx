
import React from 'react';
import { View } from './types.ts';
import { ShoppingBag, History, Home, Box, Smartphone, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, cartCount }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 glass-morphism border-b border-slate-200 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(View.HOME)}>
          <div className="bg-slate-900 p-2 rounded-xl"><Shield className="text-white w-6 h-6 fill-current" /></div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">THE SHIELD POINT</h1>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => setView(View.HOME)} className={`font-bold text-sm transition-colors ${currentView === View.HOME ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Trang chủ</button>
          <button onClick={() => setView(View.CATALOG)} className={`font-bold text-sm transition-colors ${currentView === View.CATALOG ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Sản phẩm</button>
          <button onClick={() => setView(View.ORDER_HISTORY)} className={`font-bold text-sm transition-colors ${currentView === View.ORDER_HISTORY ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Lịch sử</button>
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={() => setView(View.MACHINE_SIMULATOR)} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
            <Smartphone className="w-4 h-4" /> Tại máy
          </button>
          <button onClick={() => setView(View.CART)} className="relative p-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
            <ShoppingBag className="w-6 h-6 text-slate-700" />
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce-in">{cartCount}</span>}
          </button>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
