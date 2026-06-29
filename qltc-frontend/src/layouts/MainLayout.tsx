import React from 'react';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  Settings, 
  BookOpen, 
  LogOut, 
  Coins, 
  Calendar,
  Wallet
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: 'DASHBOARD' | 'WALLET' | 'TRANSACTIONS' | 'BUDGET';
  onTabChange: (tab: 'DASHBOARD' | 'WALLET' | 'TRANSACTIONS' | 'BUDGET') => void;
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange, onLogout }) => {
  return (
    <div className="flex h-screen bg-[#EBEFF4] overflow-hidden">
      {/* SIDEBAR */}
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
            <button 
              onClick={() => onTabChange('DASHBOARD')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'DASHBOARD' ? 'bg-[#005F9E] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              Tổng quan
            </button>
            <button 
              onClick={() => onTabChange('TRANSACTIONS')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'TRANSACTIONS' ? 'bg-[#005F9E] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              Sổ ghi chép
            </button>
            <button 
              onClick={() => onTabChange('WALLET')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'WALLET' ? 'bg-[#005F9E] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Wallet className="h-5 w-5" />
              Tài khoản / Ví
            </button>
            <button 
              onClick={() => onTabChange('BUDGET')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'BUDGET' ? 'bg-[#005F9E] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <PieIcon className="h-5 w-5" />
              Ngân sách chi tiêu
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-all">
              <Settings className="h-5 w-5" />
              Thiết lập hệ thống
            </button>
          </nav>
        </div>

        {/* User profile section */}
        <div className="p-4 border-t border-slate-800 bg-[#0F172A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold border border-slate-600">
              U
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Người dùng</p>
              <span className="text-xs text-slate-400 font-medium">Thành viên</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
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
            <span className="font-semibold text-slate-700 text-sm">Hôm nay: {new Date().toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Action buttons can be added here if needed in the future */}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};
