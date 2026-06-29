import { apiClient } from './apiClient';
import { Wallet, WalletPayload } from '../types/wallet';

export const walletService = {
  getWallets: async (): Promise<Wallet[]> => {
    return apiClient.get('/wallets');
  },
  
  createWallet: async (data: WalletPayload): Promise<Wallet> => {
    return apiClient.post('/wallets', data);
  },
  
  updateWallet: async (id: number, data: WalletPayload): Promise<Wallet> => {
    return apiClient.put(`/wallets/${id}`, data);
  },
  
  deleteWallet: async (id: number): Promise<void> => {
    return apiClient.delete(`/wallets/${id}`);
  }
};
