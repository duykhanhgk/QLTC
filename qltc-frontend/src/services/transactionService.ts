import { apiClient } from './apiClient';
import { Transaction, TransactionPayload, PageResponse } from '../types/transaction';

interface SearchParams {
  page?: number;
  size?: number;
  walletId?: number | '';
  categoryId?: number | '';
  note?: string;
}

export interface MonthlySummaryResponse {
  month: number;
  income: number;
  expense: number;
}

export interface CategorySummaryResponse {
  categoryName: string;
  amount: number;
  percentage: number;
}

export const transactionService = {
  getTransactions: async (params: SearchParams = {}): Promise<PageResponse<Transaction>> => {
    // remove empty params
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', params.page.toString());
    if (params.size !== undefined) query.append('size', params.size.toString());
    if (params.walletId) query.append('walletId', params.walletId.toString());
    if (params.categoryId) query.append('categoryId', params.categoryId.toString());
    if (params.note) query.append('note', params.note);
    
    return apiClient.get(`/transactions?${query.toString()}`);
  },

  createTransaction: async (data: TransactionPayload): Promise<Transaction> => {
    return apiClient.post('/transactions', data);
  },

  getMonthlySummary: async (year: number): Promise<MonthlySummaryResponse[]> => {
    const response = await apiClient.get(`/transactions/summary?year=${year}`);
    return response as MonthlySummaryResponse[];
  },

  getCategorySummary: async (month: number, year: number): Promise<CategorySummaryResponse[]> => {
    const response = await apiClient.get(`/transactions/category-summary?month=${month}&year=${year}`);
    return response as CategorySummaryResponse[];
  }
};
