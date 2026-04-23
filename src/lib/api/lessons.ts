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
  attachmentUrl?: string;
  attachmentType?: string;
  teacher?: {
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
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
  attachmentType?: string;
  file?: File;
}

export const lessonsAPI = {
  logLesson: async (data: CreateLessonData): Promise<Lesson> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'file') {
        formData.append(key, value as string);
      }
    });
    
    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await api.post<{ lesson: Lesson }>('/api/lessons', formData);
    return response.data.lesson;
  },

  getClassRoomLessons: async (classRoomId: string): Promise<Lesson[]> => {
    const response = await api.get<Lesson[]>(`/api/lessons/classroom/${classRoomId}`);
    return response.data;
  },

  updateLesson: async (id: string, data: Partial<CreateLessonData>): Promise<Lesson> => {
    const response = await api.put<{ lesson: Lesson }>(`/api/lessons/${id}`, data);
    return response.data.lesson;
  },
};
