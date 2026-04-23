import api from '@/lib/api/api';
import { Lesson } from './lessons';

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
}

export interface Payment {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  transactionDate: string;
  studentId?: string;
}

export const parentsAPI = {
  getChildren: async (): Promise<Child[]> => {
    const response = await api.get<Child[]>('/api/parents/children');
    return response.data;
  },

  getChildLessons: async (kidId: string): Promise<Lesson[]> => {
    const response = await api.get<Lesson[]>(`/api/parents/child/${kidId}/lessons`);
    return response.data;
  },

  getPayments: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/api/parents/payments');
    return response.data;
  }
};
