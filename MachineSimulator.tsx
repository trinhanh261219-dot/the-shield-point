
import React, { useState } from 'react';
import { Camera, QrCode, CheckCircle2, Package, Loader2, ArrowRight, Zap } from 'lucide-react';
import { Order } from './types.ts';

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
      if (order) setScannedOrder(order);
      setScanning(false);
    }, 1500);
  };

  const handleCollect = () => {
    setIsDispensing(true);
    setTimeout(() => {
      if (scannedOrder) onCompleteOrder(scannedOrder.id);
      setIsDispensing(false);
      setScannedOrder(null);
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-950 rounded-[3rem] p-6 border-[10px] border-slate-900 shadow-2xl min-h-[600px] flex flex-col text-white">
      <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-500 fill-current" />
          <span className="font-black text-sm tracking-tighter">THE SHIELD POINT KIOSK</span>
        </div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>

      {!scannedOrder ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
          <div className="w-64 h-64 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center relative overflow-hidden shadow-inner">
            {scanning ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Đang quét mã...</p>
              </div>
            ) : (
              <div className="relative">
                <QrCode className="w-20 h-20 text-slate-700" />
                <Camera className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
            )}
            {scanning && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_indigo] animate-scan"></div>}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Vui lòng quét mã đơn hàng</h3>
            <p className="text-slate-500 text-xs">Đưa mã QR trên điện thoại vào camera phía trên.</p>
          </div>
          <div className="w-full space-y-2 pt-4">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Giả lập hành động quét:</p>
            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
              {orders.filter(o => o.status === 'pending').map(order => (
                <button key={order.id} onClick={() => handleSimulateScan(order.id)} className="w-full p-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold transition-all flex justify-between items-center border border-slate-800">
                  <span className="font-mono">MÃ: {order.id}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-500" />
                </button>
              ))}
              {orders.filter(o => o.status === 'pending').length === 0 && (
                <p className="text-slate-700 text-[10px] italic">Chưa có đơn hàng nào chờ nhận</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black">Xác nhận thành công</h3>
          <div className="bg-slate-900 w-full p-6 rounded-2xl text-left border border-slate-800 space-y-3">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Sản phẩm của bạn:</p>
            {scannedOrder.items.map(item => (
              <div key={item.id} className="text-sm font-bold flex justify-between">
                <span className="text-slate-200">{item.name}</span>
                <span className="text-indigo-400">x{item.quantity}</span>
              </div>
            ))}
          </div>
          <button onClick={handleCollect} disabled={isDispensing} className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
            {isDispensing ? <><Loader2 className="w-6 h-6 animate-spin" /> ĐANG NHẢ HÀNG...</> : <><Package className="w-6 h-6" /> NHẬN HÀNG NGAY</>}
          </button>
        </div>
      )}
      <div className="mt-10 p-4 border-t border-slate-900 text-center">
        <div className={`w-full h-2 rounded-full mb-3 transition-all duration-1000 ${isDispensing ? 'bg-indigo-500 shadow-[0_0_15px_indigo] animate-pulse' : 'bg-slate-800'}`}></div>
        <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">CỬA NHẬN HÀNG TỰ ĐỘNG</p>
      </div>
      <style>{`
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scan { animation: scan 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default MachineSimulator;
