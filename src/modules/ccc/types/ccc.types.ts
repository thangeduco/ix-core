export type CourseStatus = "draft" | "published" | "archived";
export type LessonType = "video" | "reading" | "live" | "other";
export type QuizType = "weekly_quiz" | "practice_quiz" | "mock_test";
export type MaterialType = "pdf" | "image" | "doc" | "link" | "other";

export interface Course {
  id: string;
  code: string;
  name: string;
  subject: string;
  grade_level: string;
  course_type: string;
  description: string | null;
  status: CourseStatus;
  thumbnail_file_id: string | null;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CourseWeek {
  id: string;
  course_id: string;
  week_no: number;
  title: string;
  description: string | null;
  start_date: Date | null;
  end_date: Date | null;
  status: string;
  created_at: Date;
  updated_at?: Date;
}

export interface Lesson {
  id: string;
  course_week_id: string;
  title: string;
  lesson_type: LessonType;
  display_order: number;
  description: string | null;
  status: string;
  created_at: Date;
}

export interface Quiz {
  id: string;
  course_week_id: string;
  title: string;
  quiz_type: QuizType;
  time_limit_minutes: number | null;
  max_attempts: number | null;
  passing_score: number | null;
  status: string;
}

export interface HomeworkSheet {
  id: string;
  course_week_id: string;
  title: string;
  description: string | null;
  attachment_file_id: string | null;
  due_at: Date | null;
  status: string;
}
