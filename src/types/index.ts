export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  fullname: string;
  username?: string;
  profileimageurl?: string;
  lastaccess?: number;
  role?: UserRole;
  company?: string;
  department?: string;
}

export interface Course {
  id: string;
  fullname: string;
  shortname: string;
  summary?: string;
  courseimage?: string;
  progress?: number;
  categoryname?: string;
  format?: string;
  startdate?: number;
  enddate?: number;
  visible?: boolean;
  tags?: string[];
  type?: 'ILT' | 'VILT' | 'Self-paced';
  instructor?: string;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  rating?: number;
  enrollmentCount?: number;
}

export interface School {
  id: string;
  name: string;
  shortname: string;
  description?: string;
  city?: string;
  country?: string;
  logo?: string;
  userCount?: number;
  courseCount?: number;
  status: 'active' | 'inactive';
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export type UserRole = 'teacher' | 'trainer' | 'principal' | 'cluster_lead' | 'admin';

export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  upcomingSessions: number;
  achievements: number;
  totalUsers?: number;
  activeUsers?: number;
  completionRate?: number;
  totalEnrollments?: number;
  certificatesIssued?: number;
}

export interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'ILT' | 'VILT';
  trainer: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  attendees?: number;
  capacity?: number;
  location?: string;
  description?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: string;
  points?: number;
  level?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'competency' | 'knowledge' | 'skill';
  questions: AssessmentQuestion[];
  duration?: number;
  passingScore?: number;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'essay' | 'rating';
  options?: string[];
  correctAnswer?: string | number;
  points?: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: Course[];
  estimatedDuration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites?: string[];
  outcomes?: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'user' | 'course' | 'school' | 'system';
  data: any;
  generatedAt: number;
  format: 'pdf' | 'excel' | 'csv';
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  category: string;
  level: number;
  skills: string[];
  assessmentCriteria: string[];
}