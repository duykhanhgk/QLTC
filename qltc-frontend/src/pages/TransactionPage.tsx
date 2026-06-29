import React, { useEffect, useState } from 'react';
import { Transaction } from '../types/transaction';
import { Wallet } from '../types/wallet';
import { transactionService } from '../services/transactionService';
import { walletService } from '../services/walletService';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/category';
import { TransactionList } from '../components/transaction/TransactionList';
import { AddTransactionModal } from '../components/transaction/AddTransactionModal';
import { Search, Wallet as WalletIcon } from 'lucide-react';

export const TransactionPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination & Filter state
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [noteFilter, setNoteFilter] = useState('');
  const [walletFilter, setWalletFilter] = useState<number | ''>('');

  const fetchWallets = async () => {
    try {
      const data = await walletService.getWallets();
      setWallets(data);
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTransactions = async (pageNumber: number, append: boolean = false) => {
    try {
      setLoading(true);
      const res = await transactionService.getTransactions({
        page: pageNumber,
        size: 10,
        note: noteFilter,
        walletId: walletFilter
      });
      
      if (append) {
        setTransactions(prev => [...prev, ...res.content]);
      } else {
        setTransactions(res.content);
      }
      setHasMore(!res.last);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
    fetchCategories();
  }, []);

  // Fetch when filters change (reset to page 0)
  useEffect(() => {
    setPage(0);
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions(0, false);
    }, 500); // debounce for search

    return () => clearTimeout(delayDebounceFn);
  }, [noteFilter, walletFilter]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage, true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Lịch sử giao dịch</h1>
          <p className="text-slate-500 mt-1">Theo dõi dòng tiền và chi tiêu của bạn</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm self-start md:self-auto"
        >
          + Thêm giao dịch
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo ghi chú..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={noteFilter}
            onChange={(e) => setNoteFilter(e.target.value)}
          />
        </div>
        
        <div className="md:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <WalletIcon size={18} className="text-slate-400" />
          </div>
          <select
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none bg-white"
            value={walletFilter}
            onChange={(e) => setWalletFilter(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">Tất cả các ví</option>
            {wallets.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && page === 0 ? (
        <div className="text-center py-12 text-slate-500">Đang tải dữ liệu...</div>
      ) : (
        <TransactionList 
          transactions={transactions} 
          hasMore={hasMore} 
          onLoadMore={handleLoadMore} 
        />
      )}

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallets={wallets}
        categories={categories}
        onSuccess={() => {
          setIsModalOpen(false);
          // Reset page and reload transactions and wallets
          setPage(0);
          fetchWallets();
          fetchTransactions(0, false);
        }}
      />
    </div>
  );
};
