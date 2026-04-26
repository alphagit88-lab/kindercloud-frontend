import api from '@/lib/api/api';

export interface TimeTableEntry {
  id: string;
  classRoomId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  activity: string;
  location?: string;
}

export const timetableAPI = {
  getByClass: async (classRoomId: string): Promise<TimeTableEntry[]> => {
    const response = await api.get<TimeTableEntry[]>(`/api/timetable/${classRoomId}`);
    return response.data;
  },

  addEntry: async (data: Partial<TimeTableEntry>): Promise<TimeTableEntry> => {
    const response = await api.post<TimeTableEntry>('/api/timetable', data);
    return response.data;
  },

  updateEntry: async (id: string, data: Partial<TimeTableEntry>): Promise<TimeTableEntry> => {
    const response = await api.put<TimeTableEntry>(`/api/timetable/${id}`, data);
    return response.data;
  },

  deleteEntry: async (id: string): Promise<void> => {
    await api.delete(`/api/timetable/${id}`);
  }
};
