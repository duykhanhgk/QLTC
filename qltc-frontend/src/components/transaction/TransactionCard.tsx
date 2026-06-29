import React from 'react';
import { Transaction } from '../../types/transaction';
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const isIncome = transaction.type === 'INCOME';
  const isTransfer = transaction.type === 'TRANSFER';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-100">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${
          isIncome ? 'bg-emerald-100 text-emerald-600' :
          isTransfer ? 'bg-blue-100 text-blue-600' :
          'bg-rose-100 text-rose-600'
        }`}>
          {isIncome ? <ArrowDownLeft size={20} /> :
           isTransfer ? <RefreshCw size={20} /> :
           <ArrowUpRight size={20} />}
        </div>
        <div>
          <h4 className="font-medium text-slate-800">
            {transaction.note || (isIncome ? 'Thu nhập' : isTransfer ? 'Chuyển khoản' : 'Chi tiêu')}
          </h4>
          <div className="text-sm text-slate-500 mt-0.5">
             {new Date(transaction.transactionDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      <div className={`font-semibold ${
          isIncome ? 'text-emerald-600' :
          isTransfer ? 'text-blue-600' :
          'text-rose-600'
      }`}>
        {isIncome ? '+' : isTransfer ? '' : '-'}{formatCurrency(transaction.amount)}
      </div>
    </div>
  );
};
