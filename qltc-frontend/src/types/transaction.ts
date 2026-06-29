export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Transaction {
  id: number;
  userId: number;
  categoryId: number | null;
  fromWalletId: number | null;
  toWalletId: number | null;
  amount: number;
  type: TransactionType;
  note: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionPayload {
  categoryId?: number | null;
  fromWalletId?: number | null;
  toWalletId?: number | null;
  amount: number;
  type: TransactionType;
  note: string;
  transactionDate: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: any;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
