export type Role = 'student' | 'instructor' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: Role;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  price: number;
  instructor_id: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  is_published: boolean;
  created_at: string;
}

export interface Section {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
}

export interface Lesson {
  id: string;
  section_id: string;
  title: string;
  slug: string;
  content_type: 'video' | 'article' | 'quiz';
  video_url?: string;
  body_text?: string;
  order_index: number;
  is_preview: boolean;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: 'active' | 'completed';
  enrolled_at: string;
}
