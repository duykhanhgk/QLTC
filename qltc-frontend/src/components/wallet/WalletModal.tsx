import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Wallet, WalletPayload, WalletType } from '../../types/wallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WalletPayload) => void;
  wallet?: Wallet | null;
}

const WALLET_TYPES: { value: WalletType; label: string }[] = [
  { value: 'CASH', label: 'Tiền mặt' },
  { value: 'BANK', label: 'Tài khoản ngân hàng' },
  { value: 'CREDIT', label: 'Thẻ tín dụng' },
  { value: 'E_WALLET', label: 'Ví điện tử' },
  { value: 'SAVINGS', label: 'Sổ tiết kiệm' },
];

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onSubmit, wallet }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<WalletType>('CASH');
  const [balance, setBalance] = useState('');
  
  useEffect(() => {
    if (wallet && isOpen) {
      setName(wallet.name);
      setType(wallet.type);
      setBalance(wallet.balance.toString());
    } else if (isOpen) {
      setName('');
      setType('CASH');
      setBalance('');
    }
  }, [wallet, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      type,
      balance: Number(balance) || 0,
      currency: 'VND'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            {wallet ? 'Chỉnh sửa ví' : 'Thêm ví mới'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Tên ví</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005F9E] focus:border-[#005F9E] outline-none transition-all font-medium"
              placeholder="VD: Tiền mặt, Techcombank..."
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Loại ví</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as WalletType)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005F9E] focus:border-[#005F9E] outline-none transition-all font-medium"
            >
              {WALLET_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Số dư hiện tại</label>
            <div className="relative">
              <input 
                type="number" 
                required
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005F9E] focus:border-[#005F9E] outline-none transition-all font-medium"
                placeholder="0"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="text-slate-400 text-sm font-bold">VND</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#005F9E] hover:bg-[#004B7D] text-white font-bold rounded-lg shadow-md transition-colors"
            >
              {wallet ? 'Lưu thay đổi' : 'Tạo ví mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
