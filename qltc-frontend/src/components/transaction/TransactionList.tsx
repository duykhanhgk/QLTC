import React from 'react';
import { Transaction } from '../../types/transaction';
import { TransactionCard } from './TransactionCard';

interface TransactionListProps {
  transactions: Transaction[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onLoadMore, hasMore }) => {
  // Group transactions by date string (YYYY-MM-DD)
  const grouped = transactions.reduce((acc, t) => {
    const date = new Date(t.transactionDate);
    const dateStr = date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-100 mt-4">
        Không có giao dịch nào phù hợp
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {Object.entries(grouped).map(([dateStr, items]) => (
        <div key={dateStr} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 text-sm font-semibold text-slate-600">
            {dateStr}
          </div>
          <div>
            {items.map(t => (
              <TransactionCard key={t.id} transaction={t} />
            ))}
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center mt-6 mb-8">
          <button 
            onClick={onLoadMore}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            Tải thêm giao dịch
          </button>
        </div>
      )}
    </div>
  );
};
