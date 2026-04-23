import api from '@/lib/api/api';

export interface SchoolEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  audience: 'admin' | 'teacher' | 'parent' | 'kid' | 'all';
  createdAt: string;
}

export const eventsAPI = {
  getAll: async (): Promise<SchoolEvent[]> => {
    const response = await api.get<SchoolEvent[]>('/api/events');
    return response.data;
  },

  create: async (data: Partial<SchoolEvent>): Promise<SchoolEvent> => {
    const response = await api.post<SchoolEvent>('/api/events', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/events/${id}`);
  }
};
