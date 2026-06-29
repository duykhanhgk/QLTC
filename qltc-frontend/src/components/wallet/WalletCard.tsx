import React from 'react';
import { Wallet as WalletIcon, CreditCard, Landmark, Phone, PiggyBank, Edit2, Trash2 } from 'lucide-react';
import { Wallet, WalletType } from '../../types/wallet';
import { formatVND } from '../../utils/format';

interface WalletCardProps {
  wallet: Wallet;
  onEdit: (wallet: Wallet) => void;
  onDelete: (id: number) => void;
}

const getWalletIcon = (type: WalletType) => {
  switch (type) {
    case 'CASH': return <WalletIcon className="h-6 w-6" />;
    case 'BANK': return <Landmark className="h-6 w-6" />;
    case 'CREDIT': return <CreditCard className="h-6 w-6" />;
    case 'E_WALLET': return <Phone className="h-6 w-6" />;
    case 'SAVINGS': return <PiggyBank className="h-6 w-6" />;
    default: return <WalletIcon className="h-6 w-6" />;
  }
};

const getWalletColor = (type: WalletType) => {
  switch (type) {
    case 'CASH': return 'bg-emerald-500';
    case 'BANK': return 'bg-blue-600';
    case 'CREDIT': return 'bg-purple-600';
    case 'E_WALLET': return 'bg-orange-500';
    case 'SAVINGS': return 'bg-teal-600';
    default: return 'bg-slate-600';
  }
};

const getWalletLabel = (type: WalletType) => {
  switch (type) {
    case 'CASH': return 'Tiền mặt';
    case 'BANK': return 'Tài khoản ngân hàng';
    case 'CREDIT': return 'Thẻ tín dụng';
    case 'E_WALLET': return 'Ví điện tử';
    case 'SAVINGS': return 'Sổ tiết kiệm';
    default: return type;
  }
};

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, onEdit, onDelete }) => {
  const color = getWalletColor(wallet.type);
  
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-transform hover:-translate-y-1 ${color}`}>
      <div className="absolute right-0 top-0 opacity-10 translate-x-4 -translate-y-4">
        {getWalletIcon(wallet.type)}
      </div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            {getWalletIcon(wallet.type)}
          </div>
          <div>
            <h3 className="font-bold text-lg truncate max-w-[200px]">{wallet.name}</h3>
            <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
              {getWalletLabel(wallet.type)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(wallet)}
            className="p-1.5 bg-white/10 hover:bg-white/30 rounded-md transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(wallet.id)}
            className="p-1.5 bg-white/10 hover:bg-red-500/80 rounded-md transition-colors"
            title="Xóa ví"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-sm font-medium opacity-80 mb-1">Số dư hiện tại</p>
        <h2 className="text-3xl font-extrabold tracking-tight">
          {formatVND(wallet.balance)}
        </h2>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-xs opacity-90 relative z-10">
        <span>Tiền tệ: {wallet.currency}</span>
        {wallet.updatedAt && (
          <span>Cập nhật: {new Date(wallet.updatedAt).toLocaleDateString('vi-VN')}</span>
        )}
      </div>
    </div>
  );
};
