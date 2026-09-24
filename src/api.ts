import {
  User,
  Material,
  Assessment,
  AssessmentResult,
  Consultation,
  CounselingSchedule,
  Journal,
  CareerContent,
  CareerPlan,
  AssistanceRequest,
  AdminStatistics,
} from './types';

const TOKEN_KEY = 'ruang_bk_smkn2godean_token';

export const tokenStorage = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {}
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  },
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Terjadi kesalahan saat memproses permintaan.');
  }

  return data;
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    request<{ message: string; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  registerSiswa: (payload: { name: string; username: string; password: string; nis?: string; className: string; major?: string }) =>
    request<{ message: string; token: string; user: User }>('/auth/register-siswa', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => request<User>('/auth/me'),

  changePassword: (payload: { currentPassword?: string; newPassword: string }) =>
    request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  // Materials
  getMaterials: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return request<Material[]>(`/materials?${params.toString()}`);
  },

  getMaterialById: (id: string) => request<Material>(`/materials/${id}`),

  createMaterial: (payload: Partial<Material>) =>
    request<Material>('/materials', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateMaterial: (id: string, payload: Partial<Material>) =>
    request<Material>(`/materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteMaterial: (id: string) =>
    request<{ message: string }>(`/materials/${id}`, {
      method: 'DELETE',
    }),

  markMaterialRead: (id: string) =>
    request<Material>(`/materials/${id}/read`, {
      method: 'POST',
    }),

  // Assessments
  getAssessments: () => request<Assessment[]>('/assessments'),

  getAssessmentById: (id: string) => request<Assessment>(`/assessments/${id}`),

  submitAssessment: (
    assessment_id: string,
    answers: Record<number, number>,
    studentInfo?: { student_name?: string; student_class?: string }
  ) =>
    request<AssessmentResult>('/assessments/submit', {
      method: 'POST',
      body: JSON.stringify({ assessment_id, answers, ...studentInfo }),
    }),

  getAssessmentResults: () => request<AssessmentResult[]>('/assessment-results'),

  // Consultations
  getConsultations: () => request<Consultation[]>('/consultations'),

  getConsultationById: (id: string) => request<Consultation>(`/consultations/${id}`),

  createConsultation: (payload: {
    topic: string;
    message: string;
    urgency: string;
    is_anonymous: boolean;
    student_name?: string;
    student_class?: string;
    name?: string;
    class?: string;
  }) =>
    request<Consultation>('/consultations', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateConsultation: (id: string, payload: { status?: string; response?: string; follow_up_notes?: string }) =>
    request<Consultation>(`/consultations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Counseling Schedules
  getSchedules: () =>
    request<{ mySchedules?: CounselingSchedule[]; takenSlots?: { date: string; time: string }[] } | CounselingSchedule[]>(
      '/counseling-schedules'
    ),

  createSchedule: (payload: {
    date: string;
    time: string;
    service_type: string;
    topic: string;
    counseling_mode: string;
    student_name?: string;
    student_class?: string;
    name?: string;
    class?: string;
  }) =>
    request<CounselingSchedule>('/counseling-schedules', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateSchedule: (id: string, payload: Partial<CounselingSchedule>) =>
    request<CounselingSchedule>(`/counseling-schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Journals
  getJournals: () => request<Journal[]>('/journals'),

  createJournal: (payload: {
    mood: string;
    title: string;
    feeling: string;
    problems?: string;
    actions_taken?: string;
    improvements?: string;
    next_goals?: string;
    is_shared_with_counselor: boolean;
    student_name?: string;
    student_class?: string;
    name?: string;
    class?: string;
  }) =>
    request<Journal>('/journals', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  giveJournalFeedback: (id: string, counselor_feedback: string) =>
    request<Journal>(`/journals/${id}/feedback`, {
      method: 'PUT',
      body: JSON.stringify({ counselor_feedback }),
    }),

  // Career
  getCareerContents: (category?: string) => {
    const q = category ? `?category=${encodeURIComponent(category)}` : '';
    return request<CareerContent[]>(`/career${q}`);
  },

  createCareerContent: (payload: Partial<CareerContent>) =>
    request<CareerContent>('/career', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateCareerContent: (id: string, payload: Partial<CareerContent>) =>
    request<CareerContent>(`/career/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteCareerContent: (id: string) =>
    request<{ message: string }>(`/career/${id}`, {
      method: 'DELETE',
    }),

  getCareerPlan: () => request<CareerPlan | null>('/career-plan'),

  saveCareerPlan: (payload: Partial<CareerPlan>) =>
    request<CareerPlan>('/career-plan', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Emergency Assistance
  sendEmergencyAssistance: (payload: { category: string; notes?: string; student_name?: string; student_class?: string }) =>
    request<{ message: string; data: AssistanceRequest }>('/emergency-assistance', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getEmergencyAssistance: () => request<AssistanceRequest[]>('/emergency-assistance'),

  updateEmergencyStatus: (id: string, status: string) =>
    request<AssistanceRequest>(`/emergency-assistance/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Admin Stats & Users
  getAdminStats: (filter?: string) =>
    request<AdminStatistics>(`/admin/statistics${filter ? `?filter=${filter}` : ''}`),

  getAdminUsers: () => request<User[]>('/admin/users'),
  getUsers: () => request<User[]>('/admin/users'),

  getExportCsvUrl: (type: 'consultations' | 'schedules' | 'assessments' | 'logs') =>
    `/api/admin/export-csv?type=${type}`,
};
