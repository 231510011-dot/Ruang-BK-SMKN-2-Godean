export type UserRole = 'siswa' | 'guru_bk';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  nis?: string;
  class?: string;
  class_name?: string;
  major?: string;
  avatar_url?: string;
  must_change_password?: boolean;
  created_at?: string;
}

export type MaterialCategory = 'BK Pribadi' | 'BK Sosial' | 'BK Belajar' | 'BK Karier';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Material {
  id: string;
  title: string;
  category: MaterialCategory;
  description: string;
  content: string;
  image?: string;
  video_url?: string;
  quiz_data?: QuizQuestion[];
  reflection_prompt?: string;
  read_count: number;
  created_at: string;
  updated_at: string;
}

export interface AssessmentQuestion {
  id: number;
  text: string;
  category: string;
}

export interface Assessment {
  id: string;
  title: string;
  category: string;
  description: string;
  questions: AssessmentQuestion[];
  created_at: string;
}

export interface AssessmentResult {
  id: string;
  user_id: string;
  user_name?: string;
  user_class?: string;
  assessment_id: string;
  assessment_title?: string;
  score: number;
  max_score: number;
  percentage: number;
  interpretation: string;
  recommendations: string[];
  answers: Record<number, number>;
  created_at: string;
}

export type UrgencyLevel = 'rendah' | 'sedang' | 'tinggi' | 'darurat';
export type ConsultationStatus = 'Terkirim' | 'Dibaca Guru BK' | 'Dalam Proses' | 'Sudah Ditanggapi' | 'Selesai';

export interface Consultation {
  id: string;
  user_id: string;
  user_name?: string;
  user_class?: string;
  topic: string;
  message: string;
  urgency: UrgencyLevel;
  status: ConsultationStatus;
  is_anonymous: boolean;
  response?: string;
  follow_up_notes?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

export type CounselingMode = 'Tatap Muka' | 'Online';
export type ScheduleStatus = 'Menunggu persetujuan' | 'Disetujui' | 'Ditolak' | 'Selesai' | 'Dibatalkan';

export interface CounselingSchedule {
  id: string;
  user_id: string;
  user_name?: string;
  user_class?: string;
  date: string;
  time: string;
  service_type: string;
  topic: string;
  counseling_mode: CounselingMode;
  status: ScheduleStatus;
  rejection_reason?: string;
  notes?: string;
  location_or_link?: string;
  created_at: string;
  updated_at: string;
}

export interface Journal {
  id: string;
  user_id: string;
  user_name?: string;
  user_class?: string;
  mood: string;
  title: string;
  feeling: string;
  problems?: string;
  actions_taken?: string;
  improvements?: string;
  next_goals?: string;
  is_shared_with_counselor: boolean;
  counselor_feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface CareerContent {
  id: string;
  title: string;
  category: string;
  content: string;
  summary: string;
  tags: string[];
  source_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CareerPlan {
  id: string;
  user_id: string;
  main_choice: 'Bekerja' | 'Kuliah' | 'Wirausaha' | 'Bekerja sambil kuliah' | 'Masih belum menentukan';
  target_after_grad: string;
  target_1_year: string;
  target_3_years: string;
  skills_needed: string;
  action_steps: string;
  updated_at: string;
}

export interface AssistanceRequest {
  id: string;
  user_id: string;
  user_name?: string;
  user_class?: string;
  category: string;
  notes?: string;
  status: 'Perlu Ditangani Segera' | 'Sedang Dihubungi' | 'Selesai';
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  user_name?: string;
  role?: string;
  activity: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AdminStatistics {
  summary: {
    totalStudents: number;
    activeStudents: number;
    totalMaterials: number;
    totalAssessmentsCompleted: number;
    totalConsultations: number;
    pendingConsultations: number;
    totalSchedules: number;
    schedulesToday: number;
    totalJournals: number;
    urgentAssistanceCount: number;
  };
  topMaterials: Material[];
  leastMaterials: Material[];
  categoryDistribution: { name: string; value: number }[];
  recentActivities: ActivityLog[];
  todaySchedulesList: CounselingSchedule[];
  urgentAssistanceList: AssistanceRequest[];
}
