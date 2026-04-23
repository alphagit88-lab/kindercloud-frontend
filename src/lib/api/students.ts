import api from './api';

export interface Student {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    guardianLinksAsKid?: Array<{
      id: string;
      parentId: string;
      parent: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
      };
    }>;
  };
  gender?: string;
  dateOfBirth?: string;
  admissionDate: string;
  classRoomId?: string;
  classRoom?: {
    id: string;
    name: string;
  };
  medicalNotes?: string;
  address?: string;
  emergencyContact?: string;
  createdAt: string;
}

export const studentsAPI = {
  getAll: async () => {
    const response = await api.get<Student[]>('/api/students');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/students', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/students/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/students/${id}`);
    return response.data;
  }
};
