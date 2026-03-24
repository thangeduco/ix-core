import { z } from "zod";

export const createCourseDto = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  subject: z.string().min(2),
  grade_level: z.string().min(1),
  course_type: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  thumbnail_file_id: z.string().optional()
});

export const updateCourseDto = z.object({
  code: z.string().min(2).optional(),
  name: z.string().min(2).optional(),
  subject: z.string().min(2).optional(),
  grade_level: z.string().min(1).optional(),
  course_type: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  thumbnail_file_id: z.string().optional()
});

export const createCourseWeekDto = z.object({
  week_no: z.number().int().positive(),
  title: z.string().min(2),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.string().optional()
});

export const createLessonDto = z.object({
  title: z.string().min(2),
  lesson_type: z.enum(["video", "reading", "live", "other"]),
  display_order: z.number().int().positive(),
  description: z.string().optional(),
  status: z.string().optional()
});

export const createQuizDto = z.object({
  title: z.string().min(2),
  quiz_type: z.enum(["weekly_quiz", "practice_quiz", "mock_test"]),
  time_limit_minutes: z.number().int().positive().optional(),
  max_attempts: z.number().int().positive().optional(),
  passing_score: z.number().optional(),
  status: z.string().optional()
});

export const createHomeworkDto = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  attachment_file_id: z.string().optional(),
  due_at: z.string().optional(),
  status: z.string().optional()
});

export const courseListQueryDto = z.object({
  subject: z.string().optional(),
  grade_level: z.string().optional(),
  course_type: z.string().optional(),
  status: z.string().optional(),
  keyword: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});
