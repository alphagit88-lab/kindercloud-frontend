import api from './api';

export interface Teacher {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  qualification?: string;
  specialization?: string;
  joiningDate: string;
  baseSalary: number;
  createdAt: string;
}

export const teachersAPI = {
  getAll: async () => {
    const response = await api.get<Teacher[]>('/teachers');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/teachers', data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  }
};
