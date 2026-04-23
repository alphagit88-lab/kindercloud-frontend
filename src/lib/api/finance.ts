import api from '@/lib/api/api';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  transactionDate: string;
  createdAt: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface FinanceResponse {
  summary: FinanceSummary;
  transactions: Transaction[];
}

export const financeAPI = {
  getTransactions: async (type?: string): Promise<FinanceResponse> => {
    const response = await api.get<FinanceResponse>('/api/finance', {
      params: { type }
    });
    return response.data;
  },

  addTransaction: async (data: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.post<Transaction>('/api/finance', data);
    return response.data;
  }
};
