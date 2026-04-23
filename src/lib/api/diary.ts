import api from '@/lib/api/api';

export interface DiaryPlan {
  id: string;
  teacherId: string;
  type: 'year' | 'month' | 'day';
  planDetails: string;
  createdAt: string;
  updatedAt: string;
}

export const diaryAPI = {
  submitPlan: async (type: string, planDetails: string): Promise<DiaryPlan> => {
    const response = await api.post<DiaryPlan>('/api/diaries', { type, planDetails });
    return response.data;
  },

  getTeacherPlans: async (teacherId: string): Promise<DiaryPlan[]> => {
    const response = await api.get<DiaryPlan[]>(`/api/diaries/teacher/${teacherId}`);
    return response.data;
  },

  updatePlan: async (id: string, planDetails: string): Promise<DiaryPlan> => {
    const response = await api.put<DiaryPlan>(`/api/diaries/${id}`, { planDetails });
    return response.data;
  }
};
