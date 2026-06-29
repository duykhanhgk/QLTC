import { apiClient } from './apiClient';

export interface BudgetResponse {
  id: number;
  categoryId: number;
  amount: number;
  spentAmount: number;
  month: number;
  year: number;
  progressPercentage: number;
}

export interface BudgetRequest {
  categoryId: number;
  amount: number;
  month: number;
  year: number;
}

export const budgetService = {
  getBudgets: async (month: number, year: number): Promise<BudgetResponse[]> => {
    const response = await apiClient.get(`/budgets?month=${month}&year=${year}`);
    return response as BudgetResponse[];
  },

  createOrUpdateBudget: async (data: BudgetRequest): Promise<BudgetResponse> => {
    const response = await apiClient.post('/budgets', data);
    return response as BudgetResponse;
  }
};
