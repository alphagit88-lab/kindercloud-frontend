import api from '@/lib/api/api';

export interface ClassRoom {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
  assignedTeacherId?: string;
  createdAt: string;
  updatedAt: string;
}

export const classroomsAPI = {
  getAll: async (): Promise<ClassRoom[]> => {
    const response = await api.get<ClassRoom[]>('/api/classrooms');
    return response.data;
  },

  getById: async (id: string): Promise<ClassRoom> => {
    const response = await api.get<ClassRoom>(`/api/classrooms/${id}`);
    return response.data;
  },
};
