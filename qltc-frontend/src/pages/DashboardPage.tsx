import React, { useState } from 'react';
import { BookOpen, AlertTriangle, Wallet, TrendingUp, PieChart as PieChartIcon, Download } from 'lucide-react';
import { formatVND } from '../utils/format';
import { transactionService } from '../services/transactionService';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const { data: monthlyData, isLoading: isLoadingChart } = useQuery({
    queryKey: ['monthlySummary', currentYear],
    queryFn: () => transactionService.getMonthlySummary(currentYear)
  });

  const { data: categoryData, isLoading: isLoadingPie } = useQuery({
    queryKey: ['categorySummary', selectedMonth, currentYear],
    queryFn: () => transactionService.getCategorySummary(selectedMonth, currentYear)
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

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#BA68C8', '#4DB6AC', '#FFD54F', '#A1887F'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handleExportCSV = async () => {
    try {
      await transactionService.exportTransactions();
    } catch (error) {
      console.error('Lỗi khi tải CSV:', error);
      alert('Không thể xuất file CSV. Vui lòng thử lại.');
    }
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
              Sổ giao dịch gần đây
            </h3>
            <div className="flex items-center gap-4">
              <button onClick={handleExportCSV} className="text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#005F9E] text-white hover:bg-[#004A7C] font-medium transition-colors">
                <Download className="w-4 h-4" />
                Xuất CSV
              </button>
              <button className="text-sm text-[#005F9E] hover:text-[#004A7C] font-medium">Xem tất cả →</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-y border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-medium">Ngày</th>
                  <th className="px-4 py-3 font-medium">Diễn giải</th>
                  <th className="px-4 py-3 font-medium">Danh mục</th>
                  <th className="px-4 py-3 font-medium text-right">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-500">{t.date}</td>
                    <td className="px-4 py-3 text-slate-800">
                      <div>{t.note}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{t.type === 'TRANSFER' ? `${t.wallet} → ${t.toWallet}` : t.wallet}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${t.type === 'INCOME' ? 'text-green-600' : t.type === 'EXPENSE' ? 'text-red-600' : 'text-slate-600'}`}>
                      {t.type === 'INCOME' ? '+' : t.type === 'EXPENSE' ? '-' : ''}{formatVND(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie Chart: Expense Structure */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#DCDFE6] lg:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-orange-500" />
              Cơ cấu chi tiêu
            </h3>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-[#005F9E] focus:border-[#005F9E]"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>Tháng {i+1}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            {isLoadingPie ? (
              <div className="text-slate-400">Đang tải biểu đồ...</div>
            ) : (!categoryData || categoryData.length === 0) ? (
              <div className="text-slate-400 flex flex-col items-center">
                <PieChartIcon className="w-12 h-12 text-slate-200 mb-2" />
                <p>Chưa có khoản chi nào trong tháng</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="categoryName"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [
                      `${value}% (${formatVND(props.payload.amount)})`, 
                      name
                    ]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #EBEEF5', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
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
