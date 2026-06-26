import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  PieChart as PieIcon, 
  Settings, 
  Plus, 
  BookOpen, 
  AlertTriangle, 
  LogOut, 
  User, 
  Lock, 
  Coins, 
  Calendar, 
  ArrowRight
} from 'lucide-react';

type Screen = 'LOGIN' | 'REGISTER' | 'DASHBOARD';

export default function App() {
  const [screen, setScreen] = useState<Screen>('LOGIN');
  const [loginUsername, setLoginUsername] = useState('pm_test');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [registerName, setRegisterName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Mock data representing professional MISA style accounting board
  const [wallets] = useState([
    { id: 1, name: 'Tiền mặt (Ví cá nhân)', type: 'CASH', balance: 5420000, currency: 'VND', color: 'bg-orange-500' },
    { id: 2, name: 'Ngân hàng Techcombank', type: 'BANK', balance: 42150000, currency: 'VND', color: 'bg-blue-600' },
    { id: 3, name: 'Sổ tiết kiệm dài hạn', type: 'SAVINGS', balance: 100000000, currency: 'VND', color: 'bg-green-600' }
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
    { category: 'Mua sắm', limit: 2000000, spent: 1950000, percent: 97.5 }, // Danger limit!
    { category: 'Di chuyển', limit: 1000000, spent: 420000, percent: 42.0 }
  ]);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const totalAssets = wallets.reduce((acc, curr) => acc + curr.balance, 0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In mockup mode, just transition to dashboard
    setScreen('DASHBOARD');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đăng ký tài khoản thành công! Mời bạn đăng nhập.');
    setScreen('LOGIN');
  };

  // ==========================================
  // RENDER LOGIN SCREEN
  // ==========================================
  if (screen === 'LOGIN') {
    return (
      <div className="flex h-screen bg-[#EBEFF4] items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[550px]">
          {/* Left Decorative panel */}
          <div className="w-full md:w-1/2 bg-[#1E293B] p-10 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-5 translate-x-10 translate-y-10">
              <Coins className="h-72 w-72" />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#005F9E] rounded-lg">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight text-white uppercase tracking-wider">Sổ Thu Chi</h1>
                <span className="text-xs text-slate-400 font-medium">MISA Money Keeper</span>
              </div>
            </div>

            <div className="space-y-4 my-auto">
              <h2 className="text-2xl font-extrabold leading-tight">Quản lý tài chính cá nhân thông minh và chặt chẽ</h2>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Thiết lập hạn mức chi tiêu, ghi chép nhanh các giao dịch hàng ngày và phân tích dòng tiền chuyên nghiệp cùng MISA.
              </p>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              © 2026 MISA Money Keeper. Phát triển cho bản Web.
            </div>
          </div>

          {/* Right Form panel */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-800">Đăng Nhập</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Chào mừng bạn quay trở lại với Sổ thu chi MISA.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase">Tên đăng nhập</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <input 
                    type="text" 
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                    className="block w-full pl-10 pr-4 py-2.5 border border-[#DCDFE6] rounded-lg bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-[#005F9E] focus:outline-none transition-all font-medium text-slate-700" 
                    placeholder="Nhập tên đăng nhập..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600 uppercase">Mật khẩu</label>
                  <a href="#" className="text-xs font-bold text-[#005F9E] hover:underline">Quên mật khẩu?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-4 py-2.5 border border-[#DCDFE6] rounded-lg bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-[#005F9E] focus:outline-none transition-all font-medium text-slate-700" 
                    placeholder="Nhập mật khẩu..."
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-[#005F9E] hover:bg-[#004B7D] text-white font-bold rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                Đăng nhập
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <span className="text-xs text-slate-500 font-medium">Bạn chưa có tài khoản? </span>
              <button 
                onClick={() => setScreen('REGISTER')} 
                className="text-xs font-bold text-[#005F9E] hover:underline"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER REGISTER SCREEN
  // ==========================================
  if (screen === 'REGISTER') {
    return (
      <div className="flex h-screen bg-[#EBEFF4] items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[550px]">
          {/* Left Decorative panel */}
          <div className="w-full md:w-1/2 bg-[#1E293B] p-10 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-5 translate-x-10 translate-y-10">
              <Coins className="h-72 w-72" />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#005F9E] rounded-lg">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight text-white uppercase tracking-wider">Sổ Thu Chi</h1>
                <span className="text-xs text-slate-400 font-medium">MISA Money Keeper</span>
              </div>
            </div>

            <div className="space-y-4 my-auto">
              <h2 className="text-2xl font-extrabold leading-tight">Khởi tạo kế hoạch tài chính cá nhân vững vàng</h2>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Tham gia cùng hàng ngàn người dùng thông thái đã kiểm soát được chi tiêu, tiết kiệm thông minh và gia tăng tài sản ròng bền vững.
              </p>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              © 2026 MISA Money Keeper. Phát triển cho bản Web.
            </div>
          </div>

          {/* Right Form panel */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Đăng Ký Tài Khoản</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Bắt đầu quản lý tài chính hiệu quả hơn ngay hôm nay.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Họ và tên</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    className="block w-full pl-10 pr-4 py-2 border border-[#DCDFE6] rounded-lg bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-[#2ECC71] focus:outline-none transition-all font-medium text-slate-700" 
                    placeholder="Nhập họ và tên..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Tên đăng nhập</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    required
                    className="block w-full pl-10 pr-4 py-2 border border-[#DCDFE6] rounded-lg bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-[#2ECC71] focus:outline-none transition-all font-medium text-slate-700" 
                    placeholder="Nhập tên đăng nhập mong muốn..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input 
                    type="password" 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-4 py-2 border border-[#DCDFE6] rounded-lg bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-[#2ECC71] focus:outline-none transition-all font-medium text-slate-700" 
                    placeholder="Nhập mật khẩu..."
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-bold rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                Đăng ký tài khoản
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-xs text-slate-500 font-medium">Bạn đã có tài khoản? </span>
              <button 
                onClick={() => setScreen('LOGIN')} 
                className="text-xs font-bold text-[#005F9E] hover:underline"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER INTERACTIVE DASHBOARD SCREEN
  // ==========================================
  return (
    <div className="flex h-screen bg-[#EBEFF4] overflow-hidden">
      {/* SIDEBAR - MISA Style Navigation */}
      <aside className="w-64 bg-[#1E293B] text-white flex flex-col justify-between shadow-lg">
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center gap-3 px-6 bg-[#0F172A] border-b border-slate-800">
            <div className="p-2 bg-[#005F9E] rounded-lg">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight text-white">SỔ THU CHI</h1>
              <span className="text-xs text-slate-400 font-medium">MISA Money Keeper</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="mt-6 px-4 space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#005F9E] text-white rounded-lg font-medium transition-all">
              <TrendingUp className="h-5 w-5" />
              Tổng quan
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-all">
              <BookOpen className="h-5 w-5" />
              Sổ ghi chép
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-all">
              <Wallet className="h-5 w-5" />
              Tài khoản / Ví
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-all">
              <PieIcon className="h-5 w-5" />
              Ngân sách chi tiêu
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-all">
              <Settings className="h-5 w-5" />
              Thiết lập hệ thống
            </a>
          </nav>
        </div>

        {/* User profile section */}
        <div className="p-4 border-t border-slate-800 bg-[#0F172A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold border border-slate-600">
              U
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Đăng Khoa</p>
              <span className="text-xs text-slate-400 font-medium">Premium User</span>
            </div>
          </div>
          <button 
            onClick={() => setScreen('LOGIN')}
            title="Đăng xuất"
            className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-all"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-[#DCDFE6] flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#005F9E]" />
            <span className="font-semibold text-slate-700 text-sm">Tháng này: 06/2026</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold rounded-lg text-sm shadow-sm transition-all">
              <Plus className="h-4 w-4" />
              Thêm giao dịch
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#005F9E] hover:bg-[#004B7D] text-white font-semibold rounded-lg text-sm shadow-sm transition-all">
              <Wallet className="h-4 w-4" />
              Thêm ví mới
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* ROW 1: Net Worth Card & Quick Assets Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Total Asset Card */}
            <div className="bg-[#005F9E] text-white rounded-xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 translate-x-4 -translate-y-4">
                <Coins className="h-40 w-40" />
              </div>
              <div className="space-y-1">
                <span className="text-slate-200 text-xs font-semibold uppercase tracking-wider">Tổng tài sản ròng</span>
                <h2 className="text-3xl font-extrabold tracking-tight">{formatVND(totalAssets)}</h2>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-blue-400/30">
                <span className="text-xs text-slate-200 font-medium">3 Tài khoản hoạt động</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded font-bold">VND ₫</span>
              </div>
            </div>

            {/* Wallet Quick list */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#DCDFE6] lg:col-span-2">
              <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[#005F9E]" />
                Số dư khả dụng các ví
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {wallets.map(w => (
                  <div key={w.id} className="p-4 rounded-lg bg-[#F8F9FA] border border-slate-100 shadow-xs flex items-start gap-3">
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
            
            {/* Transaction Sổ ghi chép - Detailed Table (MISA style) */}
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

            {/* Budget limits (Money Lover style Alerting) */}
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

        </div>
      </main>
    </div>
  );
}
