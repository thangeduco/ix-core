import { z } from "zod";

export const startVideoSessionDto = z.object({
  student_user_id: z.string().min(1).optional(),
  device_info: z.string().optional(),
  start_at: z.string().optional()
});

export const finishVideoSessionDto = z.object({
  end_at: z.string().optional(),
  watched_seconds: z.number().min(0),
  completion_rate: z.number().min(0).max(1),
  is_completed: z.boolean()
});

export const createQuizAttemptDto = z.object({
  student_user_id: z.string().min(1).optional(),
  started_at: z.string().optional(),
  submitted_at: z.string().optional(),
  answers: z.array(
    z.object({
      question_id: z.string().min(1),
      selected_option_id: z.string().min(1)
    })
  ).min(1)
});

export const createHomeworkSubmissionDto = z.object({
  student_user_id: z.string().min(1).optional(),
  submission_note: z.string().optional(),
  zip_file_id: z.string().optional(),
  file_ids: z.array(z.string().min(1)).optional()
});

export const createClassworkResultDto = z.object({
  student_user_id: z.string().min(1),
  score: z.number().min(0),
  teacher_comment: z.string().optional()
});

export const createClassTestResultDto = z.object({
  student_user_id: z.string().min(1),
  score: z.number().min(0),
  teacher_comment: z.string().optional()
});

export const createPeriodicExamResultDto = z.object({
  student_user_id: z.string().min(1),
  score: z.number().min(0),
  rank_in_exam: z.number().int().positive().optional()
});

export const learningHistoryQueryDto = z.object({
  week_id: z.string().optional(),
  course_id: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});
