import React, { useState } from 'react';
import { User, Lock, Coins, ArrowRight } from 'lucide-react';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { WalletPage } from './pages/WalletPage';

type Screen = 'LOGIN' | 'REGISTER' | 'MAIN_APP';
type Tab = 'DASHBOARD' | 'WALLET';

export default function App() {
  const [screen, setScreen] = useState<Screen>('LOGIN');
  const [activeTab, setActiveTab] = useState<Tab>('WALLET'); // Default to WALLET for QLTC-8 testing
  
  const [loginUsername, setLoginUsername] = useState('pm_test');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [registerName, setRegisterName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setScreen('MAIN_APP');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đăng ký tài khoản thành công! Mời bạn đăng nhập.');
    setScreen('LOGIN');
  };

  const handleLogout = () => {
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
    <MainLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      onLogout={handleLogout}
    >
      {activeTab === 'DASHBOARD' && <DashboardPage />}
      {activeTab === 'WALLET' && <WalletPage />}
    </MainLayout>
  );
}
