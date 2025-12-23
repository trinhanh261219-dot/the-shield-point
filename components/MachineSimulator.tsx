
import React, { useState } from 'react';
import { Camera, QrCode, CheckCircle2, Package, Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Order } from '../types';

interface MachineSimulatorProps {
  orders: Order[];
  onCompleteOrder: (orderId: string) => void;
}

const MachineSimulator: React.FC<MachineSimulatorProps> = ({ orders, onCompleteOrder }) => {
  const [scanning, setScanning] = useState(false);
  const [scannedOrder, setScannedOrder] = useState<Order | null>(null);
  const [isDispensing, setIsDispensing] = useState(false);

  const handleSimulateScan = (orderId: string) => {
    setScanning(true);
    setTimeout(() => {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setScannedOrder(order);
      }
      setScanning(false);
    }, 2000);
  };

  const handleCollect = () => {
    setIsDispensing(true);
    setTimeout(() => {
      if (scannedOrder) {
        onCompleteOrder(scannedOrder.id);
      }
      setIsDispensing(false);
      setScannedOrder(null);
    }, 3500);
  };

  return (
    <div className="max-w-lg mx-auto bg-slate-950 rounded-[3rem] p-4 border-[12px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden min-h-[700px] flex flex-col text-white relative">
      {/* Decorative Lights */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_indigo]"></div>
      
      {/* Kiosk Header */}
      <div className="p-8 border-b border-slate-900 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
               <Zap className="w-4 h-4 text-white fill-current" />
            </div>
            <span className="font-black tracking-tighter text-xl uppercase">THE SHIELD POINT <span className="text-indigo-500 text-[10px] block font-medium tracking-normal">AUTOMATED DISPENSER</span></span>
         </div>
         <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Encrypted</span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {!scannedOrder ? (
          <>
            <div className="w-full aspect-square max-w-[280px] bg-slate-900 rounded-[2.5rem] mb-10 flex items-center justify-center relative overflow-hidden border border-slate-800 group cursor-pointer shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5"></div>
               {scanning ? (
                 <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500">
                    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                    <p className="text-indigo-400 font-black tracking-widest uppercase text-[10px]">Đang đọc dữ liệu mã QR...</p>
                 </div>
               ) : (
                 <div className="relative p-8 bg-white rounded-3xl">
                    <QrCode className="w-24 h-24 text-slate-100" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Camera className="w-10 h-10 text-indigo-500 animate-pulse" />
                    </div>
                 </div>
               )}
               {scanning && (
                 <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_20px_indigo] animate-scan"></div>
               )}
            </div>
            
            <h3 className="text-2xl font-black mb-3 tracking-tight">Vui lòng quét mã đơn hàng</h3>
            <p className="text-slate-500 text-sm mb-10 max-w-[240px]">
              Đưa màn hình điện thoại vào camera phía trên để nhận diện.
            </p>

            <div className="w-full space-y-4">
              <div className="flex items-center gap-4 text-[10px] text-slate-700 uppercase tracking-widest font-black">
                 <div className="h-px bg-slate-900 flex-1"></div>
                 <span>Giả lập tại máy</span>
                 <div className="h-px bg-slate-900 flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {orders.filter(o => o.status === 'pending').length > 0 ? (
                  orders.filter(o => o.status === 'pending').map(order => (
                    <button
                      key={order.id}
                      onClick={() => handleSimulateScan(order.id)}
                      className="w-full py-4 px-5 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-2xl text-sm font-bold transition-all flex justify-between items-center group active:scale-95"
                    >
                      <span className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <QrCode className="w-4 h-4 text-indigo-500" />
                         </div>
                         <span className="font-mono text-xs text-slate-400">ORDER {order.id}</span>
                      </span>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded text-white font-black">{order.items.reduce((a,b)=>a+b.quantity,0)} PCS</span>
                         <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 rounded-[2rem] border-2 border-dashed border-slate-900 text-slate-700 text-sm font-bold flex flex-col items-center gap-4">
                    <p>Không tìm thấy đơn hàng chờ quét</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="mb-8 flex justify-center">
               <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
               </div>
            </div>
            
            <div className="space-y-1 mb-8">
               <h3 className="text-3xl font-black tracking-tight">Đơn hàng hợp lệ!</h3>
               <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">THIẾT BỊ: {scannedOrder.id}</p>
            </div>
            
            <div className="bg-slate-900 rounded-[2rem] p-6 mb-10 border border-slate-800 text-left">
              <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-4 flex justify-between">
                 <span>Chi tiết kiện hàng</span>
                 <span className="text-indigo-400">TỔNG: {scannedOrder.items.reduce((a,b)=>a+b.quantity, 0)}</span>
              </p>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {scannedOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b border-slate-800/50 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-xs font-black text-indigo-400 border border-white/10">
                          {item.quantity}
                       </div>
                       <span className="text-sm font-bold text-slate-200 truncate">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCollect}
              disabled={isDispensing}
              className={`w-full py-6 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-2xl ${
                isDispensing ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isDispensing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  ĐANG GIẢI PHÓNG HÀNG...
                </>
              ) : (
                <>NHẬN HÀNG <Package className="w-6 h-6" /></>
              )}
            </button>
          </div>
        )}
      </div>
      
      <div className="p-8 bg-slate-900 border-t border-slate-800 flex flex-col items-center justify-center gap-3">
        <div className={`w-full h-3 rounded-full transition-all duration-1000 ${isDispensing ? 'bg-indigo-500 shadow-[0_0_15px_indigo] animate-pulse' : 'bg-slate-800'}`}></div>
        <div className="flex items-center gap-2">
           <p className="text-[10px] text-slate-700 uppercase font-black tracking-[0.4em]">CỬA TRẢ HÀNG</p>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default MachineSimulator;
