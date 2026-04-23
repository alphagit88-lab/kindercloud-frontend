import api from '@/lib/api/api';

export interface AttendanceRecord {
  id: string;
  teacherId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'on_leave';
  note?: string;
}

export interface SalaryRecord {
  id: string;
  teacherId: string;
  amount: number;
  month: number;
  year: number;
  status: 'pending' | 'paid';
  paymentMethod: string;
  createdAt: string;
}

export const teacherOpsAPI = {
  markAttendance: async (data: Partial<AttendanceRecord>): Promise<AttendanceRecord> => {
    const response = await api.post<AttendanceRecord>('/api/teachers/attendance', data);
    return response.data;
  },

  getAttendance: async (teacherId: string): Promise<AttendanceRecord[]> => {
    const response = await api.get<AttendanceRecord[]>(`/api/teachers/attendance/${teacherId}`);
    return response.data;
  },

  processSalary: async (data: Partial<SalaryRecord>): Promise<SalaryRecord> => {
    const response = await api.post<SalaryRecord>('/api/teachers/salary', data);
    return response.data;
  },

  getSalaryHistory: async (teacherId: string): Promise<SalaryRecord[]> => {
    const response = await api.get<SalaryRecord[]>(`/api/teachers/salary/${teacherId}`);
    return response.data;
  }
};
