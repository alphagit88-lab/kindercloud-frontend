import api from '@/lib/api/api';

export interface Lesson {
  id: string;
  classRoomId: string;
  teacherId: string;
  subject: string;
  lessonDate: string;
  plan?: string;
  activity?: string;
  progress?: string;
  homework?: string;
  assessment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonData {
  classRoomId: string;
  subject: string;
  lessonDate: string;
  plan?: string;
  activity?: string;
  progress?: string;
  homework?: string;
  assessment?: string;
}

export const lessonsAPI = {
  logLesson: async (data: CreateLessonData): Promise<Lesson> => {
    const response = await api.post<{ lesson: Lesson }>('/lessons', data);
    return response.data.lesson;
  },

  getClassRoomLessons: async (classRoomId: string): Promise<Lesson[]> => {
    const response = await api.get<Lesson[]>(`/lessons/classroom/${classRoomId}`);
    return response.data;
  },

  updateLesson: async (id: string, data: Partial<CreateLessonData>): Promise<Lesson> => {
    const response = await api.put<{ lesson: Lesson }>(`/lessons/${id}`, data);
    return response.data.lesson;
  },
};
