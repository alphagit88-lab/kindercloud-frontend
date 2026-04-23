import api from '@/lib/api/api';

export interface KinderWork {
  id: string;
  kidId: string;
  title: string;
  fileType: 'pdf' | 'video';
  fileUrl: string;
  createdAt: string;
}

export const kidsAPI = {
  getWorks: async (): Promise<KinderWork[]> => {
    const response = await api.get<KinderWork[]>('/api/kids/works');
    return response.data;
  },

  getWorksByType: async (type: string): Promise<KinderWork[]> => {
    const response = await api.get<KinderWork[]>(`/api/kids/works/${type}`);
    return response.data;
  }
};
