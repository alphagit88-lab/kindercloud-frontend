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
    profilePicture?: string;
  };
  // Marketplace / Profile fields (optional to support both backend and frontend assumptions)
  teacher?: {
    id?: string;
    firstName: string;
    lastName: string;
    bio?: string;
    profilePicture?: string;
  };
  teacherId?: string;
  qualification?: string;
  qualifications?: string; // Some components use plural
  specialization?: string;
  joiningDate?: string;
  baseSalary?: number;
  createdAt?: string;
  updatedAt?: string;

  // Stats & Marketplace
  verified?: boolean;
  rating?: number | string;
  ratingCount?: number;
  yearsExperience?: number;
  totalSessions?: number;
  totalStudents?: number;
  hourlyRate?: number | string;
  subjects?: string;
  teachingLanguages?: string;
  
  // Discounts
  packageDiscount3Plus?: number;
  packageDiscount5Plus?: number;
}

export const teachersAPI = {
  getAll: async (params?: any) => {
    let endpoint = '/api/teachers';
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
      const queryString = searchParams.toString();
      if (queryString) endpoint += `?${queryString}`;
    }
    const response = await api.get<Teacher[]>(endpoint);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/teachers', data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/teachers/${id}`);
    return response.data;
  }
};



export const getVerifiedTeachers = teachersAPI.getAll;
export const getTeacherProfile = async (id: string) => { const res = await api.get('/api/teachers/' + id); return res.data; };
export const getSimilarTeachers = async (id: string, limit?: number) => [];
export const getTeacherDisplayName = (t: any) => {
  if (!t) return 'Unknown';
  if (t.user) return `${t.user.firstName} ${t.user.lastName}`;
  if (t.teacher) {
    if (t.teacher.firstName && t.teacher.lastName) return `${t.teacher.firstName} ${t.teacher.lastName}`;
    if (t.teacher.displayName) return t.teacher.displayName;
  }
  if (t.firstName && t.lastName) return `${t.firstName} ${t.lastName}`;
  return 'Unknown';
};

export const parseSubjects = (t: any) => {
  if (!t) return [];
  // If it's a string from the entity
  if (typeof t === 'string') return t.split(',').map(s => s.trim()).filter(Boolean);
  // If it's the teacher object itself
  if (t.subjects) return typeof t.subjects === 'string' ? t.subjects.split(',').map((s: string) => s.trim()).filter(Boolean) : t.subjects;
  if (t.specialization) return [t.specialization];
  return [];
};

export const parseLanguages = (t: any) => {
  if (!t) return ['English'];
  if (typeof t === 'string') return t.split(',').map(s => s.trim()).filter(Boolean);
  if (Array.isArray(t)) return t;
  return ['English'];
};

export const formatRating = (rating: any) => {
  if (!rating) return '5.0';
  const val = typeof rating === 'string' ? parseFloat(rating) : rating;
  return isNaN(val) ? '5.0' : val.toFixed(1);
};

export const getTeacherInitials = (t: any) => {
  if (!t) return 'TC';
  const name = getTeacherDisplayName(t);
  if (name === 'Unknown') return 'TC';
  const parts = name.split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};
