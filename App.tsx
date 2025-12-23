
import React, { useState, useMemo } from 'react';
import { PRODUCTS } from './constants.ts';
import { View, Product, CartItem, Order } from './types.ts';
import Layout from './Layout.tsx';
import MachineSimulator from './MachineSimulator.tsx';
import { getAIRecommendation } from './geminiService.ts';
import { 
  Search, Plus, Minus, Trash2, ArrowRight, 
  CheckCircle, ShoppingBag, X, Zap, History, Info, Sparkles, Send, Loader2
} from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info';
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // AI State
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const addToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    addToast(`Đã thêm ${quantity}x ${product.name} vào giỏ!`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    addToast('Đã xóa khỏi giỏ hàng', 'info');
  };

  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const checkout = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 8).toUpperCase(),
      items: [...cart],
      totalPrice,
      timestamp: Date.now(),
      qrCodeValue: `TSC-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now()}`,
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setCurrentView(View.ORDER_HISTORY);
    addToast('Đặt hàng thành công! Hãy tới máy để quét mã.', 'success');
  };

  const handleAiAsk = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    const response = await getAIRecommendation(aiInput);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  const completeOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'collected' } : o));
    addToast('Nhận hàng thành công!', 'success');
  };

  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout currentView={currentView} setView={setCurrentView} cartCount={cart.reduce((a, b) => a + b.quantity, 0)}>
      {/* Toast System */}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 animate-bounce-in pointer-events-auto ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-slate-900 border-slate-800 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        ))}
      </div>

      {currentView === View.HOME && (
        <div className="space-y-16 animate-in fade-in duration-700">
          <section className="relative h-[500px] rounded-[3rem] overflow-hidden bg-slate-900 group">
            <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200" alt="Hero" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">THE SHIELD POINT</h2>
              <p className="text-slate-300 max-w-xl mb-10 text-lg">Đặt hàng online - Quét mã tại máy - Nhận hàng tức thì.</p>
              <button onClick={() => setCurrentView(View.CATALOG)} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 flex items-center gap-2">
                Xem sản phẩm <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </section>

          {/* AI Consultant Section */}
          <section className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-black uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" /> Trợ lý AI Thông Minh
                </div>
                <h2 className="text-4xl font-black">Bạn cần tư vấn loại nào?</h2>
                <p className="text-slate-400">Hãy mô tả nhu cầu hoặc phong cách của bạn, AI sẽ đề xuất sản phẩm hoàn hảo nhất từ danh mục của chúng tôi.</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 flex flex-col min-h-[300px]">
                <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-[200px] pr-2">
                  {aiResponse ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed bg-slate-700/50 p-4 rounded-2xl rounded-tl-none">
                          {aiResponse}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 text-sm italic mt-10">Ví dụ: "Tôi muốn tìm loại mỏng nhất" hoặc "Loại nào giúp kéo dài thời gian?"</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={aiInput} 
                    onChange={e => setAiInput(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && handleAiAsk()}
                    placeholder="Nhập câu hỏi của bạn..." 
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-indigo-500"
                  />
                  <button onClick={handleAiAsk} disabled={isAiLoading} className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-xl transition-all disabled:opacity-50">
                    {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {currentView === View.CATALOG && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-black text-slate-900">Sản phẩm</h2>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm kiếm sản phẩm..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 ring-indigo-500 outline-none shadow-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-2">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{product.brand}</p>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight flex-1">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-2xl font-black text-slate-900">{product.price.toLocaleString()}đ</p>
                    <button onClick={() => addToCart(product)} className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all active:scale-90">
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentView === View.CART && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-4">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-indigo-600" /> Giỏ hàng
          </h2>
          {cart.length > 0 ? (
            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl">
              <div className="p-6 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                      <p className="text-indigo-600 font-black">{item.price.toLocaleString()}đ</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-200 rounded-md"><Minus className="w-4 h-4" /></button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-200 rounded-md"><Plus className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-slate-900 text-white space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Tổng cộng</span>
                  <span className="text-3xl font-black">{totalPrice.toLocaleString()}đ</span>
                </div>
                <button onClick={checkout} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all shadow-lg">
                  XÁC NHẬN THANH TOÁN
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
              <p className="text-slate-400 font-bold">Giỏ hàng của bạn đang trống</p>
            </div>
          )}
        </div>
      )}

      {currentView === View.ORDER_HISTORY && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-left-4">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <History className="w-8 h-8 text-indigo-600" /> Đơn hàng của bạn
          </h2>
          {orders.map(order => (
            <div key={order.id} className={`bg-white p-6 rounded-[2rem] border-2 transition-all ${order.status === 'collected' ? 'border-slate-100 opacity-60' : 'border-indigo-600 shadow-xl'}`}>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl relative shrink-0">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(order.qrCodeValue)}`} alt="QR" className="w-32 h-32" />
                  {order.status === 'collected' && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">MÃ ĐƠN HÀNG</p>
                      <h4 className="text-xl font-black text-slate-900">{order.id}</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'pending' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {order.status === 'pending' ? 'Sẵn sàng quét' : 'Đã nhận'}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-indigo-600">{order.totalPrice.toLocaleString()}đ</p>
                  {order.status === 'pending' && (
                    <button onClick={() => setCurrentView(View.MACHINE_SIMULATOR)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
                      Tới máy nhận hàng <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
               <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
               <p className="text-slate-400 font-bold">Chưa có lịch sử giao dịch</p>
            </div>
          )}
        </div>
      )}

      {currentView === View.MACHINE_SIMULATOR && (
        <MachineSimulator orders={orders} onCompleteOrder={completeOrder} />
      )}
    </Layout>
  );
};

export default App;
