import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import { budgetService } from '../../services/budgetService';
import { Category } from '../../types/category';

interface AddBudgetModalProps {
  onClose: () => void;
  month: number;
  year: number;
}

export const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ onClose, month, year }) => {
  const queryClient = useQueryClient();
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [amountStr, setAmountStr] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories
  });

  const expenseCategories = categories.filter((c: Category) => c.type === 'EXPENSE');

  const mutation = useMutation({
    mutationFn: budgetService.createOrUpdateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', month, year] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.message || 'Có lỗi xảy ra khi lưu ngân sách');
    }
  });

  // Format currency while typing
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (!rawValue) {
      setAmountStr('');
      return;
    }
    const formatted = new Intl.NumberFormat('en-US').format(Number(rawValue));
    setAmountStr(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!categoryId) {
      setError('Vui lòng chọn danh mục');
      return;
    }
    const amount = Number(amountStr.replace(/,/g, ''));
    if (!amount || amount <= 0) {
      setError('Số tiền phải lớn hơn 0');
      return;
    }

    mutation.mutate({
      categoryId: Number(categoryId),
      amount,
      month,
      year
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">Thiết Lập Ngân Sách</h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Danh mục chi tiêu <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005F9E] focus:border-transparent text-slate-700"
              disabled={isLoadingCategories}
            >
              <option value="">-- Chọn danh mục --</option>
              {expenseCategories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Ngân sách tối đa (đ) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={amountStr}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005F9E] focus:border-transparent text-slate-700 text-right font-semibold text-lg"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-bold transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {mutation.isPending ? 'Đang lưu...' : 'Lưu Ngân Sách'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
