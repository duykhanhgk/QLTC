export type WalletType = 'CASH' | 'BANK' | 'CREDIT' | 'E_WALLET' | 'SAVINGS';

export interface Wallet {
  id: number;
  name: string;
  balance: number;
  currency: string;
  type: WalletType;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// DTO for creating/updating
export interface WalletPayload {
  name: string;
  balance: number;
  currency: string;
  type: WalletType;
}
