import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Coins, Wallet as WalletIcon } from 'lucide-react';
import { Wallet, WalletPayload } from '../types/wallet';
import { walletService } from '../services/walletService';
import { formatVND } from '../utils/format';
import { WalletCard } from '../components/wallet/WalletCard';
import { WalletModal } from '../components/wallet/WalletModal';

export const WalletPage: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      // In a real app, if the token is valid, it will fetch from backend
      // Since backend might not be fully linked with frontend login yet, we wrap in try-catch
      const data = await walletService.getWallets();
      setWallets(data);
      setError(null);
    } catch (err: any) {
      console.warn("Failed to fetch from API, using mock data for UI demo:", err);
      // Fallback to mock data if API is unreachable (for UI demonstration purposes)
      setWallets([
        { id: 1, name: 'Tiền mặt (Ví cá nhân)', type: 'CASH', balance: 5420000, currency: 'VND' },
        { id: 2, name: 'Ngân hàng Techcombank', type: 'BANK', balance: 42150000, currency: 'VND' },
        { id: 3, name: 'Sổ tiết kiệm', type: 'SAVINGS', balance: 100000000, currency: 'VND' }
      ]);
      setError("Đang hiển thị dữ liệu mẫu do không thể kết nối tới Backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const totalAssets = useMemo(() => {
    return wallets.reduce((acc, curr) => acc + curr.balance, 0);
  }, [wallets]);

  const handleOpenAddModal = () => {
    setEditingWallet(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setIsModalOpen(true);
  };

  const handleDeleteWallet = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ví này? Tất cả giao dịch liên quan có thể bị ảnh hưởng.')) {
      return;
    }
    
    try {
      await walletService.deleteWallet(id);
      setWallets(wallets.filter(w => w.id !== id));
    } catch (err: any) {
      console.error(err);
      // Fallback for mock mode
      setWallets(wallets.filter(w => w.id !== id));
    }
  };

  const handleSubmitModal = async (data: WalletPayload) => {
    try {
      if (editingWallet) {
        // Edit
        const updated = await walletService.updateWallet(editingWallet.id, data);
        setWallets(wallets.map(w => w.id === editingWallet.id ? updated : w));
      } else {
        // Add
        const created = await walletService.createWallet(data);
        setWallets([...wallets, created]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      // Fallback for mock mode
      if (editingWallet) {
        setWallets(wallets.map(w => w.id === editingWallet.id ? { ...w, ...data } : w));
      } else {
        setWallets([...wallets, { id: Date.now(), ...data }]);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Ví tài khoản</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý và theo dõi số dư của tất cả các nguồn tiền của bạn</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#005F9E] hover:bg-[#004B7D] text-white font-bold rounded-xl shadow-md shadow-blue-900/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5" />
          Thêm ví mới
        </button>
      </div>

      {error && (
        <div className="bg-amber-50 text-amber-600 p-4 rounded-xl text-sm font-medium border border-amber-200">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-5 translate-x-4 -translate-y-4">
            <Coins className="h-32 w-32" />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Coins className="h-4 w-4 text-[#005F9E]" />
              Tổng tài sản ròng
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 mt-2">{formatVND(totalAssets)}</h2>
          </div>
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 relative z-10">
            <span className="text-xs text-slate-500 font-medium">{wallets.length} Ví đang hoạt động</span>
            <span className="text-xs bg-[#005F9E]/10 text-[#005F9E] px-2 py-1 rounded font-bold">VND</span>
          </div>
        </div>
      </div>

      {/* Wallet List */}
      <div>
        <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
          <WalletIcon className="h-5 w-5 text-slate-500" />
          Danh sách ví của bạn
        </h3>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005F9E]"></div>
          </div>
        ) : wallets.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
            <WalletIcon className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Chưa có ví nào</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">Bạn chưa tạo ví tài khoản nào. Hãy thêm ví để bắt đầu quản lý chi tiêu.</p>
            <button 
              onClick={handleOpenAddModal}
              className="px-6 py-2.5 bg-[#005F9E] text-white font-bold rounded-lg shadow-sm"
            >
              Tạo ví đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {wallets.map(wallet => (
              <WalletCard 
                key={wallet.id} 
                wallet={wallet} 
                onEdit={handleOpenEditModal} 
                onDelete={handleDeleteWallet} 
              />
            ))}
          </div>
        )}
      </div>

      <WalletModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        wallet={editingWallet}
      />
    </div>
  );
};
