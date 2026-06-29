import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Target, AlertTriangle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { budgetService, BudgetResponse } from '../services/budgetService';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/category';
import { AddBudgetModal } from '../components/budget/AddBudgetModal';

export const BudgetPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { data: budgets = [], isLoading: isLoadingBudgets } = useQuery({
    queryKey: ['budgets', month, year],
    queryFn: () => budgetService.getBudgets(month, year)
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getCategoryName = (id: number) => {
    return categories.find((c: Category) => c.id === id)?.name || 'Không xác định';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    return 'bg-[#2ECC71]';
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 100) return <span className="text-red-600 font-medium">Vượt ngân sách</span>;
    if (percentage >= 80) return <span className="text-orange-600 font-medium">Sắp hết ngân sách</span>;
    return <span className="text-[#27AE60] font-medium">Đang trong định mức</span>;
  };

  const totalBudget = budgets.reduce((sum: number, b: BudgetResponse) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum: number, b: BudgetResponse) => sum + b.spentAmount, 0);
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Ngân sách chi tiêu</h2>
          <p className="text-slate-500 mt-1">Thiết lập và theo dõi định mức chi tiêu hàng tháng</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-32 text-center font-bold text-slate-800">
            Tháng {month} / {year}
          </div>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Tổng ngân sách</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalBudget)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-orange-50 rounded-xl text-orange-600">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Tổng đã chi</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className={`p-4 rounded-xl ${totalPercentage >= 100 ? 'bg-red-50 text-red-600' : totalPercentage >= 80 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Tiến độ chung</p>
            <p className="text-2xl font-bold text-slate-800">{totalPercentage.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Danh sách ngân sách</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Thêm ngân sách
        </button>
      </div>

      {isLoadingBudgets ? (
        <div className="text-center py-10 text-slate-500">Đang tải...</div>
      ) : budgets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <Target className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-800">Chưa có ngân sách nào</h4>
            <p className="text-slate-500">Tháng này bạn chưa thiết lập giới hạn chi tiêu cho danh mục nào.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-2 text-[#4F46E5] font-semibold hover:underline"
          >
            Tạo ngân sách đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget: BudgetResponse) => {
            const isOver = budget.progressPercentage >= 100;
            const remaining = budget.amount - budget.spentAmount;
            return (
              <div key={budget.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg font-bold text-slate-600">
                      {getCategoryName(budget.categoryId).charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">{getCategoryName(budget.categoryId)}</h4>
                      <div className="text-sm mt-0.5">{getStatusText(budget.progressPercentage)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">{formatCurrency(budget.spentAmount)}</p>
                    <p className="text-sm font-medium text-slate-400">/ {formatCurrency(budget.amount)}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-500">Tiến độ</span>
                    <span className={isOver ? 'text-red-600' : 'text-slate-800'}>{budget.progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(budget.progressPercentage)}`}
                      style={{ width: `${Math.min(budget.progressPercentage, 100)}%` }}
                    />
                  </div>
                  {!isOver ? (
                    <p className="text-xs text-slate-400 text-right font-medium">Còn lại {formatCurrency(remaining)}</p>
                  ) : (
                    <p className="text-xs text-red-500 text-right font-medium">Vượt quá {formatCurrency(Math.abs(remaining))}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <AddBudgetModal 
          onClose={() => setIsModalOpen(false)} 
          month={month} 
          year={year} 
        />
      )}
    </div>
  );
};
