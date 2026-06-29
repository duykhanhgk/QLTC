import React, { useState } from 'react';
import { BookOpen, AlertTriangle, Wallet, TrendingUp } from 'lucide-react';
import { formatVND } from '../utils/format';
import { transactionService } from '../services/transactionService';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const DashboardPage: React.FC = () => {
  // Mock data representing professional MISA style accounting board
  const [wallets] = useState([
    { id: 1, name: 'Tiền mặt (Ví cá nhân)', type: 'CASH', balance: 5420000, color: 'bg-orange-500' },
    { id: 2, name: 'Ngân hàng Techcombank', type: 'BANK', balance: 42150000, color: 'bg-blue-600' },
    { id: 3, name: 'Sổ tiết kiệm dài hạn', type: 'SAVINGS', balance: 100000000, color: 'bg-green-600' }
  ]);

  const [recentTransactions] = useState([
    { id: 1, type: 'EXPENSE', amount: 150000, category: 'Ăn uống', wallet: 'Tiền mặt', date: '2026-06-26', note: 'Ăn trưa cùng đồng nghiệp' },
    { id: 2, type: 'INCOME', amount: 15000000, category: 'Lương', wallet: 'Techcombank', date: '2026-06-25', note: 'Thanh toán lương tháng 6' },
    { id: 3, type: 'EXPENSE', amount: 1200000, category: 'Mua sắm', wallet: 'Techcombank', date: '2026-06-24', note: 'Mua giày thể thao mới' },
    { id: 4, type: 'TRANSFER', amount: 2000000, category: 'Chuyển khoản', wallet: 'Techcombank', toWallet: 'Tiền mặt', date: '2026-06-23', note: 'Rút tiền mặt tiêu dùng' },
    { id: 5, type: 'EXPENSE', amount: 450000, category: 'Nhà cửa & Hóa đơn', wallet: 'Techcombank', date: '2026-06-22', note: 'Đóng tiền điện nước' }
  ]);

  const [budgets] = useState([
    { category: 'Ăn uống', limit: 4000000, spent: 3250000, percent: 81.2 },
    { category: 'Mua sắm', limit: 2000000, spent: 1950000, percent: 97.5 },
    { category: 'Di chuyển', limit: 1000000, spent: 420000, percent: 42.0 }
  ]);

  const currentYear = new Date().getFullYear();
  const { data: monthlyData, isLoading: isLoadingChart } = useQuery({
    queryKey: ['monthlySummary', currentYear],
    queryFn: () => transactionService.getMonthlySummary(currentYear)
  });

  const chartData = monthlyData?.map(item => ({
    name: `T${item.month}`,
    'Thu nhập': item.income,
    'Chi tiêu': item.expense
  })) || [];

  const formatYAxis = (value: number) => {
    if (value === 0) return '0';
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Quick list */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#DCDFE6] lg:col-span-3">
          <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#005F9E]" />
            Số dư khả dụng các ví
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wallets.map(w => (
              <div key={w.id} className="p-4 rounded-lg bg-[#F8F9FA] border border-slate-100 shadow-xs flex items-start gap-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className={`p-2.5 rounded-lg ${w.color} text-white`}>
                  <Wallet className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-500 truncate max-w-[130px]">{w.name}</p>
                  <p className="text-sm font-extrabold text-slate-800">{formatVND(w.balance)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 2: Transaction History & Budget limits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#DCDFE6] lg:col-span-2">
          <h3 className="font-bold text-slate-800 text-sm mb-6 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Biểu đồ Thu nhập & Chi tiêu ({currentYear})
          </h3>
          <div className="h-80 w-full">
            {isLoadingChart ? (
              <div className="flex justify-center items-center h-full text-slate-400">Đang tải biểu đồ...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7ED" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#909399', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#909399', fontSize: 12 }} tickFormatter={formatYAxis} width={60} />
                  <Tooltip 
                    formatter={(value: number) => [formatVND(value), undefined]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #EBEEF5', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Thu nhập" fill="#2ECC71" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Chi tiêu" fill="#E74C3C" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Transaction Sổ ghi chép - Detailed Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#DCDFE6] lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#005F9E]" />
              Nhật ký giao dịch gần đây
            </h3>
            <a href="#" className="text-xs text-[#005F9E] font-bold hover:underline">Xem tất cả</a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase bg-slate-50/50">
                  <th className="py-3 px-4">Ngày</th>
                  <th className="py-3 px-4">Danh mục</th>
                  <th className="py-3 px-4">Ghi chú</th>
                  <th className="py-3 px-4 text-right">Số tiền</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 font-medium">
                {recentTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 text-xs">{t.date}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                        t.type === 'INCOME' ? 'bg-green-50 text-green-600' :
                        t.type === 'EXPENSE' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs max-w-[200px] truncate">{t.note}</td>
                    <td className={`py-3.5 px-4 text-right font-extrabold ${
                      t.type === 'INCOME' ? 'text-green-600' :
                      t.type === 'EXPENSE' ? 'text-red-600' : 'text-slate-600'
                    }`}>
                      {t.type === 'EXPENSE' ? '-' : t.type === 'INCOME' ? '+' : ''}
                      {formatVND(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget limits */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#DCDFE6] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Hạn mức chi tiêu & Cảnh báo
            </h3>
            <p className="text-xs text-slate-500 mb-6">Ngân sách chi tiêu được thiết lập cho tháng 06/2026.</p>

            <div className="space-y-5">
              {budgets.map((b, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">{b.category}</span>
                    <span className="text-slate-500">
                      {formatVND(b.spent)} / <span className="text-slate-400">{formatVND(b.limit)}</span>
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        b.percent >= 90 ? 'bg-red-500' : 
                        b.percent >= 75 ? 'bg-amber-500' : 'bg-[#005F9E]'
                      }`}
                      style={{ width: `${Math.min(b.percent, 100)}%` }}
                    />
                  </div>

                  {/* Over budget Warning */}
                  {b.percent >= 90 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-red-500 font-bold mt-0.5 animate-pulse">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Cảnh báo: Bạn đã chi tiêu vượt quá 90% hạn mức!</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all border border-slate-200">
            Điều chỉnh hạn mức ngân sách
          </button>
        </div>
      </div>
    </>
  );
};
