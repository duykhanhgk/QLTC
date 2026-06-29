export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
}
