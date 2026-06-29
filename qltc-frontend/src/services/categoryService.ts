import { apiClient } from './apiClient';
import { Category, CategoryPayload } from '../types/category';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    return apiClient.get('/categories');
  },
  
  createCategory: async (data: CategoryPayload): Promise<Category> => {
    return apiClient.post('/categories', data);
  },
  
  updateCategory: async (id: number, data: CategoryPayload): Promise<Category> => {
    return apiClient.put(`/categories/${id}`, data);
  },
  
  deleteCategory: async (id: number): Promise<void> => {
    return apiClient.delete(`/categories/${id}`);
  }
};
