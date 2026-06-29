import { apiClient } from './apiClient';
import { Transaction, TransactionPayload, PageResponse } from '../types/transaction';

interface SearchParams {
  page?: number;
  size?: number;
  walletId?: number | '';
  categoryId?: number | '';
  note?: string;
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
  }
};
