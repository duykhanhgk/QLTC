import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TransactionType, TransactionPayload } from '../../types/transaction';
import { Wallet } from '../../types/wallet';
import { Category } from '../../types/category';
import { transactionService } from '../../services/transactionService';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  wallets: Wallet[];
  categories: Category[];
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ 
  isOpen, onClose, onSuccess, wallets, categories 
}) => {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amountStr, setAmountStr] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [fromWalletId, setFromWalletId] = useState<number | ''>('');
  const [toWalletId, setToWalletId] = useState<number | ''>('');
  const [note, setNote] = useState('');
  
  // Default to today in YYYY-MM-DDTHH:mm format for datetime-local
  const [date, setDate] = useState(() => {
    const now = new Date();
    // Adjust to local timezone format
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 16);
    return localISOTime;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setType('EXPENSE');
      setAmountStr('');
      setCategoryId('');
      setFromWalletId('');
      setToWalletId('');
      setNote('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter categories by selected type
  const availableCategories = categories.filter(c => (c.type as string) === (type as string));

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (!rawValue) {
      setAmountStr('');
      return;
    }
    // Format with commas
    const formatted = parseInt(rawValue, 10).toLocaleString('en-US');
    setAmountStr(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numericAmount = parseInt(amountStr.replace(/,/g, ''), 10);
    if (!numericAmount || numericAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    // Prepare ISO 8601 UTC date
    const transactionDate = new Date(date).toISOString();

    const payload: TransactionPayload = {
      type,
      amount: numericAmount,
      note,
      transactionDate,
    };

    if (type === 'INCOME') {
      if (!toWalletId || !categoryId) return setError('Vui lòng chọn ví nhận và danh mục');
      payload.toWalletId = toWalletId as number;
      payload.categoryId = categoryId as number;
    } else if (type === 'EXPENSE') {
      if (!fromWalletId || !categoryId) return setError('Vui lòng chọn ví nguồn và danh mục');
      payload.fromWalletId = fromWalletId as number;
      payload.categoryId = categoryId as number;
    } else if (type === 'TRANSFER') {
      if (!fromWalletId || !toWalletId) return setError('Vui lòng chọn ví nguồn và ví nhận');
      if (fromWalletId === toWalletId) return setError('Ví nguồn và ví nhận không được trùng nhau');
      payload.fromWalletId = fromWalletId as number;
      payload.toWalletId = toWalletId as number;
      if (categoryId) payload.categoryId = categoryId as number;
    }

    try {
      setLoading(true);
      await transactionService.createTransaction(payload);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu giao dịch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Thêm Giao Dịch</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl">{error}</div>}

          {/* Type Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            {(['EXPENSE', 'INCOME', 'TRANSFER'] as TransactionType[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setType(t);
                  setCategoryId(''); // reset category on type change
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  type === t 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'EXPENSE' ? 'CHI TIÊU' : t === 'INCOME' ? 'THU NHẬP' : 'CHUYỂN KHOẢN'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Số tiền (đ)</label>
            <input
              type="text"
              value={amountStr}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full px-4 py-3 text-2xl font-bold text-right border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Conditional Wallets */}
            {(type === 'EXPENSE' || type === 'TRANSFER') && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Từ Ví (Nguồn)</label>
                <select
                  value={fromWalletId}
                  onChange={e => setFromWalletId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  required
                >
                  <option value="">-- Chọn ví --</option>
                  {wallets.map(w => <option key={w.id} value={w.id}>{w.name} ({w.balance.toLocaleString('en-US')}đ)</option>)}
                </select>
              </div>
            )}

            {(type === 'INCOME' || type === 'TRANSFER') && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Đến Ví (Nhận)</label>
                <select
                  value={toWalletId}
                  onChange={e => setToWalletId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  required
                >
                  <option value="">-- Chọn ví --</option>
                  {wallets.map(w => <option key={w.id} value={w.id}>{w.name} ({w.balance.toLocaleString('en-US')}đ)</option>)}
                </select>
              </div>
            )}
            
            {/* Category */}
            {type !== 'TRANSFER' && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Danh mục</label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {availableCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Thời gian</label>
            <input
              type="datetime-local"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Ghi chú</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Nhập ghi chú chi tiết..."
              rows={2}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:bg-indigo-400"
            >
              {loading ? 'Đang lưu...' : 'Lưu Giao Dịch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
