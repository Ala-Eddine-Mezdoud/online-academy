import { LucideIcon } from 'lucide-react';

export type Page = 'dashboard' | 'courses' | 'students' | 'profile';

export interface TeacherStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  trend: string;
}

export interface Course {
  id: number;
  title: string;
  students: number;
  progress: number;
  status: 'active' | 'inactive';
}

export interface Student {
  id: number;
  name: string;
  course: string;
  progress: number;
  avatar: string;
}

export interface Notification {
  id: number;
  text: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

export interface MenuItem {
  id: Page;
  label: string;
  icon: LucideIcon;
}
